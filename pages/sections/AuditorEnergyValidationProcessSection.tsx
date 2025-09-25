'use client';

import * as Utilities from 'common/utilities';

import styles from '@components/EnergyValidationProcessSectionTwo.module.scss';

import { AUDITOR_DASHBOARD_NAVIGATION, AUDITOR_SIDE_NAVIGATION, AUDIT_STATUS, DASHBOARD_NAVIGATION, SIDE_NAVIGATION } from '@root/content/dashboard';
import { P } from '@root/components/typography';
import { ReviewStatusEnum } from '@root/common/types';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import CopyOutlineSVG from '@root/components/svgs/CopyOutlineSVG';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import ElectricitySVG from '@root/components/svgs/ElectricitySVG';
import EyeSVG from '@root/components/svgs/EyeSVG';
import GridSVG from '@root/components/svgs/GridSVG';
import HeaderText from '@root/components/HeaderText';
import LocationSVG from '@root/components/svgs/LocationSVG';
import LockSVG from '@root/components/svgs/LockSVG';
import MicroChipSVG from '@root/components/svgs/MicroChipSVG';
import ProgressSquare from '@root/components/ProgressSquare';
import React from 'react';
import WaterSVG from '@root/components/svgs/WaterSVG';

export default function AuditorEnergyValidationProcessSection({ document, documentId }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const menu = AUDITOR_SIDE_NAVIGATION;
  const dashboard = AUDITOR_DASHBOARD_NAVIGATION;

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

  const reportStartDate = document?.reportStartDate ? Utilities.toDateISOString(document?.reportStartDate) : 'Not provided';
  const reportEndDate = document?.reportEndDate ? Utilities.toDateISOString(document?.reportEndDate) : 'Not provided';

  return (
    <div className={styles.container}>
      <DashboardSideNavbar
        firstLink={menu?.firstLink ?? ''}
        firstIcon={menu?.firstIcon ?? ''}
        firstTitle={menu?.firstTitle ?? ''}
        menuNavigation={menu}
        documentId={documentId}
        prefix={menu?.prefix ?? null}
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
          <HeaderText title="Energy Validation Process - Auditor Review" description="Please review all the information submitted by the provider. " />

          <div className={styles.documentInfo}>
            {document?.createdAt && <p className={styles.headerInfo}>Creation Date: {document?.createdAt}</p>}
            {documentId !== null && <p className={styles.headerInfo}>Document ID: {documentId}</p>}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <P style={{ color: 'var(--theme-color-accent)' }}>Start Date:</P>
              <P>{reportStartDate}</P>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <P style={{ color: 'var(--theme-color-accent)' }}>End Date:</P>
              <P>{reportEndDate}</P>
            </div>
          </div>
          <div className={styles.bigGreyBox}>
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
          <div className={styles.ctaButton}>
            <Button className={styles.button} style={ButtonStyleEnum.SQUARE_GREEN} href={`location/${documentId}`}>
              Begin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
