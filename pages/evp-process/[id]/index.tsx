import '@root/global.scss';

import { convertNestedObjectKeysToCamelCase } from '@root/common/utilities';
import { DASHBOARD_NAVIGATION } from '@root/content/dashboard';
import EnergyValidationProcessSectionTwo from '@root/pages/sections/EnergyValidationProcessSectionTwo';
import formatEVPReportDocument, { fetchPostgresDocumentById } from '@root/resolvers/PostgresResolvers';
import Page from '@components/Page';
import React from 'react';

export default function Dashboard({ sessionKey, viewer, documentId, userId, document, messages }) {
  // const profileType = viewer.data.profile.profile_type;
  // if (profileType !== UserProfileTypeEnum.STORAGE_PROVIDER) {
  //   return redirect('/authenticate');
  // }
  const dashboard = DASHBOARD_NAVIGATION;

  return (
    <Page title="Get Started with EVP" description="Description" url="https://novaenergy.ai/evp-results">
      <EnergyValidationProcessSectionTwo auditor={false} dashboard={dashboard} document={document} documentId={documentId} sessionKey={sessionKey} />
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
  const documentUnformatted = formatEVPReportDocument(auditReport.evpReport, id);
  const document = convertNestedObjectKeysToCamelCase(documentUnformatted);

  //get messages from posts
  let allMessages = null;

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

  return {
    props: { sessionKey, userId, viewer, document, documentId, allMessages },
  };
}
