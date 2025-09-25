'use client';

import styles from '@components/DashboardSection.module.scss';
import sideNavStyles from '@components/SideNavigaton.module.scss';
import gridStyles from '@root/components/GridStyles.module.scss';

import * as Utilities from 'common/utilities';

import { createPostgresUserEVPDocument, formatReportsToAuditDataFromPostgres } from '@root/resolvers/PostgresResolvers';
import { DASHBOARD_NAVIGATION, PROVIDER_DASHBOARD_SIDE_NAVIGATION } from '@root/content/dashboard';
import { DocumentType, ReviewStatusEnum } from '../../common/types';
import { H3, P } from '@root/components/typography';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuditProgressCards from '@root/components/AuditProgressCard';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import GreenScoreCard from '@root/components/GreenScoreCard';
import PageGutterWrapper from '@root/components/PageGutterWrapper';
import StarsSVG from '@root/components/svgs/StarsSVG';
import Table from '@root/components/Table';

export default function DashboardSection({ userId, messagesInDocuments, sitekey, allDocuments, documentsFormatted, profile }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const menu = PROVIDER_DASHBOARD_SIDE_NAVIGATION;
  const dashboard = DASHBOARD_NAVIGATION;

  const auditData = formatReportsToAuditDataFromPostgres(allDocuments) ?? null;
  const router = useRouter();

  const handleCreateNewAudit = async (e) => {
    setLoading(true);
    setError(null);
    const currentDate = new Date().toISOString().replace('T', ' ').replace('Z', '');

    //To Do: add the types
    const audit_document: any = {
      created_at: currentDate,
      type: DocumentType.STORAGE_PROVIDER_AUDIT_REPORT,
      evp_report: {
        type: DocumentType.EVP_DOCUMENT,
        user_id: userId,
        entity_company: profile?.entity_company,
        created_at: currentDate,
        updated_at: currentDate,
        submitted_at: null,
        audit_status: ReviewStatusEnum.NOT_STARTED,
        location_information: {},
        hardware_configuration: {},
        water_consumption: {},
        electricity_consumption: {},
        energy_production: {},
        renewable_energy_procurement: {},
        preliminary_results_rec_matching: {},
        audit_review: {
          provider_evp_status: ReviewStatusEnum.NOT_STARTED,
          review_status: ReviewStatusEnum.NOT_STARTED,
          auditor_evp_output_status: ReviewStatusEnum.NOT_STARTED,
        },
      },
      greenscore: {},
    };

    try {
      const response = await createPostgresUserEVPDocument({
        userId,
        sitekey,
        audit_document: Utilities.convertObjectKeysToSnakeCase(audit_document),
      });

      if (response.success) {
        setSuccess(true);
        const documentId = response?.result?.data?.id ?? '';

        router.push(`/evp-process/${documentId}`);
      } else {
        console.error('Failed to create new audit:', response.error);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={sideNavStyles.container}>
      <DashboardSideNavbar provider={true} firstLink={''} firstTitle={''} adminNavigation={menu} />
      <div>
        <DashboardTopNavbar dashboardNavigation={dashboard} onHandleThemeChange={Utilities.onHandleThemeChange} />

        <PageGutterWrapper style={{ paddingTop: '1rem' }}>
          <div className={styles.headerContainer}>
            <div className={styles.header}>
              <H3 className={styles.headerTitle}>
                {profile?.full_name && `Hi ${profile?.full_name},`} <br />
                welcome to your reporting portal
              </H3>
              {/* <StarsSVG alt="star-icon" className={styles.starIcon} /> */}
            </div>

            <div className={styles.reportingSection}>
              <P className={styles.reportingText}>Here you'll find the tools to manage reports. Create a new audit to get started or continue an existing one. </P>

              <Button style={ButtonStyleEnum.SQUARE_BLACK} onClick={handleCreateNewAudit}>
                Create New Audit
              </Button>
            </div>
          </div>
          <div className={styles.gridLayoutTables} id="ongoing-audits">
            <div className={styles.evpTable}>
              <Table title={'Audit Results'} allDocuments={allDocuments} length={allDocuments?.length ?? 0} messagesInDocuments={messagesInDocuments} />
            </div>

            {auditData && (
              <div className={styles.greenscoreTable}>
                <div className={styles.greenscoresSection}>
                  <AuditProgressCards title={'Ongoing Audits'} data={auditData} />
                </div>
              </div>
            )}
          </div>
          <div className={styles.gridLayoutTables} id="greenscores">
            <div className={Utilities.classNames(styles.greenscoreTable)}>
              <p style={{ paddingBottom: '16px', color: 'var(--color-text)' }} className={styles.greenScores}>
                Green Scores
              </p>
              <div className={gridStyles.threeColumnGrid}>
                {documentsFormatted?.map((item, index) => {
                  const greenscores = item?.data?.greenscore ?? [];
                  return greenscores?.map((scoreItem, scoreIndex) => {
                    const greenscore = scoreItem?.greenscore?.greenScore;
                    const greenscoreDate = scoreItem?.date;
                    const documentId = scoreItem?.greenscore?.documentId;

                    return (
                      <GreenScoreCard
                        key={`${index}-${scoreIndex}`}
                        greenscore={greenscore}
                        greenscoreDate={greenscoreDate}
                        greenScoreReportLink={`/report/${documentId}`}
                        withBorder={true}
                        withButton={true}
                      />
                    );
                  });
                })}
              </div>
            </div>
          </div>
        </PageGutterWrapper>
      </div>
    </div>
  );
}
