import '@root/global.scss';

import { convertObjectKeysToCamelCase } from '@root/common/utilities';
import { DASHBOARD_NAVIGATION, SIDE_NAVIGATION } from '@root/content/dashboard';
import { FormTypeEnum, ProviderProfile } from '@root/common/types';
import { redirect } from 'next/navigation';
import formatEVPReportDocument, { fetchPostgresDocumentById, fetchPostgresExisitingUserRecord, filterPostgresMessagesByFormType } from '@root/resolvers/PostgresResolvers';
import LocationSection from '@root/pages/sections/LocationSection';
import Page from '@components/Page';

const title = 'Nova Energy - Location';
const description = 'Location information';

export default function Location({ sessionKey, profile, profileLocation, viewer, documentId, userId, messages, document }) {
  if (!userId) return redirect('/app');

  // const profileType = viewer.data.profile.profile_type;
  // if (profileType !== UserProfileTypeEnum.STORAGE_PROVIDER || profileType !== UserProfileTypeEnum.PROVIDER || profileType !== UserProfileTypeEnum.AUDITOR) {
  //   return redirect('/app');
  // }

  const menu = SIDE_NAVIGATION;
  const dashboard = DASHBOARD_NAVIGATION;

  return (
    <Page title={title} description={description} url="https://novaenergy.ai/location">
      <LocationSection
        profile={profile}
        auditor={false}
        dashboard={dashboard}
        document={document}
        documentId={documentId}
        menu={menu}
        messages={messages}
        profileLocation={profileLocation}
        sessionKey={sessionKey}
        userId={userId}
        viewer={viewer}
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
    return { props: {} };
  }

  const { id } = context.params;
  const documentId = id;

  //get document by document id
  const documentData = await fetchPostgresDocumentById(sessionKey, id);
  const auditDocument = documentData.audit_document;

  const auditReport = formatEVPReportDocument(auditDocument, id);
  const evpReport = formatEVPReportDocument(auditReport.evpReport, id);
  const locationDocument = evpReport.locationInformation;
  const document = convertObjectKeysToCamelCase(locationDocument);

  //get location data from profile
  let profileLocation;

  try {
    const response = await fetch(`https://api-nova.onrender.com/api/users?userId=${userId}`, {
      headers: { 'X-API-KEY': sessionKey },
    });

    const result = await response.json();
    const formattedProfile = convertObjectKeysToCamelCase(result?.data?.profile);
    profileLocation = formattedProfile;
  } catch (e) {
    return { props: {} };
  }

  //get messages from posts
  let allMessages = null;
  const formType = FormTypeEnum.LOCATION_INFORMATION;

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

  const profileData = await Promise.all([fetchPostgresExisitingUserRecord({ sitekey: sessionKey, userId })]);
  const profileDataUnformatted = profileData[0]?.data?.profile ?? null;
  const profile = convertObjectKeysToCamelCase(profileDataUnformatted) as ProviderProfile;

  return {
    props: { sessionKey, profile, messages, userId, viewer, document, documentId, profileLocation },
  };
}
