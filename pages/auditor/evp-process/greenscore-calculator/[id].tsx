import React from 'react';

import { AUDITOR_DASHBOARD_NAVIGATION, AUDITOR_SIDE_NAVIGATION } from '@root/content/dashboard';
import { convertObjectKeysToCamelCase } from '@root/common/utilities';
import formatEVPReportDocument, { fetchPostgresDocumentById, formatGreenscoresFromPostgres } from '@root/resolvers/PostgresResolvers';
import GreenScoreCalculatorSection from '@root/pages/sections/GreenScoreCalculatorSection';
import Page from '@components/Page';

function GreenscoreCalculator({ auditDocument, documentId, document, greenscores, providerProfile, locationInformation, sessionKey, viewer, userId }) {
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);

  const menu = AUDITOR_SIDE_NAVIGATION;
  const dashboard = AUDITOR_DASHBOARD_NAVIGATION;

  return (
    <Page title={`Report ${documentId}`} description={`date`}>
      <GreenScoreCalculatorSection
        dashboard={dashboard}
        document={document}
        documentId={documentId}
        greenscores={greenscores}
        locationInformation={locationInformation}
        providerProfile={providerProfile}
        menu={menu}
        sessionKey={sessionKey}
        userId={userId}
        viewer={viewer}
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

  let providerProfile;

  if (viewer) {
    providerProfile = convertObjectKeysToCamelCase(viewer.data.profile);
  }

  const { id } = context.params;
  const documentId = id;

  //get document by document id
  const documentData = await fetchPostgresDocumentById(sessionKey, id);
  const auditDocument = documentData.audit_document;

  const auditReport = formatEVPReportDocument(auditDocument, id);
  const document = formatEVPReportDocument(auditReport.evpReport, id);

  const locationDocument = auditReport.evpReport.location_information;
  const locationInformation = convertObjectKeysToCamelCase(locationDocument);

  //TO DO: get providers profile
  const greenscoresData = document?.auditReview || null;
  const greenscores = formatGreenscoresFromPostgres(greenscoresData);

  return {
    props: { auditDocument, sessionKey, userId, viewer, document, locationInformation, providerProfile, documentId, greenscores },
  };
}

export default GreenscoreCalculator;
