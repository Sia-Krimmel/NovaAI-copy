import React from 'react';

import Page from '@components/Page';
import EVPReport from '@root/components/EVPReport';
import ReportLayout from '@root/components/ReportLayout';
import formatEVPReportDocument, { fetchPostgresDocumentById, formatGreenscoresFromPostgres } from '@root/resolvers/PostgresResolvers';

function Report({ greenscores, sessionKey, userId, viewer, document, documentId }) {
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);

  return (
    <Page title={`Report ${documentId}`} description={`date`}>
      <ReportLayout>
        <EVPReport greenscores={greenscores} document={document} documentId={documentId} userId={userId} showSummaryText={true} />
      </ReportLayout>
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
  const document = formatEVPReportDocument(auditReport.evpReport, id);

  //greenscores
  const greenscoresData = document?.auditReview || null;
  const greenscores = formatGreenscoresFromPostgres(greenscoresData);

  return {
    props: { greenscores, sessionKey, userId, viewer, document, documentId },
  };
}

export default Report;
