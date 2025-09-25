'use client';

import * as Utilities from 'common/utilities';

import sideNavStyles from '@components/SideNavigaton.module.scss';
import gridStyles from '@root/components/GridStyles.module.scss';

import { FormHeading } from '@root/components/typography/forms';
import { FormTypeEnum, PreliminaryResultsRecMatching, PreliminaryResultsRecMatchingDatabase, ReviewStatusEnum } from '@root/common/types';
import { getEmissionFactorsByCountry, getMarginalEmissionsFactorByCountry, updatePreliminaryResultsPostgres } from '@root/resolvers/PostgresResolvers';
import { P } from '@root/components/typography';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import Form from '@root/components/Form';
import FormMessages from '@root/components/FormMessages';
import HeaderText from '@root/components/HeaderText';
import Link from '@root/components/Link';
import PageGutterWrapper from '@root/components/PageGutterWrapper';
import React, { useEffect, useState } from 'react';
import SuccessScreen from '@root/components/SuccessScreen';

export default function PreliminaryResultsRecMatchingOptionsSection({
  auditor,
  dashboard,
  document,
  electricityDocument,
  documentId,
  menu,
  messages,
  userId,
  viewer,
  sessionKey,
  locationDocument,
  evpReport,
}: any) {
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [key, setKey] = React.useState<string>('');
  const [reviewStatus, setReviewStatus] = React.useState(document?.status ?? '');
  const [actualElectricityConsumed, setActualElectricityConsumed] = useState(electricityDocument?.actualElectricityConsumed || document?.actualElectricityConsumed || '');
  const [actualElectricityDelivered, setActualElectricityDelivered] = useState(electricityDocument?.actualElectricityDelivered || document?.actualElectricityDelivered || '');
  const [actualElectricityReturned, setActualElectricityReturned] = useState(electricityDocument?.actualElectricityReturned || document?.actualElectricityReturned || '');
  const [timePeriod, setTimePeriod] = useState(evpReport?.timePeriod || null);
  const [emissionsFactor, setEmissionsFactor] = useState(0);
  const [marginalEmissionsFactor, setMarginalEmissionsFactor] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [reportStartDate, setReportStartDate] = useState(evpReport?.reportStartDate || null);
  const [reportEndDate, setReportEndDate] = useState(evpReport?.reportEndDate || null);

  const formType = FormTypeEnum.PRELIMINARY_RESULTS;
  const providerCountry = locationDocument?.providerCountry || null;

  console.log(electricityDocument, '*Missing electricity form data  ');

  useEffect(() => {
    getEmissionFactorsByCountry(providerCountry)
      .then((emissionsFactorValue) => {
        setEmissionsFactor(emissionsFactorValue);
        if (emissionsFactorValue && actualElectricityConsumed) {
          const totalEmissionsValue = (emissionsFactorValue * actualElectricityConsumed).toFixed(2);
          setTotalEmissions(parseFloat(totalEmissionsValue));
        }
      })
      .catch((error) => {
        console.error('Failed to fetch emission factors:', error);
      });

    getMarginalEmissionsFactorByCountry(providerCountry)
      .then((marginalEmissionsFactorValue) => {
        setMarginalEmissionsFactor(marginalEmissionsFactorValue);
      })
      .catch((error) => {
        console.error('Failed to fetch emission factors:', error);
      });
  }, [providerCountry, actualElectricityConsumed]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!totalEmissions) {
      alert('You must fill out the electricity form to receive Total Emissions result');
      return;
    }

    if (!emissionsFactor) {
      alert('You must fill out the electricity form to receive Emissions Factor');
      return;
    }

    if (!reportStartDate || !reportEndDate) {
      alert('You must provide a start and end dates in the Start section');
      return;
    }

    const resultForm: PreliminaryResultsRecMatching = {
      actualElectricityConsumed,
      actualElectricityDelivered,
      actualElectricityReturned,
      emissionsFactor,
      status: ReviewStatusEnum.IN_REVIEW,
      timePeriod,
      totalEmissions,
    };

    //Convert data keys to snake_case for the database
    const preliminaryResultsFormFormatted = Utilities.convertObjectKeysToSnakeCase(resultForm) as PreliminaryResultsRecMatchingDatabase;

    try {
      const { success, result, error } = await updatePreliminaryResultsPostgres({
        preliminaryResults: preliminaryResultsFormFormatted,
        sessionKey,
        documentId,
      });
      if (success) {
        setSuccess(true);
        console.log(success, 'success!');
      } else {
        console.error('Failed to update and submit the water consumption form:', error);
      }

      setLoading(false);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  const isEditable = !auditor;

  return (
    <div className={sideNavStyles.container}>
      <DashboardSideNavbar
        firstIcon={menu?.firstIcon ?? ''}
        brandLink={menu?.brandLink}
        firstLink={menu?.firstLink ?? ''}
        firstTitle={menu?.firstTitle ?? ''}
        menuNavigation={menu}
        documentId={documentId}
        prefix={menu?.prefix ?? null}
      />

      <div>
        <DashboardTopNavbar onHandleThemeChange={Utilities.onHandleThemeChange} dashboardNavigation={dashboard} />

        <PageGutterWrapper>
          <div id="preliminary-results-form">
            {(reviewStatus !== ReviewStatusEnum.IN_REVIEW && !success) || auditor ? (
              <Form auditor={auditor} handleSubmit={handleSubmit} style={{ minHeight: '60vh' }} backLink="/evp-process" nextLink={`/audit-review/${documentId}`}>
                <div style={{ display: 'grid', rowGap: 'var(--type-scale-8)', paddingBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem' }}>
                    <HeaderText title="Preliminary Results & REC Matching Options" description="" />
                  </div>

                  <div className={gridStyles.oneColumnGrid}>
                    <div style={{ paddingBottom: '1rem' }}>
                      <div
                        style={{
                          border: '1px solid var(--theme-color-border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '20px',
                          width: '70%',
                          borderRadius: 'var(--border-radius-tiny)',
                          background: 'var(--theme-primary-light-background)',
                        }}
                      >
                        <P>Reporting Period </P>
                        {reportStartDate && reportEndDate ? (
                          <p style={{ color: 'var(--color-black)' }}>
                            {Utilities.toDateISOString(reportStartDate)} - {Utilities.toDateISOString(reportEndDate)}{' '}
                          </p>
                        ) : (
                          <P style={{ color: 'var(--color-error)' }}>
                            *Missing time period from the{' '}
                            <Link linkStyle="animated-black" href={`/evp-process/${documentId}#time-period`}>
                              Start
                            </Link>{' '}
                            section
                          </P>
                        )}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          border: '1px solid var(--theme-color-border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '20px',
                          width: '70%',
                          borderRadius: 'var(--border-radius-tiny)',
                          background: 'var(--theme-primary-light-background)',
                        }}
                      >
                        <p>Country from Location Information</p>
                        {locationDocument?.providerCountry ? (
                          <p style={{ color: 'var(--color-black)' }}>{locationDocument?.providerCountry} </p>
                        ) : (
                          <p style={{ color: 'var(--color-error)' }}>*Missing location information</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ paddingBottom: '0.5rem' }}>
                    <P style={{ paddingBottom: '0.5rem', paddingTop: '1.5rem' }}>Estimated Calculations:</P>
                    <FormHeading style={{ fontSize: '13px', paddingTop: '1rem', paddingBottom: '0.5rem' }}>
                      Actual Net Power Consumed (kWh): Power Consumed - Power Returned
                    </FormHeading>

                    <div
                      style={{
                        border: '1px solid var(--theme-color-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '20px',
                        width: '60%',
                        borderRadius: 'var(--border-radius-tiny)',
                        background: 'var(--theme-primary-light-background)',
                      }}
                    >
                      <p>Actual Net Power Consumed</p>
                      {actualElectricityConsumed ? (
                        <p style={{ color: 'var(--theme-color-accent)' }}>{actualElectricityConsumed} (kWh) </p>
                      ) : (
                        <p style={{ color: 'var(--color-error)' }}>Please complete Energy Consumption form</p>
                      )}
                    </div>
                  </div>
                  <div style={{ paddingBottom: '0.5rem' }}>
                    <FormHeading style={{ fontSize: '13px', paddingTop: '1rem', paddingBottom: '0.5rem' }}>Emissions Factor (kg CO2e/kWh) based on your location</FormHeading>

                    <div
                      style={{
                        border: '1px solid var(--theme-color-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '20px',
                        width: '60%',
                        borderRadius: 'var(--border-radius-tiny)',
                        background: 'var(--theme-primary-light-background)',
                      }}
                    >
                      <p>Emissions Factor</p>
                      {emissionsFactor ? (
                        <p style={{ color: 'var(--theme-color-accent)' }}>{emissionsFactor} (kg CO2e/kWh) </p>
                      ) : (
                        <p style={{ color: 'var(--color-error)' }}>Please complete location information</p>
                      )}
                    </div>
                  </div>
                  <div style={{ paddingBottom: '0.5rem' }}>
                    <FormHeading style={{ fontSize: '13px', paddingTop: '1rem', paddingBottom: '0.5rem' }}>
                      Marginal Emissions Factor (kg CO2e/kWh) based on your location
                    </FormHeading>

                    <div
                      style={{
                        border: '1px solid var(--theme-color-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '20px',
                        width: '60%',
                        borderRadius: 'var(--border-radius-tiny)',
                        background: 'var(--theme-primary-light-background)',
                      }}
                    >
                      <p>Marginal Emissions Factor</p>
                      {marginalEmissionsFactor ? (
                        <span style={{ color: 'var(--theme-color-accent)' }}>{marginalEmissionsFactor} gCO2/kWh </span>
                      ) : (
                        <p style={{ color: 'var(--color-error)' }}>Please complete location information</p>
                      )}
                    </div>
                  </div>
                  <div style={{ paddingBottom: '0.5rem' }}>
                    <FormHeading style={{ fontSize: '13px', paddingTop: '1rem', paddingBottom: '0.5rem' }}>
                      Total Emissions Profile: Total Emissions (kg CO2e) = Electricity Consumption (kWh) × Emissions Factor (kg CO2e/kWh)
                    </FormHeading>

                    <div
                      style={{
                        border: '1px solid var(--theme-color-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '20px',
                        width: '60%',
                        borderRadius: 'var(--border-radius-tiny)',
                        background: 'var(--theme-primary-light-background)',
                      }}
                    >
                      <p>Total Emissions Profile</p>
                      {totalEmissions ? (
                        <p style={{ color: 'var(--theme-color-accent)' }}>{totalEmissions} kg CO2e</p>
                      ) : (
                        <p style={{ color: 'var(--color-error)' }}>*Missing Energy Consumption form data </p>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            ) : (
              <div>
                <SuccessScreen message="Thank you for submitting the  Preliminary Results & REC Matching Options Form. It is being reviewed by our Auditors." />
              </div>
            )}
          </div>
        </PageGutterWrapper>

        <FormMessages formType={formType} documentId={documentId} messages={messages} sessionKey={sessionKey} setModal={setModal} viewer={viewer} />
      </div>
    </div>
  );
}
