import '@root/global.scss';

import { AUDITOR_DASHBOARD_NAVIGATION, AUDITOR_SIDE_NAVIGATION } from '@root/content/dashboard';
import { convertObjectKeysToCamelCase } from '@root/common/utilities';
import { FormTypeEnum } from '@root/common/types';
import { redirect } from 'next/navigation';
import formatEVPReportDocument, { fetchPostgresDocumentById, filterPostgresMessagesByFormType } from '@root/resolvers/PostgresResolvers';
import HardwareSection from '@root/pages/sections/HardwareSection';
import Page from '@components/Page';

export default function Dashboard({ sessionKey, viewer, documentId, userId, messages, document }) {
  if (!userId) return redirect('/app');

  // const profileType = viewer.data.profile.profile_type;
  // if (profileType !== UserProfileTypeEnum.STORAGE_PROVIDER) {
  //   return redirect('/authenticate');
  // }

  const menu = AUDITOR_SIDE_NAVIGATION;
  const dashboard = AUDITOR_DASHBOARD_NAVIGATION;

  return (
    <Page title="Title" description="Description" url="https://novaenergy.ai/evp-results">
      <HardwareSection auditor={true} dashboard={dashboard} document={document} documentId={documentId} menu={menu} viewer={viewer} sessionKey={sessionKey} messages={messages} />
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
  const documentData = await fetchPostgresDocumentById(sessionKey, id);

  const auditDocument = documentData.audit_document;
  //format the document
  const auditReport = formatEVPReportDocument(auditDocument, id);
  const evpReport = formatEVPReportDocument(auditReport.evpReport, id);
  const hardwareConfiguration = evpReport.hardwareConfiguration;
  const document = convertObjectKeysToCamelCase(hardwareConfiguration);

  //get user profile
  let profile;

  try {
    const response = await fetch(`https://api-nova.onrender.com/api/users?userId=${userId}`, {
      headers: { 'X-API-KEY': sessionKey },
    });

    const result = await response.json();
    const formattedProfile = convertObjectKeysToCamelCase(result.data.profile);
    profile = formattedProfile;
  } catch (e) {
    return { props: {} };
  }

  //get messages from posts
  let allMessages = null;
  const formType = FormTypeEnum.HARDWARE_CONFIGURATION;

  try {
    const response = await fetch('https://api-nova.onrender.com/api/posts', {
      method: 'POST',
      headers: { 'X-API-KEY': sessionKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document_id: documentId,
        type: 'GENERAL',
      }),
    });
    const result = await response.json();

    if (result && result.data) {
      allMessages = result.data;
    }
  } catch (e) {}

  const messages = filterPostgresMessagesByFormType({ allMessages, formType });

  return {
    props: { sessionKey, messages, userId, viewer, document, documentId, profile },
  };
}
