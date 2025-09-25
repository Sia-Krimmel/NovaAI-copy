import '@root/global.scss';

import { convertObjectKeysToCamelCase } from '@root/common/utilities';
import { FormTypeEnum, UserProfileTypeEnum } from '@root/common/types';
import { redirect } from 'next/navigation';
import formatEVPReportDocument, { fetchPostgresDocumentById, filterPostgresMessagesByFormType } from '@root/resolvers/PostgresResolvers';
import Page from '@components/Page';
import RenewableEnergyProducedSection from '@root/pages/sections/RenewableEnergyProduced';
import { DASHBOARD_NAVIGATION, SIDE_NAVIGATION } from '@root/content/dashboard';

const title = 'Nova Energy - Location';
const description = 'Location information';

export default function RenewableEnergyProduced({ sessionKey, messages, energyProductionData, viewer, documentId, userId, document }) {
  if (!userId) return redirect('/app');

  //const profileType = viewer.data.profile.profile_type;
  // if (profileType !== UserProfileTypeEnum.STORAGE_PROVIDER || profileType !== UserProfileTypeEnum.PROVIDER || profileType !== UserProfileTypeEnum.AUDITOR) {
  //   return redirect('/app');
  // }
  const menu = SIDE_NAVIGATION;
  const dashboard = DASHBOARD_NAVIGATION;

  return (
    <Page title={title} description={description} url="https://novaenergy.ai/renewable-energy-produced">
      <RenewableEnergyProducedSection
        auditor={false}
        dashboard={dashboard}
        document={document}
        menu={menu}
        userId={userId}
        messages={messages}
        viewer={viewer}
        documentId={documentId}
        sessionKey={sessionKey}
      />
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
  const evpReport = formatEVPReportDocument(auditReport.evpReport, id);
  const energyProductionDocument = evpReport.energyProduction;
  const document = convertObjectKeysToCamelCase(energyProductionDocument);

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
    return null;
  }

  //get messages from posts
  let allMessages = null;
  const formType = FormTypeEnum.RENEWABLE_ENERGY_PRODUCED;

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
