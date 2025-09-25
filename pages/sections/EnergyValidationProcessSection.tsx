'use client';

import * as Utilities from 'common/utilities';

import styles from '@components/EnergyValidationProcessSection.module.scss';
import gridStyles from '@root/components/GridStyles.module.scss';

import { FormHeading } from '@root/components/typography/forms';
import { P } from '@root/components/typography';
import { ReportPeriodDatabase, ReviewStatusEnum } from '@root/common/types';
import { SIDE_NAVIGATION } from '@root/content/dashboard';
import { updateEVPreportProcessPostgres } from '@root/resolvers/PostgresResolvers';
import { useRouter } from 'next/router';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import DatePicker from '@root/components/DatePicker';
import HeaderText from '@root/components/HeaderText';
import ProgressCircle from '@root/components/ProgressCircle';
import React, { useState } from 'react';

export default function EnergyValidationProcessSection({ auditor, dashboard, document, documentId, sessionKey, messages }) {
  const [isLoading, setIsLoading] = React.useState(false); // Add this line
  const [reportStartDate, setReportStartDate] = useState(document?.reportStartDate || '');
  const [reportEndDate, setReportEndDate] = useState(document?.reportEndDate || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const menu = SIDE_NAVIGATION;

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
  const auditReview = document?.auditReview?.provider_evp_status ?? null;

  const isEditable = !auditor;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reportStartDate.trim() || !reportEndDate.trim()) {
      alert('Both start and end dates must be provided.');
      return;
    }

    setLoading(true);

    const reportPeriodDates = {
      reportStartDate,
      reportEndDate,
    };

    const reportPeriodDatesFormatted = Utilities.convertObjectKeysToSnakeCase(reportPeriodDates) as ReportPeriodDatabase;

    const { success, result, error } = await updateEVPreportProcessPostgres({
      sessionKey,
      reportPeriod: reportPeriodDatesFormatted,
      documentId,
    });

    if (success) {
      setSuccess(true);
      console.log('success your submission has been recorded!');
      router.push(`/evp-process/location-information/${documentId}`);
    } else {
      console.error('Failed to submit the EVP form');
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <DashboardSideNavbar
        firstIcon={menu?.firstIcon ?? ''}
        firstLink={menu?.firstLink ?? ''}
        firstTitle={menu?.firstTitle ?? ''}
        secondTitle={'Audit Details'}
        menuNavigation={menu}
        documentId={documentId}
        prefix={null}
      />

      <div>
        <DashboardTopNavbar onHandleThemeChange={Utilities.onHandleThemeChange} dashboardNavigation={dashboard} />

        <div className={styles.main}>
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
          <HeaderText title="Energy Validation Process" description="Get started with your Energy Validation Process overview" />
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
                    <p className={styles.resultsStatus}>{showStatus(preliminaryResults)}</p>
                  </div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsSteps}>
                    <ProgressCircle number={8} status={preliminaryResults} loading={false} />
                    <p className={styles.resultsSteps}> Audit Review</p>
                    <p className={styles.resultsStatus}>{showStatus(electricity)} </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={Utilities.classNames(styles.resultsWrapper, styles.columns3)}>
              <div className={styles.heading}>What to Expect:</div>

              <div className={styles.resultsDescriptions}>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsTwo}>Location Information - Apply for the location that you want to be audited for</div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsTwo}>Hardware Configuration - Assesses your electricity consumption, analyzing utility bills and usage patterns</div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsTwo}>Water Consumption - Identify conservation opportunities and water sustainability practices</div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsTwo}>Energy Consumption - Assesses your electricity consumption, analyzing utility bills and usage patterns</div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsTwo}>Renewable Energy Produced - Enables you to support renewable energy generation</div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsTwo}>Renewable Energy Procured -Examination of your renewable energy procurement</div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsTwo}>Preliminary Results & REC Matching Options - Enables you to support renewable energy generation</div>
                </div>
              </div>
            </div>
          </div>
          {isSubmitted || (document?.reportStartDate && document?.reportEndDate) ? (
            <div style={{ paddingBottom: '2rem' }}>
              <P style={{ paddingTop: '1rem', paddingBottom: '0.5rem', color: 'var(--theme-color-accent)' }}>Reporting Period</P>
              <div className={gridStyles.threeColumnGrid} style={{ paddingBottom: '1rem' }}>
                <div>
                  <FormHeading className={styles.formHeading}>Start Date: {reportStartDate}</FormHeading>
                </div>
                <div>
                  <FormHeading className={styles.formHeading}>End Date: {reportEndDate}</FormHeading>
                </div>
              </div>
              <div className={styles.ctaButton}>
                <Button className={styles.button} style={ButtonStyleEnum.SQUARE_GREEN} href={`location/${documentId}`}>
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ paddingBottom: '2rem' }}>
              <P style={{ paddingTop: '1rem', paddingBottom: '0.5rem', color: 'var(--theme-color-accent)' }}>
                Please list the start date and end date for the calendar quarter you are reporting data on
              </P>

              <div className={gridStyles.threeColumnGrid} style={{ paddingBottom: '1rem' }}>
                <div>
                  <FormHeading className={styles.formHeading}>Start Date</FormHeading>
                  <DatePicker disabled={!isEditable || reportStartDate} id="start-date" value={reportStartDate} onChange={(e) => setReportStartDate(e.target.value)} />
                </div>
                <div>
                  <FormHeading className={styles.formHeading}>End Date</FormHeading>
                  <DatePicker disabled={!isEditable || reportEndDate} id="end-date" value={reportEndDate} onChange={(e) => setReportEndDate(e.target.value)} />
                </div>
              </div>
              <div className={styles.ctaButton}>
                <Button type="submit" className={styles.button} style={ButtonStyleEnum.SQUARE_GREEN}>
                  Begin
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
