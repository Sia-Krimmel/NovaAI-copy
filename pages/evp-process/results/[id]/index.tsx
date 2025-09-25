import '@root/global.scss';

import { convertObjectKeysToCamelCase } from '@root/common/utilities';
import { DASHBOARD_NAVIGATION, SIDE_NAVIGATION } from '@root/content/dashboard';
import formatEVPReportDocument, { fetchPostgresDocumentById } from '@root/resolvers/PostgresResolvers';
import Page from '@components/Page';
import PreliminaryResultsRecMatchingOptionsSection from '@root/pages/sections/PreliminaryResultsRecMatchingOptionsSection';

export default function PreliminaryResultsRecMatchingOptions({ evpReport, locationDocument, electricityDocument, sessionKey, viewer, documentId, userId, messages, document }) {
  //const profileType = viewer.data.profile.profile_type;
  // if (profileType !== UserProfileTypeEnum.STORAGE_PROVIDER || profileType !== UserProfileTypeEnum.PROVIDER || profileType !== UserProfileTypeEnum.AUDITOR) {
  //   return redirect('/app');
  // }

  const menu = SIDE_NAVIGATION;
  const dashboard = DASHBOARD_NAVIGATION;

  return (
    <Page title="Title" description="Description" url="https://novaenergy.ai/evp-results">
      <PreliminaryResultsRecMatchingOptionsSection
        electricityDocument={electricityDocument}
        dashboard={dashboard}
        evpReport={evpReport}
        auditor={false}
        document={document}
        documentId={documentId}
        locationDocument={locationDocument}
        menu={menu}
        messages={messages}
        viewer={viewer}
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
  const auditReport = formatEVPReportDocument(documentData.audit_document, id);
  const evpReport = formatEVPReportDocument(auditReport.evpReport, id);

  const electricityConsumptionDocument = evpReport.electricityConsumption;
  const electricityDocument = convertObjectKeysToCamelCase(electricityConsumptionDocument);

  const locationInformationDocument = evpReport.locationInformation;
  const locationDocument = convertObjectKeysToCamelCase(locationInformationDocument);

  const preliminaryResults = evpReport.preliminaryResultsRecMatching;
  const document = convertObjectKeysToCamelCase(preliminaryResults);

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

  return {
    props: { evpReport, sessionKey, userId, viewer, document, documentId, profile, electricityDocument, locationDocument },
  };
}
