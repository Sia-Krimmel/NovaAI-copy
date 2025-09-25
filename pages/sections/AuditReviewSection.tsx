'use client';

import * as Utilities from 'common/utilities';

import styles from '@components/AuditReviewSection.module.scss';
import gridStyles from '@root/components/GridStyles.module.scss';

import { AuditReview, AuditReviewDatabase, ReviewStatusEnum } from '@root/common/types';
import { DASHBOARD_NAVIGATION } from '@root/content/dashboard';
import { P } from '@root/components/typography';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import Checkbox from '@root/components/Checkbox';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import HeaderText from '@root/components/HeaderText';
import ProgressCircle from '@root/components/ProgressCircle';
import React, { useState } from 'react';
import { updateAuditReviewPostgres } from '@root/resolvers/PostgresResolvers';
import SuccessScreen from '@root/components/SuccessScreen';
import { FormHeading } from '@root/components/typography/forms';
import PageGutterWrapper from '@root/components/PageGutterWrapper';

export default function AuditReviewSection({ auditor, document, dashboard, documentId, sessionKey, userId, menu }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [reportOption, setReportOption] = useState(document?.report || 'yes');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [providerReviewStatus, setProviderReviewStatus] = useState(document?.auditReview?.provider_evp_status ?? '');
  const [reportStartDate, setReportStartDate] = useState(document?.reportStartDate || '');
  const [reportEndDate, setReportEndDate] = useState(document?.reportEndDate || '');

  function showStatus(status) {
    switch (status) {
      case ReviewStatusEnum.IN_REVIEW:
        return <span className={styles.statusGreen}>Submitted</span>;
      case ReviewStatusEnum.NOT_STARTED:
      case ReviewStatusEnum.NOT_SUBMITTED:
      default:
        return <span className={styles.statusRed}>Not Submitted</span>;
    }
  }

  const water = document?.waterConsumption?.status ?? null;
  const hardware = document?.hardwareConfiguration?.status ?? null;
  const electricity = document?.electricityConsumption?.status ?? null;
  const location = document?.locationInformation?.status ?? null;
  const renewableEnergyProduced = document?.energyProduction?.status ?? null;
  const renewableEnergyProcured = document?.renewableEnergyProcurement?.status ?? null;
  const preliminaryResults = document?.preliminaryResultsRecMatching?.status ?? null;
  const isEditable = !auditor;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const providerEvpStatus = ReviewStatusEnum.COMPLETE;

    const providerEvpSubmissionDate = new Date().toISOString();
    const auditReview: AuditReview = {
      providerEvpStatus,
      providerEvpSubmissionDate,
      reportOption,
    };

    const auditReviewDataFormatted = Utilities.convertObjectKeysToSnakeCase(auditReview) as AuditReviewDatabase;

    const { success, result, error } = await updateAuditReviewPostgres({
      sessionKey,
      auditReview: auditReviewDataFormatted,
      documentId,
    });

    if (success) {
      setSuccess(true);
      console.log('success your submission has been recorded!');
      // router.push('/home');
    } else {
      console.error('Failed to submit the EVP form');
    }

    setLoading(false);
  };

  console.log(menu, 'document');
  const homeLink = `/evp-process/${documentId}`;

  return (
    <div className={styles.container}>
      <DashboardSideNavbar
        firstIcon={menu?.firstIcon ?? ''}
        firstLink={menu?.firstLink ?? ''}
        firstTitle={menu?.firstTitle ?? ''}
        menuNavigation={menu}
        documentId={documentId}
        prefix={menu?.prefix ?? null}
      />

      <div>
        <DashboardTopNavbar onHandleThemeChange={Utilities.onHandleThemeChange} dashboardNavigation={dashboard} />

        {(providerReviewStatus !== ReviewStatusEnum.COMPLETE && !success) || auditor ? (
          <form className={styles.main} onSubmit={handleSubmit}>
            <div className={styles.documentInfo}>
              {document?.createdAt && (
                <p className={styles.resultsTwo} style={{ color: 'var(--theme-label-dark-text)' }}>
                  Creation Date: {document?.createdAt}
                </p>
              )}
              {documentId !== null && (
                <p className={styles.resultsTwo} style={{ color: 'var(--theme-label-dark-text)' }}>
                  Document ID: {documentId}
                </p>
              )}
            </div>
            <HeaderText title="Audit Review" description="Please confirm that all the form submissions are valid, select your output option, and submit." />
            <P style={{ paddingTop: '1rem', paddingBottom: '0.5rem', color: 'var(--theme-color-accent)' }}>Reporting Period</P>
            <div className={gridStyles.threeColumnGrid} style={{ paddingBottom: '1rem' }}>
              <div>
                <FormHeading className={styles.formHeading}>Start Date: {Utilities.toDateISOString(reportStartDate)}</FormHeading>
              </div>
              <div>
                <FormHeading className={styles.formHeading}>End Date: {Utilities.toDateISOString(reportEndDate)}</FormHeading>
              </div>
            </div>
            <div className={styles.bigGreyBox}>
              <div className={Utilities.classNames(styles.resultsWrapper, styles.grayBackground, styles.columns2)}>
                <div className={styles.heading}>EVP Results</div>
                <div className={styles.results}>
                  <div className={styles.resultsRow}>
                    <div className={styles.resultsSteps}>
                      <ProgressCircle number={1} status={location} loading={isLoading} />
                      <p className={styles.resultsSteps}> Location Information </p>

                      <p className={styles.resultsStatus}> {showStatus(location)}</p>
                    </div>
                  </div>
                  <div className={styles.resultsRow}>
                    <div className={styles.resultsSteps}>
                      <ProgressCircle number={2} status={hardware} loading={isLoading} />
                      <p className={styles.resultsSteps}> Hardware Configuration</p>
                      <p className={styles.resultsStatus}> {showStatus(hardware)}</p>
                    </div>
                  </div>
                  <div className={styles.resultsRow}>
                    <div className={styles.resultsSteps}>
                      <ProgressCircle number={3} status={water} loading={isLoading} />
                      <p className={styles.resultsSteps}> Water Consumption</p>
                      <p className={styles.resultsStatus}>{showStatus(water)} </p>
                    </div>
                  </div>
                  <div className={styles.resultsRow}>
                    <div className={styles.resultsSteps}>
                      <ProgressCircle number={4} status={electricity} loading={isLoading} />
                      <p className={styles.resultsSteps}> Energy Consumption</p>
                      <p className={styles.resultsStatus}>{showStatus(electricity)} </p>
                    </div>
                  </div>
                  <div className={styles.resultsRow}>
                    <div className={styles.resultsSteps}>
                      <ProgressCircle number={5} status={renewableEnergyProduced} loading={isLoading} />
                      <p className={styles.resultsSteps}>Renewable Energy Produced</p>
                      <p className={styles.resultsStatus}>{showStatus(renewableEnergyProduced)}</p>
                    </div>
                  </div>
                  <div className={styles.resultsRow}>
                    <div className={styles.resultsSteps}>
                      <ProgressCircle number={6} status={renewableEnergyProcured} loading={isLoading} />
                      <p className={styles.resultsSteps}> Renewable Energy Procurement</p>
                      <p className={styles.resultsStatus}>{showStatus(renewableEnergyProcured)}</p>
                    </div>
                  </div>

                  <div className={styles.resultsRow}>
                    <div className={styles.resultsSteps}>
                      <ProgressCircle number={7} status={preliminaryResults} loading={false} />
                      <p className={styles.resultsSteps}> Preliminary Results </p>
                      <p className={styles.resultsStatus}>{showStatus(renewableEnergyProcured)}</p>
                    </div>
                  </div>
                  {/* <div className={styles.resultsRow}>
                  <div className={styles.resultsSteps}>
                    <ProgressCircle number={8} status={false} loading={false} />
                    <p className={styles.resultsSteps}> Audit Review</p>
                  </div>
                </div> */}
                </div>
              </div>
              <div className={Utilities.classNames(styles.resultsWrapper, styles.columns3)}>
                <div className={styles.resultsDescriptions}>
                  <P style={{ paddingBottom: '0.2rem' }}>Output Options</P>
                  <P style={{ fontSize: '13px', color: 'var(--color-grey)', paddingBottom: '1rem' }}>More options will be available soon</P>
                  <Checkbox
                    disabled
                    name="produce-a-report"
                    type="checkbox"
                    onChange={(e) => setReportOption(e.target.checked ? 'yes' : 'no')}
                    value={reportOption === 'yes'}
                    style={{ marginTop: 16 }}
                  >
                    Produce a Report
                  </Checkbox>
                </div>
              </div>
              <div className={styles.ctaButton}>
                <Button className={styles.button} style={ButtonStyleEnum.SQUARE_GREEN}>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <PageGutterWrapper>
            <SuccessScreen message="Congratulations! You have completed your submission for the EVP Report! Our auditors will review your submission soon." />
            <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '2rem' }}>
              <Button href="/home" style={ButtonStyleEnum.SQUARE_BLACK}>
                Return Home
              </Button>
            </div>
          </PageGutterWrapper>
        )}
      </div>
    </div>
  );
}
