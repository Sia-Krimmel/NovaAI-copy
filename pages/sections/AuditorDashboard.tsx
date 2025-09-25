'use client';

import styles from '@components/AuditorDashboardSection.module.scss';
import sideNavStyles from '@components/SideNavigaton.module.scss';

import * as Utilities from 'common/utilities';

import { AUDITOR_DASHBOARD_NAVIGATION, AUDITOR_SIDE_NAVIGATION } from '@root/content/dashboard';
import { isEvpReportAudited, isEvpReportCompleteAndFullyCompleted, isEvpReportIncomplete, isEvpReportToBeAudited } from '@root/resolvers/HelperResolvers';
import { ReviewStatusEnum } from '@root/common/types';
import AuditorTable from '@root/components/AuditorTable';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import PageGutterWrapper from '@root/components/PageGutterWrapper';

export default function AuditorDashboardSection({ userId, sessionKey, allDocuments, messagesInDocuments, profile }) {
  const menu = AUDITOR_SIDE_NAVIGATION;
  const dashboard = AUDITOR_DASHBOARD_NAVIGATION;
  const evpReportsCompletedDocuments = allDocuments?.filter(isEvpReportCompleteAndFullyCompleted);
  const completeEvpReportsToBeAudited = evpReportsCompletedDocuments?.filter(isEvpReportToBeAudited);
  const auditedEvpReports = evpReportsCompletedDocuments?.filter(isEvpReportAudited);
  const evpReportsInProgress = allDocuments?.filter(isEvpReportIncomplete);

  return (
    <div className={sideNavStyles.container}>
      <DashboardSideNavbar firstLink={menu?.firstLink ?? ''} firstTitle={menu?.firstTitle ?? ''} menuNavigation={menu} />{' '}
      <div>
        <DashboardTopNavbar dashboardNavigation={dashboard} onHandleThemeChange={Utilities.onHandleThemeChange} />
        <PageGutterWrapper style={{ paddingTop: '1rem' }}>
          <div className={styles.reportingSection}>Auditor Report Portal</div>

          <div className={styles.gridLayoutTables}>
            <div className={styles.evpTable}>
              <AuditorTable
                title={'Completed EVP Reports To Review'}
                allDocuments={completeEvpReportsToBeAudited}
                length={allDocuments?.length ?? 0}
                reportStatus={ReviewStatusEnum.NEEDS_REVIEW}
                messagesInDocuments={messagesInDocuments}
                sessionKey={sessionKey}
              />
            </div>
          </div>
          <div className={styles.gridLayoutTables}>
            <div className={styles.evpTable}>
              <AuditorTable
                title={'EVP Reports in Progress'}
                allDocuments={evpReportsInProgress}
                length={allDocuments?.length ?? 0}
                reportsInProgress={true}
                reportStatus={ReviewStatusEnum.IN_PROGRESS}
                messagesInDocuments={messagesInDocuments}
                sessionKey={sessionKey}
              />
            </div>
          </div>
          <div className={styles.gridLayoutTables}>
            <div className={styles.evpTable}>
              <AuditorTable title={'Audited EVP Reports'} allDocuments={auditedEvpReports} length={allDocuments?.length ?? 0} reportStatus={ReviewStatusEnum.AUDITED} />
            </div>
          </div>
        </PageGutterWrapper>
      </div>
    </div>
  );
}
