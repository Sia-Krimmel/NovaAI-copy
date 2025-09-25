'use client';
import styles from '@components/GreenscoreAuditInput.module.scss';
import * as Utilities from 'common/utilities';

import { classNames } from '@root/common/utilities';
import { getEmissionFactorsByCountry, getMarginalEmissionsFactorByCountry, updateGreenscoreFormPostgres } from '@root/resolvers/PostgresResolvers';
import { Greenscore, GreenscoreConfidenceScoreDetails, ReviewStatusEnum, UserProfileTypeEnum } from '@root/common/types';
import { H6, P } from './typography';
import Button, { ButtonStyleEnum } from './Button';
import GreenscoreResult from './GreenscoreResult';
import InputWithSpotlight from './InputWithspotlight';
import NovaLogoSVG from './svgs/NovaLogoSVG';
import React, { useEffect, useState } from 'react';
import SuccessScreen from './SuccessScreen';

export const GLOBAL_AVERAGE_MARGINAL_EMISSION_FACTOR = 614.98;

export default function GreenscoreCalculationForm({ greenscores, document, providerProfile, documentId, sessionKey, locationInformation }) {
  const [actualNetPowerConsumed, setActualNetPowerConsumed] = useState(0);
  const [renewableEnergyConsumption, setRenewableEnergyConsumption] = useState(0);
  const [gridEmissionsFactor, setGridEmissionsFactor] = useState(0);
  const [averageDataStorageCapacity, setAverageDataStorageCapacity] = useState(0);
  const [estimateCumulativeEnergyUsePerTime, setEstimateCumulativeEnergyUsePerTime] = useState(0);
  const [averageRawByteCapacityForReportingTme, setAverageRawByteCapacityForReportingTme] = useState(0);
  const [networkAverageRenewableEnergyPurchases, setNetworkAverageRenewableEnergyPurchases] = useState(0);
  const [globalAverageGridEmissionsFactor, setGlobalAverageGridEmissionsFactor] = useState(436);
  const [marginalEmissionsFactor, setMarginalEmissionsFactor] = useState(0);
  const [renewableEnergyProducedOnsite, setRenewableEnergyProducedOnsite] = useState(0);
  const [totalNetworkElectricityConsumption, setTotalNetworkElectricityConsumption] = useState(estimateCumulativeEnergyUsePerTime);
  const [globalAverageMarginalEmissionFactor, setGlobalAverageMarginalEmissionFactor] = useState(GLOBAL_AVERAGE_MARGINAL_EMISSION_FACTOR);
  const [totalNetworkRenewableEnergyProduction, setTotalNetworkRenewableEnergyProduction] = useState(averageRawByteCapacityForReportingTme);
  const [reportStartDate, setReportStartDate] = useState(document?.reportStartDate || '');
  const [reportEndDate, setReportEndDate] = useState(document?.reportEndDate || '');

  const [providerLocation, setProviderLocation] = useState(locationInformation?.providerLocation || 'Location');
  const [providerCountry, setProviderCountry] = useState(locationInformation?.providerCountry || 'Not Provided');
  const [entityCompany, setEntityCompany] = useState(providerProfile?.entityCompany || providerProfile?.entityName || 'Not Provided');
  const [providerEmail, setProviderEmail] = useState(providerProfile?.email || 'Not Provided');

  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = useState(false);

  //Confidence Matrix
  const [locationInfoNone, setLocationInfoNone] = useState('0.0');
  const [locationInfoReportedByProvider, setLocationInfoReportedByProvider] = useState('0.0');
  const [locationInfoAddressReported, setLocationInfoAddressReported] = useState('0.0');
  const [locationInfoReportedUtilityBill, setLocationInfoReportedUtilityBill] = useState('0.0');
  const [nodeIdInfoNone, setNodeIdInfoNone] = useState('0.0');
  const [nodeIdAuditorVerified, setNodeIdAuditorVerified] = useState('0.0');
  const [nodeIdProviderSelfReported, setNodeIdProviderSelfReported] = useState('0.0');
  const [nodeIdProviderVerifiedCompletion, setNodeIdProviderVerifiedCompletion] = useState('0.0');
  const [hardwareInfoNone, setHardwareInfoNone] = useState('0.0');
  const [hardwareDocsProvided, setHardwareDocsProvided] = useState('0.0');
  const [hardwareSPSelfReported, setHardwareSPSelfReported] = useState('0.0');
  const [hardwareMediaEvidenceProvided, setHardwareMediaEvidenceProvided] = useState('0.0');
  const [waterInfoNone, setWaterInfoNone] = useState('0.0');
  const [waterUtilityDocsProvided, setWaterUtilityDocsProvided] = useState('0.0');
  const [energyInfoNone, setEnergyInfoNone] = useState('0.0');
  const [energyMonthlyBillProvided, setEnergyMonthlyBillProvided] = useState('0.0');
  const [energyOnlyGranualMeasurements, setOnlyEnergyGranualMeasurements] = useState('0.0');
  const [energyMeasurementsMatch, setEnergyMeasurementsMatch] = useState('0.0');

  const handleInputChange = (newValue, setterFunction, otherValues) => {
    const newValueFloat = parseFloat(newValue) || 0;
    if (newValueFloat < 0) {
      setterFunction(0);
      alert('Negative values are not allowed.');
      return;
    }

    const sumOthers = otherValues.reduce((acc, value) => acc + parseFloat(value), 0);
    const expectedTotal = sumOthers + newValueFloat;

    if (expectedTotal <= 1) {
      setterFunction(newValueFloat);
    } else {
      alert('Total value across fields cannot exceed 1');
    }
  };

  const parseInputValue = (inputValue) => {
    const stringValue = String(inputValue);
    return parseFloat(stringValue.replace(/,/g, ''));
  };

  //calculate Grid Emissions factor
  useEffect(() => {
    getEmissionFactorsByCountry(providerCountry)
      .then((emissionsFactorValue) => {
        setGridEmissionsFactor(emissionsFactorValue);
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
  }, [providerCountry]);

  //Formatting Emissions Calculations to support Commas
  const actualNetPowerConsumedValue = parseInputValue(actualNetPowerConsumed);
  const renewableEnergyConsumptionValue = parseInputValue(renewableEnergyConsumption);
  const gridEmissionsFactorValue = parseInputValue(gridEmissionsFactor);
  const averageDataStorageCapacityValue = parseInputValue(averageDataStorageCapacity);
  const estimateCumulativeEnergyUsePerTimeValue = parseInputValue(estimateCumulativeEnergyUsePerTime);
  const averageRawByteCapacityForReportingTimeValue = parseInputValue(averageRawByteCapacityForReportingTme);
  const networkAverageRenewableEnergyPurchasesValue = parseInputValue(networkAverageRenewableEnergyPurchases);
  const globalAverageGridEmissionsFactorValue = parseInputValue(globalAverageGridEmissionsFactor);
  const marginalEmissionsFactorValue = parseInputValue(marginalEmissionsFactor);
  const renewableEnergyProducedOnsiteValue = parseInputValue(renewableEnergyProducedOnsite);

  //Emissions Calculations
  const scope2Emissions = Math.max(((actualNetPowerConsumedValue - renewableEnergyConsumptionValue) * gridEmissionsFactorValue) / 1000, 0);
  const emissionIntensity = scope2Emissions / averageDataStorageCapacityValue;
  const networkScope2Emissions = ((estimateCumulativeEnergyUsePerTimeValue - networkAverageRenewableEnergyPurchasesValue) * globalAverageGridEmissionsFactorValue) / 1000;
  const benchmarkEmissionIntensity = networkScope2Emissions / averageRawByteCapacityForReportingTimeValue;
  const marginalEmissions = Math.max(((actualNetPowerConsumedValue - renewableEnergyProducedOnsiteValue) * marginalEmissionsFactorValue) / 1000, 0);
  const normalizedEl = Math.min(1, Math.pow(0.5, emissionIntensity / benchmarkEmissionIntensity));
  const marginalEmissionsIntensity = marginalEmissions / averageDataStorageCapacity;
  const networkMarginalEmissions = ((totalNetworkElectricityConsumption - networkAverageRenewableEnergyPurchases) * globalAverageMarginalEmissionFactor) / 1000;
  const benchmarkMarginalEmissionIntensity = networkMarginalEmissions / averageRawByteCapacityForReportingTimeValue;
  const normalizedMarginalEmissionIntensity = Math.min(1, 0.15 + 0.85 * Math.pow(0.5, marginalEmissionsIntensity / benchmarkMarginalEmissionIntensity));

  //Confidence Matrix Calculations
  const locationConfidence = (
    (parseFloat(locationInfoNone) * 0 +
      parseFloat(locationInfoReportedByProvider) * 0.15 +
      parseFloat(locationInfoReportedUtilityBill) * 0.65 +
      parseFloat(locationInfoAddressReported) * 1) *
    0.05 *
    100
  ).toFixed(1);

  const nodeIdConfidence = (
    (parseFloat(nodeIdInfoNone) * 0 + parseFloat(nodeIdProviderSelfReported) * 0.25 + parseFloat(nodeIdProviderVerifiedCompletion) * 0.5 + parseFloat(nodeIdAuditorVerified) * 1) *
    0.04 *
    100
  ).toFixed(1);

  const hardwareConfidence = (
    (parseFloat(hardwareInfoNone) * 0 + parseFloat(hardwareSPSelfReported) * 0.3 + parseFloat(hardwareDocsProvided) * 0.85 + parseFloat(hardwareMediaEvidenceProvided) * 1) *
    0.06 *
    100
  ).toFixed(1);

  const waterUseConfidence = ((parseFloat(waterInfoNone) * 0 + parseFloat(waterUtilityDocsProvided) * 1) * 0.05 * 100).toFixed(1);

  const energyUseConfidence = (
    (parseFloat(energyInfoNone) * 0 + parseFloat(energyMonthlyBillProvided) * 0.4 + parseFloat(energyOnlyGranualMeasurements) * 0.75 + parseFloat(energyMeasurementsMatch) * 1) *
    0.8 *
    100
  ).toFixed(2);

  //Final Scores
  const confidenceScore = (
    (parseFloat(locationConfidence) + parseFloat(nodeIdConfidence) + parseFloat(hardwareConfidence) + parseFloat(waterUseConfidence) + parseFloat(energyUseConfidence)) /
    100
  ).toFixed(3);

  // Format Final Green Score
  const emissionsScore = normalizedEl.toFixed(3);
  const locationScore = normalizedMarginalEmissionIntensity.toFixed(3);

  // Convert emissonsScore and locationScore back to numbers for arithmetic operations
  const numericEmissionsScore = parseFloat(emissionsScore);
  const numericLocationScore = parseFloat(locationScore);

  // Ensure confidenceScore is a number, which it should already be if coming from parseFloat()
  const numericConfidenceScore = parseFloat(confidenceScore);

  // Perform the calculation using numeric values
  const greenScoreCalculation = ((numericConfidenceScore + numericEmissionsScore + numericLocationScore) / 3) * 100;
  // Convert the final result to a string with three decimal places
  const greenScore = greenScoreCalculation.toFixed(3);

  const confidenceScoreDetails: GreenscoreConfidenceScoreDetails = {
    locationConfidence,
    nodeIdConfidence,
    hardwareConfidence,
    waterUseConfidence,
    energyUseConfidence,
  };

  const scope2CalculationDetails = {
    actualNetPowerConsumedValue,
    gridEmissionsFactorValue,
    renewableEnergyConsumptionValue,
    averageDataStorageCapacityValue,
    scope2Emissions,
  };

  const emissionsIntensityDetails = {
    scope2Emissions,
    emissionIntensity,
  };

  const networkScope2EmissionsDetails = {
    estimateCumulativeEnergyUsePerTime,
    averageRawByteCapacityForReportingTimeValue,
    globalAverageGridEmissionsFactorValue,
    networkAverageRenewableEnergyPurchasesValue,
    networkScope2Emissions,
  };

  const networkMarginalEmissionDetails = {
    totalNetworkElectricityConsumption,
    totalNetworkRenewableEnergyProduction,
    globalAverageGridEmissionsFactorValue,
    networkMarginalEmissions,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (greenScore.trim() === null) {
      alert('Please have an available greenscore');
      return;
    }

    const greenscoreItem: Greenscore = {
      type: UserProfileTypeEnum.PROVIDER,
      status: ReviewStatusEnum.COMPLETE,
      documentId: documentId,
      gridEmissionsFactor,
      globalAverageGridEmissionsFactor,
      entityCompany,
      providerLocation,
      providerEmail,
      reportStartDate,
      reportEndDate,
      scope2EmissionsCalculation: Utilities.convertObjectKeysToSnakeCase(scope2CalculationDetails),
      emissionIntensityCalculation: Utilities.convertObjectKeysToSnakeCase(emissionsIntensityDetails),
      networkScope2EmissionsCalculation: Utilities.convertObjectKeysToSnakeCase(networkScope2EmissionsDetails),
      benchmarkEmissionIntensity,
      marginalEmissionsFactor,
      marginalEmissionsIntensity,
      networkMarginalEmissions: Utilities.convertObjectKeysToSnakeCase(networkMarginalEmissionDetails),
      benchmarkMarginalEmissionIntensity,
      normalizedMarginalEmissionIntensity,
      confidenceScoreDetails,
      providerCountry,
      normalizedEl,
      emissionsScore,
      locationScore,
      confidenceScore,
      greenScore,
    };

    const todaysDate = new Date();
    const date = Utilities.toDateISOString(todaysDate.toISOString());

    //Convert data keys to snake_case for the database
    const greenscoreFormatted = Utilities.convertObjectKeysToSnakeCase(greenscoreItem);
    const greenscore = [
      {
        date: date,
        greenscore: greenscoreFormatted,
      },
    ];

    try {
      const { success, result, error } = await updateGreenscoreFormPostgres({
        greenscore: greenscore,
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

  return (
    <>
      {!success || greenscores?.length < 0 ? (
        <form onSubmit={handleSubmit} style={{ paddingBottom: '5rem' }}>
          <div className={styles.header}>
            <div style={{ paddingBottom: '26px' }}>
              <NovaLogoSVG />
              <H6 className={styles.title} style={{ paddingBottom: '0.2rem' }}>
                Auditor Green Score Calculation
              </H6>
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.gridContainer2Cols}>
              <H6 className={styles.subtitle} style={{ paddingBottom: '1rem' }}>
                Digital Infrastructure Provider Information
              </H6>
              <div className={styles.row}>
                <section className={styles.eventDetails}>
                  {providerEmail && (
                    <p className={styles.time}>
                      <strong>Email:</strong> {providerEmail}
                    </p>
                  )}

                  {entityCompany && (
                    <p className={styles.time}>
                      <strong>Entity Company:</strong> {entityCompany}
                    </p>
                  )}

                  {providerLocation && (
                    <p className={styles.time}>
                      <strong>Location:</strong> {providerLocation}
                    </p>
                  )}
                  <p className={styles.time}>
                    <strong>Id:</strong> {documentId}
                  </p>
                  <p className={styles.time} style={{ paddingTop: '1rem' }}>
                    <strong>Audit Date:</strong>
                  </p>
                  <p className={styles.time}>
                    <strong>Report Start Date:</strong> {reportStartDate ? Utilities.toDateISOString(reportStartDate) : 'Not Provided'}
                  </p>
                  <p className={styles.time}>
                    <strong>Report End Date:</strong> {reportEndDate ? Utilities.toDateISOString(reportEndDate) : 'Not Provided'}
                  </p>
                  {/* <p style={{ paddingBottom: '32px' }}>
                  MinerIDs:
                  <strong style={{ color: 'var(--theme-color-accent)' }}> f01456, f03561</strong>
                </p> */}
                </section>
              </div>
            </div>

            <section>
              <H6 className={styles.subtitle} style={{ paddingBottom: '1rem' }}>
                Green Score Template
              </H6>
              <section className={styles.calculationTableStyles}>
                <div className={styles.calculationHeader}>
                  <P className={styles.step}>1</P>
                  <H6 className={styles.subtitle}>Calculate Node Total Scope 2 Emissions</H6>
                </div>
                <P className={styles.calculatinToolip}>(Electricity consumption - Renewable energy consumption) x Grid emissions factor</P>
                <div className={styles.calulationTable} style={{ paddingTop: '16px' }}>
                  <div className={styles.grid2Columns}>
                    <P className={styles.calculationTableHeading}>Provider's Entity Company</P> <InputWithSpotlight value={entityCompany} />
                  </div>
                  {/* <div className={styles.grid2Columns}>
                  <P className={styles.calculationTableHeading}>Reporting Period Start </P>
                  <InputWithSpotlight value={startDate} onChange={(e) => setReportStartDate(e.target.value)} />
                </div>
                <div className={styles.grid2Columns}>
                  <P className={styles.calculationTableHeading}>Reporting Period End</P>
                  <InputWithSpotlight value={endDate} onChange={(e) => setReportEndDate(e.target.value)} />
                </div> */}
                  <div className={styles.grid2Columns}>
                    <P className={styles.calculationTableHeading}>Actual Net Power Consumed</P>
                    <InputWithSpotlight onChange={(e) => setActualNetPowerConsumed(e.target.value)} />
                  </div>
                  <div className={styles.grid2Columns}>
                    <P className={styles.calculationTableHeading}>Location</P>
                    <InputWithSpotlight value={providerLocation} />
                  </div>
                  <div className={styles.grid2Columns}>
                    <P className={styles.calculationTableHeading}>Country</P>
                    <InputWithSpotlight value={providerCountry} />
                  </div>
                  <div className={styles.grid2Columns}>
                    <P className={styles.calculationTableHeading}>Grid Emissions Factor (IEA / OurWorld In Data) gCO2/kWh</P>
                    <InputWithSpotlight value={gridEmissionsFactor} />
                  </div>
                  <div className={styles.grid2Columns}>
                    <P className={styles.calculationTableHeading}>Renewable Energy Consumption Total (kWh)</P>
                    <InputWithSpotlight onChange={(e) => setRenewableEnergyConsumption(e.target.value)} />
                  </div>
                  <div className={styles.grid2Columns}>
                    <P className={styles.calculationTableHeading}>Average Data Storage Capacity over Reporting Time Period (PiB) </P>
                    <InputWithSpotlight onChange={(e) => setAverageDataStorageCapacity(e.target.value)} />
                  </div>

                  <div className={styles.grid2Columns} style={{ paddingTop: '16px' }}>
                    <P className={styles.calculationResult}>Scope 2 Emissions (kg CO2e)</P> <P className={styles.calculationResult}>{scope2Emissions}</P>
                  </div>
                </div>
              </section>
            </section>
            <section className={styles.calculationTableStyles}>
              <div className={styles.calculationHeader}>
                <P className={styles.step}>2</P>
                <H6 className={styles.subtitle}>Calculate Emissions Intensity</H6>
              </div>
              <P className={styles.calculatinToolip}>Scope 2 emissions / Data storage capacity</P>
              <div className={styles.calulationTable} style={{ paddingTop: '16px' }}>
                <div className={styles.grid2Columns}>
                  <P className={styles.calculationTableHeading}>Scope 2 Emissions (kg CO2e)</P> <InputWithSpotlight value={scope2Emissions} />
                </div>
                <div className={styles.grid2Columns}>
                  <P className={styles.calculationResult}>Emissions Intensity (kgC02/PiB)</P>
                  <InputWithSpotlight value={isNaN(emissionIntensity) ? 0 : emissionIntensity} />
                </div>
              </div>
            </section>
            <section className={styles.calculationTableStyles}>
              <div className={styles.calculationHeader}>
                <P className={styles.step}>3</P>
                <H6 className={styles.subtitle}>Calculate Baseline Total Scope 2 Emissions</H6>
              </div>
              <P className={styles.calculatinToolip}>(Electricity consumption - Renewable energy consumption) x Global Ave Grid emissions factor</P>
              <div className={styles.calulationTable} style={{ paddingTop: '16px' }}>
                <div className={styles.grid2Columns}>
                  <P className={styles.calculationTableHeading}>Estimate Cumulative Energy Use for Reporting Time</P>
                  <InputWithSpotlight value={estimateCumulativeEnergyUsePerTime} onChange={(e) => setEstimateCumulativeEnergyUsePerTime(e.target.value)} />
                </div>
                <div className={styles.grid2Columns}>
                  <P className={styles.calculationTableHeading}>Average Raw Byte Capacity for Reporting Time Period (PiB)</P>
                  <InputWithSpotlight value={averageRawByteCapacityForReportingTme} onChange={(e) => setAverageRawByteCapacityForReportingTme(e.target.value)} />
                </div>
                <div className={styles.grid2Columns}>
                  <P className={styles.calculationTableHeading}>
                    Global Average Grid Emissions Factor from &nbsp;
                    <Button href="https://ourworldindata.org/grapher/carbon-intensity-electricity?tab=table&country=" style={ButtonStyleEnum.LINK_GREEN}>
                      OurWorldInData
                    </Button>
                  </P>
                  <InputWithSpotlight value={globalAverageGridEmissionsFactor} onChange={(e) => setGlobalAverageGridEmissionsFactor(e.target.value)} />
                </div>
                <div className={styles.grid2Columns}>
                  <P className={styles.calculationTableHeading}>Network Average Renewable Energy Purchases (kWh)</P>
                  <InputWithSpotlight value={networkAverageRenewableEnergyPurchases} onChange={(e) => setNetworkAverageRenewableEnergyPurchases(e.target.value)} />
                </div>
                <div className={styles.grid2Columns} style={{ paddingTop: '16px' }}>
                  <P className={styles.calculationResult}>Network Scope 2 Emissions (kg CO2e)</P> <InputWithSpotlight value={networkScope2Emissions} disabled />
                </div>
              </div>
            </section>

            <section className={styles.calculationTableStyles}>
              <div className={styles.calculationHeader}>
                <P className={styles.step}>4</P>
                <H6 className={styles.subtitle}>Calculate Benchmark Emissions Intensity</H6>
              </div>
              <p style={{ paddingBottom: '0.5rem' }}>Network Scope 2 Emissions (kg CO2e) / Average Raw Byte Capacity for Reporting Time Period (PiB)</p>
              <div className={styles.grid2Columns}>
                <P className={styles.calculationResult}>Benchmark EI (kgCO2/PiB)</P>{' '}
                <InputWithSpotlight value={isNaN(benchmarkEmissionIntensity) ? 0 : benchmarkEmissionIntensity.toFixed(2)} disabled />
              </div>
            </section>

            <section className={styles.calculationTableStyles}>
              <div className={styles.calculationHeader}>
                <P className={styles.step}>5</P>
                <H6 className={styles.subtitle}> Emissions Score = 1 - Normalized Emissions Intensity</H6>
              </div>
              <P className={styles.calculatinToolip}> 1 - (Provider's Emissions Intensity / Benchmark Emissions Intensity)</P>
              <div className={styles.grid2Columns}>
                <P className={styles.calculationResult}>Normalized EI (kgCO2/PiB)</P> <InputWithSpotlight value={isNaN(normalizedEl) ? 0 : normalizedEl.toFixed(2)} disabled />
              </div>
            </section>

            <section className={styles.calculationTableStyles}>
              <div className={styles.calculationHeader}>
                <P className={styles.step}>6</P>
                <H6 className={styles.subtitle}>Provider's Marginal Emissions Score</H6>
              </div>
              <P className={styles.calculatinToolip}>(Total Electricity Consumption - Renewable Energy Produced On Site) * Grid Marginal Emissions Factor</P>

              <div className={styles.grid2Columns} style={{ paddingBottom: '0.5rem' }}>
                <P className={styles.calculationTableHeading}>Actual Net Power Consumed (kWh) (Power Consumed - Power Returned)</P>
                <InputWithSpotlight value={actualNetPowerConsumed} disabled />
              </div>
              <div className={styles.grid2Columns} style={{ paddingBottom: '0.5rem' }}>
                <P className={styles.calculationTableHeading}>Marginal Emissions Factor (WattTime MOER or IFI) gCO2/kWh</P>
                <InputWithSpotlight value={marginalEmissionsFactor} />
              </div>
              <div className={styles.grid2Columns} style={{ paddingBottom: '0.5rem' }}>
                <P className={styles.calculationTableHeading}>Renewable Energy Produced Onsite Total (kWh)</P>
                <InputWithSpotlight
                  value={renewableEnergyProducedOnsite}
                  onChange={(e) => {
                    setRenewableEnergyProducedOnsite(e.target.value);
                  }}
                />
              </div>
              <div className={styles.grid2Columns}>
                <P className={styles.calculationResult}>Marginal Emissions (kg CO2e)</P> <InputWithSpotlight value={marginalEmissions.toFixed(2)} disabled />
              </div>
            </section>

            <section className={styles.calculationTableStyles}>
              <div className={styles.calculationHeader}>
                <P className={styles.step}>7</P>
                <H6 className={styles.subtitle}>Provider's Marginal Emissions Intensity</H6>
              </div>
              <P className={styles.calculatinToolip}>Provider's Marginal Emissions / Provider's Data Storage Capacity</P>
              <div className={styles.grid2Columns}>
                <P className={styles.calculationResult}>Provider's Marginal Emissions Intensity (kgCO2/PiB)</P>
                <InputWithSpotlight value={isNaN(marginalEmissionsIntensity) ? 0 : marginalEmissionsIntensity.toFixed(2)} disabled />
              </div>
            </section>
            <section className={styles.calculationTableStyles} style={{ display: 'grid', gap: '0.5rem' }}>
              <div className={styles.calculationHeader}>
                <P className={styles.step}>8</P>
                <H6 className={styles.subtitle}>Network Marginal Emissions</H6>
              </div>

              <P className={styles.calculatinToolip}>
                (Total Network Electricity Consumption - Total Network Renewable Energy Production) * Marginal Grid Emissions Factor, Global Average
              </P>

              <div className={styles.grid2Columns}>
                <P className={styles.calculationTableHeading}>Estimate Cumulative Energy Use for Reporting Time period (kWh)</P>
                <InputWithSpotlight
                  value={totalNetworkElectricityConsumption}
                  onChange={(e) => {
                    setTotalNetworkElectricityConsumption(e.target.value);
                  }}
                />
              </div>
              <div className={styles.grid2Columns}>
                <P className={styles.calculationTableHeading}>Total Network Renewable Energy Production</P>
                <InputWithSpotlight
                  value={totalNetworkRenewableEnergyProduction}
                  onChange={(e) => {
                    setTotalNetworkRenewableEnergyProduction(e.target.value);
                  }}
                />
              </div>

              <div className={styles.grid2Columns}>
                <P className={styles.calculationTableHeading}>Global Average Marginal Emissions Factor (gCO2/kWh)</P>
                <InputWithSpotlight value={globalAverageMarginalEmissionFactor} disabled />
              </div>
              <div className={styles.grid2Columns}>
                <P className={styles.calculationTableHeading}>Network Average Renewable Energy Purchases (kWh)</P>
                <InputWithSpotlight value={networkAverageRenewableEnergyPurchases} disabled />
              </div>
              <div className={styles.grid2Columns}>
                <P className={styles.calculationResult}> Network Marginal Emissions (kg CO2e)</P> <InputWithSpotlight value={networkMarginalEmissions.toFixed(2)} disabled />
              </div>
            </section>
            <section className={styles.calculationTableStyles}>
              <div className={styles.calculationHeader}>
                <P className={styles.step}>9</P>
                <H6 className={styles.subtitle}>Benchmark Marginal Network Emissions Intensity</H6>
              </div>
              <P className={styles.calculatinToolip}>Network Marginal Emissions / Network Storage Capacity </P>

              <div className={styles.grid2Columns}>
                <P className={styles.calculationResult}>Benchmark Marginal EI (kgCO2/PiB)</P>{' '}
                <InputWithSpotlight value={isNaN(benchmarkMarginalEmissionIntensity) ? 0 : benchmarkMarginalEmissionIntensity.toFixed(2)} disabled />
              </div>
            </section>
            <section className={styles.calculationTableStyles}>
              <div className={styles.calculationHeader}>
                <P className={styles.step}>10</P>
                <H6 className={styles.subtitle}>Location Score = 1 - Normalized Marginal Emissions Intensity</H6>
              </div>
              <P className={styles.calculatinToolip}>1 - (Provider Marginal Network Emissions Intensity / Benchmark Marginal Network Emissions Intensity)</P>
              <div className={styles.grid2Columns}>
                <P className={styles.calculationResult}>Normalized Marginal EI (kgCO2/PiB) </P>
                <InputWithSpotlight value={isNaN(normalizedMarginalEmissionIntensity) ? 0 : normalizedMarginalEmissionIntensity.toFixed(2)} disabled />
              </div>
            </section>

            <div className={styles.calculationHeader}>
              <P className={styles.step}>11</P>
              <H6 className={styles.subtitle}>Assign a Confidence Score based on the Qualify Criteria from the Provider Confidence Scoring Matrix </H6>
            </div>
            <H6 className={styles.subtitle}>Confidence Score Matrix</H6>

            <div>
              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', width: '100%', background: 'var(--color-table-background)' }}>
                <p className={styles.headerTitle} style={{ color: 'var(--color-black)' }}>
                  Green Score Criteria
                </p>
                <p className={styles.headerTitle} style={{ color: 'var(--color-black)' }}>
                  Data Inputs
                </p>
              </div>

              <div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.borderBottom)} style={{ background: 'var(--color-table-background)', gridColumn: 'span 2' }}>
                    Confidence Scoring Matrix
                  </p>
                  <p className={classNames(styles.headerTitle, styles.borderBottom)} style={{ background: 'var(--color-table-background)' }}>
                    Location
                  </p>
                  <p className={classNames(styles.headerTitle, styles.borderBottom)} style={{ background: 'var(--color-table-background)' }}>
                    NodeIDs
                  </p>
                  <p className={classNames(styles.headerTitle, styles.borderBottom)} style={{ background: 'var(--color-table-background)' }}>
                    Hardware
                  </p>
                  <p className={classNames(styles.headerTitle, styles.borderBottom)} style={{ background: 'var(--color-table-background)' }}>
                    Water Use
                  </p>
                  <p className={classNames(styles.headerTitle, styles.borderBottom)} style={{ background: 'var(--color-table-background)' }}>
                    Energy Use
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom)} style={{ background: 'var(--color-table-background)' }}>
                    Description
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom)} style={{ background: 'var(--color-table-background)' }}>
                    Weights
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderLeft)}>5%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderLeft)}>4%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderLeft)}>6%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderLeft)}>5%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderLeft, styles.borderRight)}>80%</p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p
                    className={classNames(styles.headerTitle, styles.tableColumn)}
                    style={{ background: 'var(--color-table-background)', gridColumn: 'span 2', borderBottom: '1px solid var(--color-grey-transparent100)' }}
                  >
                    Location Information
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>No location info provided </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>0%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut, styles.borderTop)}>
                    <InputWithSpotlight
                      type="number"
                      value={locationInfoNone}
                      onChange={(e) =>
                        handleInputChange(e.target.value, setLocationInfoNone, [locationInfoReportedByProvider, locationInfoAddressReported, locationInfoReportedUtilityBill])
                      }
                      max="1"
                      step="0.1"
                      background="var(--color-white)"
                    />
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>Self reported by Provider</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>15%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={locationInfoReportedByProvider}
                      onChange={(e) =>
                        handleInputChange(e.target.value, setLocationInfoReportedByProvider, [locationInfoNone, locationInfoAddressReported, locationInfoReportedUtilityBill])
                      }
                      background="var(--color-white)"
                      max="1"
                      step="0.1"
                    />
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>
                    Reported on Power Utility bill or other third-party document
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>65%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={locationInfoReportedUtilityBill}
                      onChange={(e) =>
                        handleInputChange(e.target.value, setLocationInfoReportedUtilityBill, [locationInfoNone, locationInfoReportedByProvider, locationInfoAddressReported])
                      }
                      max="1"
                      step="0.1"
                      background="var(--color-white)"
                    />
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>
                    Address reported on two third-party documents & all info matches
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>100%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={locationInfoAddressReported}
                      onChange={(e) =>
                        handleInputChange(e.target.value, setLocationInfoAddressReported, [locationInfoNone, locationInfoReportedByProvider, locationInfoReportedUtilityBill])
                      }
                      max="1"
                      step="0.1"
                      background="var(--color-white)"
                    />
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}></p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}> </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.matrixResult)}>Location Total</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderTop, styles.calculationResult)}>
                    {locationConfidence ? locationConfidence : 0}%
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p
                    className={styles.headerTitle}
                    style={{ background: 'var(--color-table-background)', gridColumn: 'span 3', borderBottom: '1px solid var(--color-grey-transparent100) ' }}
                  >
                    NodeIDs Information
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>No minerId info provided </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>0%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    {/* <Select value={nodeIdInfoNone} onChange={(e) => setnodeIdInfoNone(e.target.value)} options={options} /> */}
                    <InputWithSpotlight
                      type="number"
                      value={nodeIdInfoNone}
                      onChange={(e) => handleInputChange(e.target.value, setNodeIdInfoNone, [nodeIdAuditorVerified, nodeIdProviderSelfReported, nodeIdProviderVerifiedCompletion])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderTop)}>-</p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>Self Reported by Provider</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>25%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={nodeIdProviderSelfReported}
                      onChange={(e) => handleInputChange(e.target.value, setNodeIdProviderSelfReported, [nodeIdInfoNone, nodeIdAuditorVerified, nodeIdProviderVerifiedCompletion])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>
                    {' '}
                    Provider verifies list is complete
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>50%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={nodeIdProviderVerifiedCompletion}
                      onChange={(e) => handleInputChange(e.target.value, setNodeIdProviderVerifiedCompletion, [nodeIdInfoNone, nodeIdAuditorVerified, nodeIdProviderSelfReported])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>
                    Auditor verifies no discrepancies
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>100%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={nodeIdAuditorVerified}
                      onChange={(e) => handleInputChange(e.target.value, setNodeIdAuditorVerified, [nodeIdInfoNone, nodeIdProviderSelfReported, nodeIdProviderVerifiedCompletion])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}></p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}></p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.matrixResult)}> NodeIDs Total</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.calculationResult)}>
                    {nodeIdConfidence ? `${nodeIdConfidence}%` : '-'}
                  </p>
                </div>

                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p
                    className={styles.headerTitle}
                    style={{ background: 'var(--color-table-background)', gridColumn: 'span 4', borderBottom: '1px solid var(--color-grey-transparent100) ' }}
                  >
                    Hardware Information
                  </p>
                </div>

                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>No hardware info provided</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>0%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={hardwareInfoNone}
                      onChange={(e) => handleInputChange(e.target.value, setHardwareInfoNone, [hardwareDocsProvided, hardwareSPSelfReported, hardwareMediaEvidenceProvided])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.borderBottom, styles.borderRight)}>-</p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>
                    Confguration is self reported by Node Provider on EVP Hardware Template
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>30%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={hardwareSPSelfReported}
                      onChange={(e) => handleInputChange(e.target.value, setHardwareSPSelfReported, [hardwareInfoNone, hardwareDocsProvided, hardwareMediaEvidenceProvided])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>
                    Receipts, attestation documents provided to verify claims
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>85%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={hardwareDocsProvided}
                      onChange={(e) => handleInputChange(e.target.value, setHardwareDocsProvided, [hardwareInfoNone, hardwareSPSelfReported, hardwareMediaEvidenceProvided])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>
                    Photo/video evidence provided to further verify claimsP
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>100%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={hardwareMediaEvidenceProvided}
                      onChange={(e) => handleInputChange(e.target.value, setHardwareMediaEvidenceProvided, [hardwareInfoNone, hardwareDocsProvided, hardwareSPSelfReported])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.matrixResult)}>Hardware Total</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderTop, styles.calculationResult)}>
                    {hardwareConfidence ? `${hardwareConfidence}%` : '-'}
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p
                    className={styles.headerTitle}
                    style={{ background: 'var(--color-table-background)', gridColumn: 'span 5', borderBottom: '1px solid var(--color-grey-transparent100) ' }}
                  >
                    Water Use Information
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>No water use info</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>0%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={waterInfoNone}
                      onChange={(e) => handleInputChange(e.target.value, setWaterInfoNone, [waterUtilityDocsProvided])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>Monthly utility bill</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>100%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={waterUtilityDocsProvided}
                      onChange={(e) => handleInputChange(e.target.value, setWaterUtilityDocsProvided, [waterInfoNone])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.matrixResult)}>Water Use Total</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.calculationResult, styles.borderTop)}>
                    {waterUseConfidence ? `${waterUseConfidence}%` : '-'}
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p
                    className={styles.headerTitle}
                    style={{ background: 'var(--color-table-background)', gridColumn: 'span 7', borderBottom: '1px solid var(--color-grey-transparent100) ' }}
                  >
                    Energy Use Information
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>No Energy use info</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>0%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={energyInfoNone}
                      onChange={(e) => handleInputChange(e.target.value, setEnergyInfoNone, [energyMonthlyBillProvided, energyOnlyGranualMeasurements, energyMeasurementsMatch])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>

                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}></p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>Only monthly power bill</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>40%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={energyMonthlyBillProvided}
                      onChange={(e) => handleInputChange(e.target.value, setEnergyMonthlyBillProvided, [energyInfoNone, energyOnlyGranualMeasurements, energyMeasurementsMatch])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}></p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>Only granular measurements</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>75%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={energyOnlyGranualMeasurements}
                      onChange={(e) => handleInputChange(e.target.value, setOnlyEnergyGranualMeasurements, [energyInfoNone, energyMonthlyBillProvided, energyMeasurementsMatch])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>

                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>
                    Power bill + granular measurements & match
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>100%</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.backgroundFillOut)}>
                    <InputWithSpotlight
                      type="number"
                      value={energyMeasurementsMatch}
                      onChange={(e) => handleInputChange(e.target.value, setEnergyMeasurementsMatch, [energyInfoNone, energyMonthlyBillProvided, energyOnlyGranualMeasurements])}
                      max="1"
                      min="0"
                      step="0.1"
                    />
                  </p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>

                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.matrixResult)}>Energy Use Total</p>

                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft, styles.calculationResult)}>
                    {energyUseConfidence ? `${energyUseConfidence}%` : '-'}
                  </p>
                </div>
                <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)} />
                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.matrixResult)}>Final Confidence Score</p>

                  <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft, styles.calculationResult)}>
                    {confidenceScore ? confidenceScore : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* <div style={{ paddingBottom: '24px', paddingTop: '24px' }}>
              <div className={styles.calculationHeader} style={{ paddingBottom: '24px' }}>
                <P className={styles.step}>12</P>
                <H6 className={styles.subtitle}>Review Final Results</H6>
              </div>
              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', width: '100%', background: 'var(--theme-color-accent)' }}>
                <p className={styles.headerTitle} style={{ color: 'var(--color-white)' }}>
                  Green Score Results
                </p>
              </div>
              <div className={styles.gridContainer2Cols}>
                <div className={styles.row}>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Emissions Score</p>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{emissionsScore ? emissionsScore : '-'}</p>
                </div>
  
                <div className={styles.row}>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Location Score</p>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{locationScore ? locationScore : '-'}</p>
                </div>
                <div className={styles.row}>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Confidence Score</p>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{confidenceScore ? confidenceScore : '-'}</p>
                </div>
                <div className={styles.row}>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Green Score</p>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{greenScore ? greenScore : '-'}</p>
                </div>
              </div>
            </div> */}

            <GreenscoreResult date={null} locationScore={locationScore} greenScore={greenScore} emissionsScore={emissionsScore} confidenceScore={confidenceScore} />

            <Button style={ButtonStyleEnum.SQUARE_BLACK}>Review</Button>
          </div>
        </form>
      ) : (
        <SuccessScreen message={'The Greenscore has been submitted! Please refresh the page to see the latest submission.'} />
      )}
    </>
  );
}
