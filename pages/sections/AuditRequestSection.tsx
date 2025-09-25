'use client';

import * as Utilities from 'common/utilities';

import styles from '@components/AuditRequestSection.module.scss';
import gridStyles from '@components/GridStyles.module.scss';

import { EVPStatuses } from '@root/common/types';
import { P } from '@root/components/typography';
import { SIDE_NAVIGATION } from '@root/content/dashboard';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import GreenScoreCard from '@root/components/GreenScoreCard';
import GreenscoreResult from '@root/components/GreenscoreResult';
import HeaderText from '@root/components/HeaderText';
import PageGutterWrapper from '@root/components/PageGutterWrapper';
import React, { useState } from 'react';

export default function AuditRequestSection({ dashboard, documentId, document, userId, sessionKey }: any) {
  const [formStatuses, setFormStatuses] = React.useState<EVPStatuses | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [comments, setComments] = useState('');

  const menu = SIDE_NAVIGATION;

  const auditOutputs = document?.auditReview?.audit_outputs;
  const greenscores = document?.auditReview?.greenscore;

  return (
    <div className={styles.container}>
      <DashboardSideNavbar firstIcon={menu?.firstIcon ?? ''} firstLink={menu?.firstLink ?? ''} firstTitle={menu?.firstTitle ?? ''} menuNavigation={menu} documentId={documentId} />
      <div>
        <DashboardTopNavbar onHandleThemeChange={Utilities.onHandleThemeChange} dashboardNavigation={dashboard} />
        <PageGutterWrapper>
          <div className={styles.main}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
              <HeaderText title="Audit Outputs" description="The current section shows results and feedback from the auditor for the given EVP document." />
            </div>{' '}
            {auditOutputs?.length > 0 ? (
              <>
                {auditOutputs?.map((item, index) => {
                  const auditOutput = item?.audit_outputs;
                  const greenscore = greenscores ? greenscores[greenscores.length - 1]?.greenscore : undefined;

                  return (
                    <div key={index}>
                      <section>
                        <div style={{ paddingBottom: '2rem', paddingTop: '1rem', display: 'grid', rowGap: '1rem' }}>
                          <div key={index} className={styles.auditOutputResult}>
                            <div>
                              <div className={Utilities.classNames(styles.gridContainer2Cols, styles.borderBottom, styles.auditResultRow)}>
                                <P>Submission Date</P>
                                <P>{item.date}</P>
                              </div>

                              <div className={Utilities.classNames(styles.gridContainer2Cols, styles.auditResultRow, styles.borderBottom)}>
                                <P>Final EVP Report Link</P>
                                <Button style={ButtonStyleEnum.LINK_GREEN} href={`/report/${documentId}`} target="_blank">
                                  View My Report
                                </Button>
                              </div>
                              {/* <div className={Utilities.classNames(styles.gridContainer2Cols, styles.auditResultRow, styles.borderBottom)}>
                                <P>Scoring Metric Attachment</P>
                                <P>{auditOutput.scoringMetricFile || 'No File Provided'}</P>
                              </div> */}
                              {/* <div className={Utilities.classNames(styles.gridContainer2Cols, styles.borderBottom, styles.auditResultRow)}>
                                <P>Report Attachment</P>
                                <P>{auditOutput?.recommendationFile || 'No File Provided'}</P>
                              </div> */}

                              <div className={Utilities.classNames(styles.gridContainer2Cols, styles.auditResultRow)}>
                                <P>Feedback</P>
                                <P>{auditOutput?.feedback || 'No Feedback'}</P>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                      <section className={gridStyles.twoColumnGrid} style={{ paddingBottom: '1rem' }}>
                        <GreenscoreResult
                          key={index}
                          date={item.date}
                          emissionsScore={greenscore.emissions_score}
                          locationScore={greenscore.location_score}
                          confidenceScore={greenscore.confidence_score}
                          greenScore={greenscore.green_score}
                        />

                        <div style={{ paddingTop: '2.5rem', maxWidth: '300px' }}>
                          <GreenScoreCard greenscore={greenscore.green_score} withBorder={true} />
                        </div>
                      </section>
                    </div>
                  );
                })}
              </>
            ) : (
              <P style={{ color: 'var(--color-grey)', paddingBottom: '2rem' }}>Auditor feedback will be shown here after the review process is completed.</P>
            )}
          </div>
        </PageGutterWrapper>
      </div>
    </div>
  );
}
