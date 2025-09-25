import '@root/global.scss';

import { convertObjectKeysToCamelCase } from '@root/common/utilities';
import { redirect } from 'next/navigation';
import { UserProfileTypeEnum } from '@root/common/types';
import formatEVPReportDocument, { fetchPostgresDocumentById } from '@root/resolvers/PostgresResolvers';
import Page from '@components/Page';
import AuditRequestSection from '@root/pages/sections/AuditRequestSection';
import { DASHBOARD_NAVIGATION } from '@root/content/dashboard';

const title = 'Nova Energy - Location';
const description = 'Location information';

export default function AuditReview({ location, sessionKey, viewer, documentId, userId, document }) {
  if (!userId) return redirect('/app');

  const profileType = viewer.data.profile.profile_type;
  // if (profileType !== UserProfileTypeEnum.STORAGE_PROVIDER || profileType !== UserProfileTypeEnum.PROVIDER || profileType !== UserProfileTypeEnum.AUDITOR) {
  //   return redirect('/app');
  // }

  const dashboard = DASHBOARD_NAVIGATION;

  return (
    <Page title={title} description={description} url="https://novaenergy.ai/location">
      <AuditRequestSection documentId={documentId} dashboard={dashboard} />
    </Page>
  );
}

export async function getServerSideProps(context) {
  let viewer = null;
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

  const { id } = context.params;
  const documentId = id;

  //get document by document id
  const documentData = await fetchPostgresDocumentById(sessionKey, id);
  const auditDocument = documentData.audit_document;

  const auditReport = formatEVPReportDocument(auditDocument, id);
  const document = formatEVPReportDocument(auditReport.evpReport, id);

  //get user profile
  let location;

  try {
    const response = await fetch(`https://api-nova.onrender.com/api/users?userId=${userId}`, {
      headers: { 'X-API-KEY': sessionKey },
    });

    const result = await response.json();
    const formattedProfile = convertObjectKeysToCamelCase(result.data.profile);
    location = formattedProfile;
  } catch (e) {
    return null;
  }

  return {
    props: { sessionKey, userId, viewer, document, documentId, location },
  };
}
