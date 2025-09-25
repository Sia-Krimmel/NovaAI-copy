import React from 'react';

import Page from '@components/Page';
import GreenscoreAuditInput from '@root/components/GreenscoreAuditInput';
import GreenscoreReportLayout from '@root/components/GreenscoreReportLayout';
import formatEVPReportDocument, { fetchPostgresDocumentById, formatGreenscoresFromPostgres } from '@root/resolvers/PostgresResolvers';

export default function GreenscoreAuditReport({ document, greenscores, sessionKey, documentId }) {
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);

  return (
    <Page title={`Report ${documentId}`} description={`date`}>
      <GreenscoreReportLayout>
        <GreenscoreAuditInput greenscores={greenscores} document={document} documentId={documentId} sessionKey={sessionKey} />{' '}
      </GreenscoreReportLayout>
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
  const document = formatEVPReportDocument(auditReport, id);

  const greenscoreData = document?.auditReview?.greenscore || null;
  const greenscores = formatGreenscoresFromPostgres(greenscoreData);

  //get user profile
  return {
    props: { sessionKey, userId, viewer, document, documentId, greenscores },
  };
}
