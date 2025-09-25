'use client';

import * as Utilities from 'common/utilities';

import styles from '@components/EnergyValidationProcessSectionTwo.module.scss';
import gridStyles from '@root/components/GridStyles.module.scss';

import { EVPTimePeriodEnum, ReportPeriodDatabase, ReviewStatusEnum } from '@root/common/types';
import { FormHeading } from '@root/components/typography/forms';
import { P } from '@root/components/typography';
import { SIDE_NAVIGATION } from '@root/content/dashboard';
import { updateEVPreportProcessPostgres } from '@root/resolvers/PostgresResolvers';
import { useRouter } from 'next/router';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import CopyOutlineSVG from '@root/components/svgs/CopyOutlineSVG';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import DatePicker from '@root/components/DatePicker';
import ElectricitySVG from '@root/components/svgs/ElectricitySVG';
import EyeSVG from '@root/components/svgs/EyeSVG';
import GridSVG from '@root/components/svgs/GridSVG';
import HeaderText from '@root/components/HeaderText';
import LocationSVG from '@root/components/svgs/LocationSVG';
import LockSVG from '@root/components/svgs/LockSVG';
import MicroChipSVG from '@root/components/svgs/MicroChipSVG';
import ProgressSquare from '@root/components/ProgressSquare';
import React, { useState } from 'react';
import WaterSVG from '@root/components/svgs/WaterSVG';
import Notification from '@root/components/Notification';
import LightningIconSVG from '@root/components/svgs/LightningIconSVG';
import { calculateNextEVPProcess } from '@root/common/helpers';

const timePeriodOptions = [
  { value: EVPTimePeriodEnum.NONE, label: 'Select an option' },
  { value: EVPTimePeriodEnum.ONE_MONTH, label: '1 Month' },
  { value: EVPTimePeriodEnum.SIX_MONTHS, label: '6 Months' },
  { value: EVPTimePeriodEnum.ONE_QUARTER, label: '1 Quarter' },
  { value: EVPTimePeriodEnum.ONE_YEAR, label: '1 Year' },
];

