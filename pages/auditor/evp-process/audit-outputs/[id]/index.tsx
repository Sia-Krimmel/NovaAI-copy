import '@root/global.scss';

import { AUDITOR_DASHBOARD_NAVIGATION, AUDITOR_SIDE_NAVIGATION } from '@root/content/dashboard';
import { convertNestedObjectKeysToCamelCase, convertObjectKeysToCamelCase } from '@root/common/utilities';
import { redirect } from 'next/navigation';
import AuditOutputs from '@root/pages/sections/AuditOutputsSection';
import formatEVPReportDocument, { fetchPostgresDocumentById, formatAuditOutputs, formatGreenscoresFromPostgres } from '@root/resolvers/PostgresResolvers';
import Page from '@components/Page';

const title = 'Nova Energy - Audit Outputs';
const description = 'Audit Outputs';

export default function AuditReview({ auditOutputs, documentId, document, greenscores, sessionKey, viewer, userId }) {
  if (!userId) return redirect('/app');

  // const profileType = viewer.data.profile.profile_type;
  // if (profileType !== UserProfileTypeEnum.STORAGE_PROVIDER) {
  //   return redirect('/app');
  // }
  const dashboard = AUDITOR_DASHBOARD_NAVIGATION;
  const menu = AUDITOR_SIDE_NAVIGATION;
  return (
    <Page title={title} description={description} url="https://novaenergy.ai/location">
      <AuditOutputs
        auditOutputs={auditOutputs}
        dashboard={dashboard}
        greenscores={greenscores}
        menu={menu}
        documentId={documentId}
        document={document}
        sessionKey={sessionKey}
        userId={userId}
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
  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const auditDocument = documentData.audit_document;

  const auditReport = formatEVPReportDocument(auditDocument, documentId);
  const document = formatEVPReportDocument(auditReport.evpReport, documentId);
  const greenscoreData = document?.auditReview?.greenscore || null;
  const greenscores = formatGreenscoresFromPostgres({ greenscore: greenscoreData });
  const auditReview = document?.auditReview ? convertObjectKeysToCamelCase(document?.auditReview) : null;
  const auditOutputsData = document?.auditReview?.audit_outputs ? convertNestedObjectKeysToCamelCase(document?.auditReview?.audit_outputs) : null;
  const auditOutputs = formatAuditOutputs(auditOutputsData);

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
    props: { auditOutputs, sessionKey, userId, viewer, document, documentId, profile, greenscores },
  };
}
