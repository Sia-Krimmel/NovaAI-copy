import styles from '@components/EVPReport.module.scss';

import * as Utilities from 'common/utilities';

import { classNames } from '@root/common/utilities';
import { H6, P } from './typography';
import GreenScoreCard from './GreenScoreCard';
import NovaLogoSVG from './svgs/NovaLogoSVG';
import { GLOBAL_AVERAGE_MARGINAL_EMISSION_FACTOR } from './GreenscoreCalculationForm';

export default function EVPReport({ showSummaryText, document, documentId, greenscores, userId }) {
  const greenscore = greenscores ? greenscores[greenscores?.length - 1]?.greenscore : null;
  const greenscoreCreationDate = greenscores ? greenscores[greenscores?.length - 1].date : null;

  const providerLocation = greenscore?.providerLocation;
  const providerCountry = greenscore?.providerCountry;

  const greenscoreFinal = greenscore?.greenScore;

  const confidenceScore = greenscore?.confidenceScore;
  const emissionsScore = greenscore?.emissionsScore;
  const entityCompany = greenscore?.entityCompany;
  const gridEmissionFactor = greenscore?.gridEmissionsFactor;
  const locationScore = greenscore?.locationScore;
  const marginalEmissionsFactor = greenscore?.marginalEmissionsFactor;
  const globalAverageMarginalEmissionsFactor = greenscore?.globalMarginalEmissionsFactor || GLOBAL_AVERAGE_MARGINAL_EMISSION_FACTOR;
  const networkAverageRenewableEnergyPurchases = greenscore?.networkScope2EmissionsCalculation?.networkAverageRenewableEnergyPurchasesValue;
  const globalAverageGridEmissionsFactor = greenscore?.networkMarginalEmissions?.globalAverageGridEmissionsFactorValue;
  const networkMarginalEmissions = greenscore?.networkMarginalEmissions?.networkMarginalEmissions;
  const estimateCumulativeEnergyUsePerTimePeriod = greenscore?.networkScope2EmissionsCalculation?.estimateCumulativeEnergyUsePerTime;
  const formattedEstimateCumulativeNetworkEnergyUse = parseInt(estimateCumulativeEnergyUsePerTimePeriod, 10);

  const hardwareConfidence = greenscore?.confidenceScoreDetails?.hardwareConfidence;
  const locationConfidence = greenscore?.confidenceScoreDetails?.locationConfidence;
  const waterUseConfidence = greenscore?.confidenceScoreDetails?.waterUseConfidence;
  const nodeIdConfidence = greenscore?.confidenceScoreDetails?.minerIdConfidence || greenscore?.confidenceScoreDetails?.nodeIdConfidence;
  const energyUseConfidence = greenscore?.confidenceScoreDetails?.energyUseConfidence || greenscore?.confidenceScoreDetails?.energyUseConfidenceCalculation;

  const auditorRecommendation = document?.audit_review?.audit_outputs?.feedback || document?.audit_review?.audit_outputs[0]?.audit_outputs?.feedback;

  // Location accuracy thresholds
  const locationAccuracy0of5 = 0; // 0% of 5
  const locationAccuracy15of5 = 0.75; // 15% of 5
  const locationAccuracy65of5 = 3.25; // 65% of 5
  const locationAccuracy100of5 = 5; // 100% of 5

  // Node ID accuracy thresholds
  const nodeIdAccuracy0of4 = 0; // 0% of 4
  const nodeIdAccuracy25of4 = 1; // 25% of 4
  const nodeIdAccuracy50of4 = 2; // 50% of 4
  const nodeIdAccuracy100of4 = 4; // 50% of 4

  // Hardware accuracy thresholds
  const hardwareAccuracy0 = 1.8; // 0% of 6
  const hardwareAccuracy30of6 = 1.8; // 30% of 6
  const hardwareAccuracy85of6 = 5.1; // 85% of 6
  const hardwareAccuracy100of6 = 6; // 100% of 6

  // Energy accuracy thresholds
  const energyAccuracy40of80 = 32; // 40% of 80
  const energyAccuracy75of80 = 60; // 75% of 80
  const energyAccuracy100of80 = 80; // 100% of 80

  // Energy water thresholds
  const waterAccuracy100of5 = 5; // 100% of 5

  return (
    <div>
      <section className={styles.eventStyle}>
        <div className={styles.popup} style={{ backgroundColor: styles.backgroundColor ?? 'var(--color-white)' }}>
          <div className={styles.header}>
            <div style={{ paddingBottom: '24px' }}>
              <NovaLogoSVG />
              <P className={styles.eventName} style={{ paddingBottom: '0.2rem', paddingTop: '20px' }}>
                Energy Validation Process
              </P>
              <H6>Findings & Recommendations</H6>
            </div>
          </div>

          <div className={styles.scheduleContainer}>
            <div className={styles.gridContainer2Cols} style={{ paddingBottom: '32px' }}>
              <div className={styles.row}>
                <section className={styles.eventDetails}>
                  {entityCompany && (
                    <p className={styles.time}>
                      <strong>Entity Company: {entityCompany}</strong>
                    </p>
                  )}
                  {providerLocation && (
                    <p className={styles.time}>
                      <strong>Location: {providerLocation}</strong>
                    </p>
                  )}

                  {providerCountry && (
                    <p className={styles.time}>
                      <strong>Country: {providerCountry}</strong>
                    </p>
                  )}

                  {greenscoreCreationDate && (
                    <p className={styles.time}>
                      <strong>Audit Date: {greenscoreCreationDate}</strong>
                    </p>
                  )}
                </section>
                <GreenScoreCard withBorder={true} withButton={false} greenscore={greenscoreFinal} />
              </div>
            </div>

            {showSummaryText ? (
              <>
                <H6 style={{ paddingBottom: '8px' }}>Summary</H6>

                <p style={{ paddingBottom: '32px' }}>
                  Thank you for completing the Nova Energy Validation Process (EVP). We recognize the dedication necessary to complete the EVP, and we appreciate your commitment to
                  providing this level of transparency into your energy use. Your EVP results and attached documents have been reviewed and validated against our environmental
                  impact matrix and Green Score methodology.
                  <br /> <br />
                  {/* This EVP includes reported nodeIDs
  <strong style={{ color: 'var(--theme-color-accent)' }}> G011111, G011111</strong> */}
                </p>

                <div style={{ paddingBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem' }}>
                  <H6>Green Score for the time period of:</H6>
                  <H6 style={{ color: 'var(--color-accent)' }}>
                    {Utilities.toDateISOString(greenscore?.reportEndDate)} - {Utilities.toDateISOString(greenscore?.reportStartDate)}
                  </H6>
                </div>

                <p style={{ paddingBottom: '32px' }}>
                  Your <strong>Green Score</strong> for this reporting period for your operations in the{' '}
                  <strong style={{ color: 'var(--theme-color-accent)' }}>{providerLocation}</strong> is{' '}
                  <strong style={{ color: 'var(--theme-color-accent)' }}>{greenscoreFinal}</strong>
                  {/* , and your sustainability tier is{' '} */}
                  {/* <strong style={{ color: 'var(--theme-color-accent)' }}>Platinum</strong> */}. Please note that the criteria is subject to change on an annual basis to ensure
                  our methodology remains aligned with evolving sustainability reporting best practices. Forthcoming changes include requirements on emissions profiling, green
                  energy matching, and embodied emissions. We look forward to actively engaging and collaborating to increase our collective expertise on these important energy use
                  topics.
                </p>

                <H6 style={{ paddingBottom: '8px' }}>Criteria and Findings</H6>
                <div style={{ paddingBottom: '32px' }}>
                  <p>
                    The Energy Validation Process (EVP) allows Digital Infrastructure Providers interested in making strong sustainability claims to publicly verify the associated
                    data. This process is designed to be conducted on a quarterly basis, during which Providers submit data on key operational criteria for the Nova Energy team and
                    third-party assessors to validate. To meet the requirements set forth in the EVP, Digital Infrastructure Providers provide information on location, water usage,
                    energy consumption, and renewable energy purchases to Filecoin (if a Filecoin SP). Third-party assessors verifies the submitted information using utility bills,
                    metering logs, and calibration records if available. Additionally, the third-party assessors attest to validity of sealing, storing, cumulative energy use, and
                    renewable energy production and consumption data within estimated lower and upper bounds by nodeID.
                  </p>
                  <br />
                  <p>
                    The results of the EVP are overlaid on the environmental impact matrix and Green Score methodology to assign Storage Providers a Green Score ranging from 0 to
                    100. Green Scores embody our unyielding commitment to sustainability, a reflection of efficiency, and a roadmap to a carbon-neutral future. We've made it open
                    source and accessible on the Green Scores website. Below you will find a detailed breakdown of your EVP and Green Score for this reporting period.
                  </p>
                </div>
                {auditorRecommendation && (
                  <div style={{ alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem', paddingBottom: '32px' }}>
                    <H6 style={{ paddingBottom: '8px' }}>Recommendation</H6>

                    <p>{auditorRecommendation}</p>
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
            <H6 style={{ paddingBottom: '16px' }}>Audit Outputs</H6>

            <div>
              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', width: '100%', background: 'var(--color-table-background)' }}>
                <p className={styles.headerTitle} style={{ color: 'var(--color-black)' }}>
                  Green Score Criteria
                </p>
                <p className={styles.headerTitle} style={{ color: 'var(--color-black)' }}>
                  Data Inputs
                </p>
              </div>
            </div>

            <div className={styles.gridContainer2Cols} style={{ paddingBottom: '24px' }}>
              <div className={styles.row}>
                <p className={Utilities.classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Entity Name</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{entityCompany}</p>
              </div>

              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Location</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{providerLocation}</p>
              </div>
              <div className={styles.row}>
                <p className={Utilities.classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Country</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{providerCountry || '-'}</p>
              </div>

              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Reporting Period Start</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{Utilities.toDateISOString(greenscore?.reportStartDate)}</p>
              </div>

              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Reporting Period End</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{Utilities.toDateISOString(greenscore?.reportEndDate)}</p>
              </div>

              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Actual Net Power Consumed (kWh)</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{greenscore?.scope2EmissionsCalculation?.actualNetPowerConsumedValue}</p>
              </div>
              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Renewable Energy Consumption Total (kWh)</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>
                  {greenscore?.scope2EmissionsCalculation?.renewableEnergyConsumptionValue}
                </p>
              </div>

              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>
                  Estimate Cumulative Network Energy Use for Reporting Time Period (kWh)
                </p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{formattedEstimateCumulativeNetworkEnergyUse}</p>
              </div>

              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Network Average Renewable Energy Purchases (kWh)</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>
                  {' '}
                  {networkAverageRenewableEnergyPurchases ? networkAverageRenewableEnergyPurchases : 0}
                </p>
              </div>

              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Grid Emissions Factor (gCO2/kWh)</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{gridEmissionFactor || '-'}</p>
              </div>

              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>
                  Global Average Grid Emissions Factor from OurWorldInData (gCO2/kWh)
                </p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{globalAverageGridEmissionsFactor ?? '-'}</p>
              </div>

              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>
                  Marginal Emission Factor (WattTime MOER or IFI) gCO2/kWh
                </p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{marginalEmissionsFactor || '-'}</p>
              </div>

              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>
                  Global Average Marginal Emissions Factor (gCO2/kWh)
                </p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{globalAverageMarginalEmissionsFactor || '-'}</p>
              </div>

              {/* <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>
                  Global Average Marginal Emissions Factor (gCO2/kWh)
                </p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>-</p>
              </div> */}
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
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  No location info provided
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>0%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderTop, styles.borderRight)}>
                  {locationConfidence == 0 ? `${locationConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  Self reported by the Provider
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>15%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderTop, styles.borderRight)}>
                  {locationConfidence <= locationAccuracy15of5 && locationConfidence > 0 ? `${locationConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  Reported on Power Utility bill or other third-party document
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>65%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderTop, styles.borderRight)}>
                  {locationConfidence < locationAccuracy100of5 && locationConfidence > locationAccuracy15of5 ? `${locationConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  Address reported on two third-party documents & all info matches
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>100%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderTop, styles.borderRight)}>
                  {locationConfidence <= locationAccuracy100of5 && locationConfidence > locationAccuracy65of5 ? `${locationConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p
                  className={styles.headerTitle}
                  style={{ background: 'var(--color-table-background)', gridColumn: 'span 4', borderBottom: '1px solid var(--color-grey-transparent100) ' }}
                >
                  Node IDs Information
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  No Node ID provided
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>0%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>
                  {nodeIdConfidence < nodeIdAccuracy25of4 ? `${nodeIdConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  Self Reported by Provider
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>25%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>
                  {nodeIdConfidence < nodeIdAccuracy50of4 && nodeIdConfidence >= nodeIdAccuracy25of4 ? `${(nodeIdConfidence / 4) * 100}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  Provider verifies list is complete
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>50%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>
                  {nodeIdConfidence < nodeIdAccuracy100of4 && nodeIdConfidence >= nodeIdAccuracy50of4 ? `${nodeIdConfidence}` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  Auditor verifies no discrepancies
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>100%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>
                  {nodeIdConfidence <= nodeIdAccuracy100of4 && nodeIdConfidence > nodeIdAccuracy50of4 ? `${nodeIdConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p
                  className={styles.headerTitle}
                  style={{ background: 'var(--color-table-background)', gridColumn: 'span 5', borderBottom: '1px solid var(--color-grey-transparent100) ' }}
                >
                  Hardware Information
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  No hardware info provided
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>0%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.borderBottom, styles.borderRight)}>
                  {hardwareConfidence < hardwareAccuracy30of6 ? `${hardwareConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  Confguration is self reported by Node Provider on EVP Hardware Template
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>30%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.borderBottom, styles.borderRight)}>
                  {hardwareConfidence >= hardwareAccuracy30of6 && hardwareConfidence < hardwareAccuracy85of6 ? `${hardwareConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  Receipts, attestation documents provided to verify claims
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>85%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.borderBottom, styles.borderRight)}>
                  {hardwareConfidence > hardwareAccuracy30of6 && hardwareConfidence < hardwareAccuracy100of6 ? `${hardwareConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  Photo/video evidence provided to further verify claims
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>100%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.borderBottom, styles.borderRight)}>
                  {hardwareConfidence > hardwareAccuracy85of6 && hardwareConfidence <= hardwareAccuracy100of6 ? `${hardwareConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p
                  className={styles.headerTitle}
                  style={{ background: 'var(--color-table-background)', gridColumn: 'span 6', borderBottom: '1px solid var(--color-grey-transparent100) ' }}
                >
                  Water Use Information
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  No water use info
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>0%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>
                  {waterUseConfidence >= 0 && waterUseConfidence < waterAccuracy100of5 ? `${waterUseConfidence}%` : '-'}{' '}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)} style={{ fontSize: '12px' }}>
                  Monthly utility bill
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>100%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>
                  {waterUseConfidence <= waterAccuracy100of5 && waterUseConfidence > 0 ? `${waterUseConfidence}%` : '-'}{' '}
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
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderLeft, styles.borderRight)} style={{ fontSize: '12px' }}>
                  {' '}
                  No Energy use info
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}> 0%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom)}>-</p>

                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>
                  {energyUseConfidence < energyAccuracy40of80 ? `${energyUseConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderLeft, styles.borderRight)} style={{ fontSize: '12px' }}>
                  {' '}
                  Only monthly power bill
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}> 40%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom)}>-</p>

                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>
                  {energyUseConfidence < energyAccuracy75of80 && energyUseConfidence >= energyAccuracy40of80 ? `${energyUseConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderLeft, styles.borderRight)} style={{ fontSize: '12px' }}>
                  {' '}
                  Only granular measurements
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}> 75%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom)}>-</p>

                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>
                  {energyUseConfidence > energyAccuracy40of80 && energyUseConfidence < energyAccuracy100of80 ? `${energyUseConfidence}%` : '-'}
                </p>
              </div>

              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', width: '100%' }}>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderLeft, styles.borderRight)} style={{ fontSize: '12px' }}>
                  {' '}
                  Power bill + granular measurements & match
                </p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}> 100%</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight)}>-</p>
                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom)}>-</p>

                <p className={classNames(styles.headerTitle, styles.tableColumn, styles.borderBottom, styles.borderRight, styles.borderLeft)}>
                  {energyUseConfidence <= energyAccuracy100of80 && energyUseConfidence > energyAccuracy75of80 ? `${energyUseConfidence}%` : '-'}
                </p>
              </div>

              <P style={{ paddingTop: '1rem', color: 'var(--color-accent)' }}>Final Confidence Score: {confidenceScore}</P>
            </div>

            <div style={{ paddingBottom: '24px', paddingTop: '24px' }}>
              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', width: '100%', background: 'var(--theme-color-accent)' }}>
                <p className={styles.headerTitle} style={{ color: 'var(--color-white)' }}>
                  Your Green Score Results
                </p>
              </div>
              <div className={styles.gridContainer2Cols}>
                <div className={styles.row}>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Emissions Score</p>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{emissionsScore}</p>
                </div>

                <div className={styles.row}>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Location Score</p>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{locationScore}</p>
                </div>
                <div className={styles.row}>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Confidence Score</p>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{confidenceScore}</p>
                </div>
                <div className={styles.row}>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Green Score</p>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{greenscoreFinal}</p>
                </div>
              </div>
            </div>
            <div style={{ paddingBottom: '24px' }}>
              <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', width: '100%' }}>
                <p className={styles.headerTitle} style={{ background: 'var(--color-table-background)' }}>
                  Green Score Tiering
                </p>
              </div>
              <div className={styles.gridContainer2Cols}>
                <div className={styles.row}>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Platinum</p>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>90.01 - 100</p>
                </div>

                <div className={styles.row}>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Gold</p>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>80.01 - 90</p>
                </div>
                <div className={styles.row}>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Silver</p>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>70.01 - 80</p>
                </div>
                <div className={styles.row}>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Bronze</p>
                  <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>60 - 70</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