export default function EnergyValidationProcessSectionTwo({ auditor, dashboard, document, documentId, sessionKey }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [reportStartDate, setReportStartDate] = useState(document?.reportStartDate || '');
  const [reportEndDate, setReportEndDate] = useState(document?.reportEndDate || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timePeriod, setTimePeriod] = useState(document?.timePeriod || timePeriodOptions[0].value);

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
      // timePeriod,
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

  console.log(document, 'document');
  const nextEVPDate = calculateNextEVPProcess(document?.auditReview?.providerEvpSubmissionDate);

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
          <HeaderText title="Energy Validation Process" description="Get started with your Energy Validation Process(EVP) overview" />
          <div className={styles.documentInfo} style={{ paddingBottom: '2rem' }}>
            {document?.createdAt && <p className={styles.headerInfo}>Creation Date: {document?.createdAt}</p>}
            {documentId !== null && <p className={styles.headerInfo}>Document ID: {documentId}</p>}
          </div>
          {nextEVPDate && (
            <div className={styles.notification}>
              <Notification width="40vw" title={'Your EVP is Completed!'} description={`The recommended date for your next EVP is  ${nextEVPDate}.`} icon={<LightningIconSVG />} />
            </div>
          )}
          <div className={styles.bigGreyBox} style={{ paddingTop: '1rem' }}>
            <div className={Utilities.classNames(styles.resultsWrapper, styles.grayBackground, styles.columns2)}>
              <div className={styles.results}>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsSteps}>
                    <div className={styles.stepRow}>
                      <ProgressSquare number={1} status={location} loading={isLoading} />
                      <div>
                        <div className={styles.row}>
                          <LocationSVG color="var(--color-text)" />
                          <p className={styles.resultsSteps}> Location Information </p>
                        </div>
                        <P className={styles.caption}>Apply for the location that you want to be audited for.</P>
                      </div>
                    </div>
                    <p className={styles.resultsStatus}> {showStatus(location)}</p>
                  </div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsSteps}>
                    <div className={styles.stepRow}>
                      <ProgressSquare number={2} status={hardware} loading={isLoading} />
                      <div>
                        <div className={styles.row}>
                          <MicroChipSVG color="var(--color-text)" />
                          <p className={styles.resultsSteps}> Hardware Configuration</p>
                        </div>
                        <P className={styles.caption}>Assesses your electricity consumption, analyzing utility bills and usage patterns.</P>
                      </div>
                    </div>
                    <p className={styles.resultsStatus}> {showStatus(hardware)}</p>
                  </div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsSteps}>
                    <div className={styles.stepRow}>
                      <ProgressSquare number={3} status={water} loading={isLoading} />
                      <div>
                        <div className={styles.row}>
                          <WaterSVG color="var(--color-text)" />
                          <p className={styles.resultsSteps}> Water Consumption</p>
                        </div>
                        <P className={styles.caption}>Identify conservation opportunities and water sustainability practices.</P>
                      </div>
                    </div>
                    <p className={styles.resultsStatus}>{showStatus(water)} </p>
                  </div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsSteps}>
                    <div className={styles.stepRow}>
                      <ProgressSquare number={4} status={electricity} loading={isLoading} />
                      <div>
                        <div className={styles.row}>
                          <ElectricitySVG color="var(--color-text)" /> <p className={styles.resultsSteps}> Energy Consumption</p>
                        </div>
                        <P className={styles.caption}>Assesses your electricity consumption, analyzing utility bills and usage patterns.</P>
                      </div>
                    </div>
                    <p className={styles.resultsStatus}>{showStatus(electricity)} </p>
                  </div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsSteps}>
                    <div className={styles.stepRow}>
                      <ProgressSquare number={5} status={renewableEnergyProduced} loading={isLoading} />
                      <div>
                        <div className={styles.row}>
                          <GridSVG color="var(--color-text)" />
                          <p className={styles.resultsSteps}>Renewable Energy Produced</p>
                        </div>
                        <P className={styles.caption}>Enables you to support renewable energy generation.</P>
                      </div>
                    </div>
                    <p className={styles.resultsStatus}>{showStatus(renewableEnergyProduced)}</p>
                  </div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsSteps}>
                    <div className={styles.stepRow}>
                      <ProgressSquare number={6} status={renewableEnergyProcured} loading={isLoading} />
                      <div>
                        <div className={styles.row}>
                          <LockSVG color="var(--color-text)" />
                          <p className={styles.resultsSteps}> Renewable Energy Procurement</p>
                        </div>
                        <P className={styles.caption}>Examination of your renewable energy procurement.</P>
                      </div>
                    </div>
                    <p className={styles.resultsStatus}>{showStatus(renewableEnergyProcured)}</p>
                  </div>
                </div>

                <div className={styles.resultsRow}>
                  <div className={styles.resultsSteps}>
                    <div className={styles.stepRow}>
                      <ProgressSquare number={7} status={preliminaryResults} loading={false} />
                      <div>
                        <div className={styles.row}>
                          <CopyOutlineSVG color="var(--color-text)" />
                          <p className={styles.resultsSteps}> Preliminary Results </p>
                        </div>

                        <P className={styles.caption}>Enables you to support renewable energy generation.</P>
                      </div>
                    </div>
                    <p className={styles.resultsStatus}>{showStatus(preliminaryResults)}</p>
                  </div>
                </div>
                <div className={styles.resultsRow}>
                  <div className={styles.resultsSteps}>
                    <div className={styles.stepRow}>
                      <ProgressSquare number={8} status={preliminaryResults} loading={false} />

                      <div>
                        <div className={styles.row}>
                          <EyeSVG color="var(--color-text)" />
                          <p className={styles.resultsSteps}> Audit Review</p>
                        </div>
                        <P className={styles.caption}>Final overview of the audit.</P>
                      </div>
                    </div>
                    <p className={styles.resultsStatus}>{showStatus(electricity)} </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isSubmitted || (document?.reportStartDate && document?.reportEndDate) ? (
            <div style={{ paddingBottom: '2rem' }}>
              <P style={{ paddingTop: '1rem', paddingBottom: '0.5rem', color: 'var(--theme-color-accent)' }}>Reporting Period</P>
              <div className={gridStyles.threeColumnGrid} style={{ paddingBottom: '1rem' }}>
                <div>
                  <FormHeading className={styles.formHeading}>Start Date: {Utilities.toDateISOString(reportStartDate)}</FormHeading>
                </div>
                <div>
                  <FormHeading className={styles.formHeading}>End Date: {Utilities.toDateISOString(reportEndDate)}</FormHeading>
                </div>
              </div>
              <div className={styles.ctaButton}>
                <Button className={styles.button} style={ButtonStyleEnum.SQUARE_BLACK} href={`location/${documentId}`}>
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
              <P id="time-period" style={{ paddingTop: '1rem', paddingBottom: '0.5rem', color: 'var(--theme-color-form-text)' }}>
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

                {/* <Select type="select" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} options={timePeriodOptions} disabled={!isEditable} /> */}
              </div>
              <div className={styles.ctaButton}>
                <Button type="submit" className={styles.button} style={ButtonStyleEnum.SQUARE_BLACK}>
                  Continue
                </Button>
                <Button type="submit" className={styles.button} style={ButtonStyleEnum.BORDER_BLACK} href={'/home'}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
