import '@root/global.scss';

import { AUDITOR_DASHBOARD_NAVIGATION, AUDITOR_SIDE_NAVIGATION } from '@root/content/dashboard';
import { convertNestedObjectKeysToCamelCase, convertObjectKeysToCamelCase } from '@root/common/utilities';
import { redirect } from 'next/navigation';
import AuditOutputs from '@root/pages/sections/AuditOutputsSection';
import formatEVPReportDocument, { fetchPostgresDocumentById, formatAuditOutputs, formatGreenscoresFromPostgres } from '@root/resolvers/PostgresResolvers';
import Page from '@components/Page';
import { P } from '@root/components/typography';
import ReportLayout from '@root/components/ReportLayout';
import EVPReport from '@root/components/EVPReport';

const title = 'Nova Energy - Location';
const description = 'Location information';

export default function EVPAttestation({ auditOutputs, documentId, document, greenscores, sessionKey, viewer, userId }) {
  if (!userId) return redirect('/app');

  // const profileType = viewer.data.profile.profile_type;
  // if (profileType !== UserProfileTypeEnum.STORAGE_PROVIDER) {
  //   return redirect('/app');
  // }
  const dashboard = AUDITOR_DASHBOARD_NAVIGATION;
  const menu = AUDITOR_SIDE_NAVIGATION;
  return (
    <Page title={title} description={description} url="https://novaenergy.ai/attest-evp-report">
      <ReportLayout>
        <EVPReport showSummaryText={false} greenscores={greenscores} document={document} documentId={documentId} userId={userId} />
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
