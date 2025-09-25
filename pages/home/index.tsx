import '@root/global.scss';

import { convertNestedObjectKeysToCamelCase } from '@root/common/utilities';
import { DocumentType } from '@root/common/types';
import { createDocumentMessageMapResolver, fetchPostgresExisitingUserDocuments } from '../../resolvers/PostgresResolvers';
import { redirect } from 'next/navigation';
import DashboardSection from '../sections/DashboardSection';
import Page from '@root/components/Page';

const title = 'Nova Energy - Home';
const description = 'This is your home page';

export default function Dashboard({ sessionKey, messagesInDocuments, allDocuments, profile, viewer, userId, documentsFormatted }) {
  if (!userId) return redirect('/app');

  // if (profile?.profile_type !== UserProfileTypeEnum.STORAGE_PROVIDER) return redirect('/authenticate');
  return (
    <Page title={title} description={description} url="https://novaenergy.ai/home">
      <DashboardSection
        allDocuments={allDocuments}
        documentsFormatted={documentsFormatted}
        sitekey={sessionKey}
        userId={userId}
        profile={profile}
        messagesInDocuments={messagesInDocuments}
      />
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
  const documentRecords = await Promise.all([fetchPostgresExisitingUserDocuments({ sitekey: sessionKey, documentType, userId })]);
  const allDocuments = documentRecords[0]?.data ?? null;
  const documentsFormatted = convertNestedObjectKeysToCamelCase(allDocuments);

  const messagesInDocuments = await createDocumentMessageMapResolver(allDocuments, sessionKey);

  return {
    props: { sessionKey, userId, viewer, allDocuments, documentsFormatted, messagesInDocuments, profile },
  };
}
