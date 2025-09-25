import '@root/global.scss';

import Page from '@components/Page';

import { createDocumentMessageMapResolver, fetchPostgresAllProvidersDocuments, getEntityCompanyByUserId } from '@root/resolvers/PostgresResolvers';
import { DocumentType } from '@root/common/types';
import { redirect } from 'next/navigation';
import AuditorDashboardSection from '../sections/AuditorDashboard';

const title = 'Nova Energy - Auditor Home';
const description = 'This is your auditor dashboard';

export default function AuditorDashboard({ sessionKey, messagesInDocuments, allDocuments, profile, viewer, userId, documentsFormatted }) {
  if (!userId) return redirect('/app');

  return (
    <Page title={title} description={description} url="https://novaenergy.ai/auditor-home">
      <AuditorDashboardSection allDocuments={allDocuments} messagesInDocuments={messagesInDocuments} sessionKey={sessionKey} userId={userId} profile={profile} />
    </Page>
  );
}

export async function getServerSideProps(context) {
  let viewer: any = null;
  let sessionKey = context.req.cookies['sitekey'] || '';
  let userId = context.req.cookies['userId'] || '';

  if (!userId || userId == '') {
    return {
      redirect: {
        destination: '/app',
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch('https://api-nova.onrender.com/api/users/viewer', {
      method: 'PUT',
      headers: { 'X-API-KEY': sessionKey, 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (result && result.viewer) {
      viewer = result.viewer;
    }
  } catch (e) {
    return null;
  }

  const profile = viewer?.data?.profile ?? null;
  const documentType = DocumentType.STORAGE_PROVIDER_AUDIT_REPORT;
  const documentRecords = await Promise.all([fetchPostgresAllProvidersDocuments({ sitekey: sessionKey, documentType })]);
  const documents = documentRecords[0] || null;

  interface Document {
    created_at: string;
    [key: string]: any;
  }

  //Add Entity Company
  const documentsUnformatted: Document[] = await Promise.all(
    documents.map(async (doc) => {
      const entity_company = await getEntityCompanyByUserId(doc.user_id, sessionKey);
      return { ...doc, entity_company };
    })
  );

  const allDocuments: Document[] = documentsUnformatted.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  //get all messeges
  const messagesInDocuments = await createDocumentMessageMapResolver(allDocuments, sessionKey);

  return {
    props: { sessionKey, userId, viewer, allDocuments, messagesInDocuments, profile },
  };
}
