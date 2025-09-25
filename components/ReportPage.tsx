import '@root/global.scss';
import Image from 'next/image';
import styles from '@root/components/ReportPage.module.scss';
import DarkLogoSVG from './svgs/DarkLogoSVG';

const items = [
  {
    title: 'Summary',
    text: 'Thank you for completing the Nova Energy Validation Process (EVP). We recognize the dedication necessary to complete the EVP, and we appreciate your commitment to providing this level of transparency into your energy use. Your EVP results and attached documents have been reviewed and validated against our environmental impact matrix and Green Score methodology.This EVp includes reported minderIDs G011111, G0111111',
  },
  {
    title: 'Jul-Sept 2023 Green Score',
    text: 'Your Green Score for this reporting period for your operations in the Worldwide Location is 94,333, and your sustainability tier is Platinum. Please note that the criteria is subject to change on an annual basis to ensure our methodology remains aligned with evolving sustainability reporting best practices. Forthcoming changes include requirements on emissions profiling, green energy matching and embodied emission. We look forward to actively engaging and collaborating to increase our collective expertise on these important energy use topics.',
  },
  {
    title: 'Criteria and Findings',
    text: 'The Energy Validation Process (EVP) allows Digital Infrastructure Providers (SPs) interested in making strong sustainability claims to publicly verify the associated data. This process is designed to be conducted on a quarterly basis during which SPs submit data on key operational criteria for the Filecoin Green team and third-party assessors to validate. To meet the requirements set forth in the EVP, Digital Infrastructure Providers provide information on location, water usage, energy consumption, and renewable energy purchases to Filecoin. Third-party assessors verifies the submitted information using utility bills, metering logs, and calibration records if available. Additionally, the third-party assessors attest to the validity of sealing, storing, cumulative energy use and renewable energy production and consumption data within estimated lower and upper bounds by minerID.',
  },
];

const auditOutputs = [
  { criteria: 'SP Name', input: '' },
  { criteria: 'MinerIDs', input: '' },
  { criteria: 'Location', input: '' },
  { criteria: 'Reporting Period Start', input: '' },
  { criteria: 'Reporting Period End', input: '' },
  { criteria: 'SP Actual Net Power Consumed (kWH)', input: '' },
  { criteria: 'SP Renewable Energy Consumption Total (kWH)', input: '' },
  { criteria: 'SP Average Data Storage Capacity Over Reporting Time Period (PiB)', input: '' },
  { criteria: 'Estimate Cumulative Network Energy Use for Reporting Time Period (PiB)', input: '' },
  { criteria: 'Network Average Renewable Energy Purchases (kWh)', input: '' },
  { criteria: 'SP Grid Ave Emissions Factor gCO2/kWh', input: '' },
  { criteria: 'Global Average Grid Emissions Factor from OurWorldInData (gCO2/kWh)', input: '' },
  { criteria: 'SP Marginal Emissions Factor gCO2/kWh', input: '' },
  { criteria: 'Global Average Marginal Emissions Factor (gCO2/kWh)', input: '' },
];

const newItemsWithTables = [
  {
    title: 'Location Information',
    headers: ['Location', 'MinerIDs', 'Hardware', 'Water Use', 'Energy Use'],
    description: 'Address reported on two third-party documents & all info matches',
    table: [['', '', '', '', '']],
    grayCells: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
    grayHeaders: [1, 2, 3, 4],
  },
  {
    title: 'MinerIDs Information',
    headers: ['Location', 'MinerIDs', 'Hardware', 'Water Use', 'Energy Use'],
    description: 'Auditor verifies no discrepancies',
    table: [['', '', '', '', '']],
    grayCells: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
    grayHeaders: [1, 2, 3, 4],
  },
  {
    title: 'Hardware Information',
    headers: ['Location', 'MinerIDs', 'Hardware', 'Water Use', 'Energy Use'],
    description: 'Photo / video evidence provided to further verify claims',
    table: [['', '', '', '', '']],
    grayCells: [
      [0, 2],
      [0, 3],
      [0, 4],
    ],
    grayHeaders: [2, 3, 4],
  },
  {
    title: 'Water Use Information',
    headers: ['Location', 'MinerIDs', 'Hardware', 'Water Use', 'Energy Use'],
    description: 'No water use info',
    table: [['', '', '', '', '']],
    grayCells: [
      [0, 3],
      [0, 4],
    ],
    grayHeaders: [3, 4],
  },
  {
    title: 'Energy Use Information',
    headers: ['Location', 'MinerIDs', 'Hardware', 'Water Use', 'Energy Use'],
    description: 'Address reported on two third-party documents & all info matches',
    table: [['', '', '', '', '']],
    grayCells: [],
    grayHeaders: [],
  },
];

const greenScoreResults = [
  { metric: 'Emission Score', value: '' },
  { metric: 'Location Score', value: '' },
  { metric: 'Confidence Score', value: '' },
  { metric: 'Green Score', value: '' },
];

export default function ReportPageSection() {
  return (
    <div className={styles.reportPageContainer}>
      <div className={styles.logoContainer}>
        <DarkLogoSVG height="2.0rem" />
        <div className={styles.buttonContainer}>
          <p className={styles.darkModeButton}>Dark Mode</p>
          <p className={styles.viewProfileButton}>View Profile</p>
        </div>
      </div>
      <div className={styles.reportContainer}>
        <div className={styles.textContainer}>
          <p className={styles.energyValidationText}>Energy Validation Process</p>
          <p className={styles.title}>Findings and Recommendations</p>
        </div>
        <div className={styles.alingmentContainer}>
          <div className={styles.labelContainer}>
            <label className={styles.label}>Report name:</label>
            <label className={styles.label}>Location:</label>
            <label className={styles.label}>Audit date:</label>
          </div>
          <div className={styles.squareContainer}>
            <Image src="/starReportRectangle.png" alt="Star Report" width={70} height={70} />
            <p className={styles.score}>Score:</p>
          </div>
        </div>
      </div>
      <div className={styles.listContainer}>
        {items.map((item, index) => (
          <div key={index} className={styles.item}>
            <p className={styles.itemTitle}>{item.title}</p>
            <p className={styles.itemText}>{item.text}</p>
          </div>
        ))}
      </div>
      <div className={styles.auditOutputSection}>
        <p className={styles.auditOutputTitle}>Audit Outputs</p>
        <table className={styles.auditOutputsTable}>
          <thead>
            <tr>
              <th className={styles.scoreCriteria}>Green Score Criteria</th>
              <th>Data Inputs</th>
            </tr>
          </thead>
          <tbody>
            {auditOutputs.map((output, index) => (
              <tr key={index}>
                <td className={styles.scoreCriteria}>{output.criteria}</td>
                <td>{output.input}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.confidenceScoringContainer}>
        <p className={styles.confidenceScoringTitle}>Confidence Scoring Matrix</p>
        <p className={styles.confidenceScoringDescription}>This is how your overall score is graded lorem ipsum</p>
        <table className={styles.confidenceScoringTable}>
          <thead>
            <tr>
              <th>Location</th>
              <th>MinerIDs</th>
              <th>Hardware</th>
              <th>Water Use</th>
              <th>Energy Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Score</td>
              <td>Score</td>
              <td>Score</td>
              <td>Score</td>
              <td>Score</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.newItemsContainer}>
        {newItemsWithTables.map((item, index) => (
          <div key={index} className={styles.newItem}>
            <div className={styles.newItemContent}>
              <p className={styles.newItemTitle}>{item.title}</p>
              <p className={styles.newItemDescription}>{item.description}</p>
            </div>
            <table className={styles.newItemTable}>
              <thead>
                <tr>
                  {item.headers.map((header, headerIndex) => (
                    <th key={headerIndex} className={item.grayHeaders.includes(headerIndex) ? styles.grayHeader : styles.blackHeader}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.table.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={item.grayCells.some(([r, c]) => r === rowIndex && c === cellIndex) ? styles.grayCell : styles.whiteCell}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className={styles.greenScoreResultsContainer}>
        <div className={styles.greenResultsItem}>
          <div>
            <p className={styles.greenScoreResultsTitle}>Green Score Results</p>
            <p className={styles.greenItemDescription}>Donec eleifend lorem vitae sem elementum, vitae sagittis ligula hendrerit.</p>
          </div>
          <table className={styles.greenScoreResultsTable}>
            <tbody>
              {greenScoreResults.map((result, index) => (
                <tr key={index}>
                  <td className={styles.metricCell}>{result.metric}</td>
                  <td>{result.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.greenScoreTieringContainer}>
        <div className={styles.greenItemContent}>
          <p className={styles.greenScoreTieringTitle}>Green Score Tiering</p>
          <p className={styles.greenItemDescription}>Donec eleifend lorem vitae sem elementum, vitae sagittis ligula hendrerit.</p>
        </div>
        <div className={styles.tierRectanglesContainer}>
          <div className={styles.bigSquareContainer}>
            <Image src="/starReportRectangle.png" alt="Star Report" width={90} height={90} />
            <div className={styles.tierContent}>
              <p className={styles.tier}>Bronze</p>
              <p className={styles.tierScore}>Score:</p>
            </div>
          </div>
          <div className={styles.bigSquareContainer}>
            <Image src="/sharpStarReport.png" alt="Sharp Star Report" width={90} height={90} />
            <div className={styles.tierContent}>
              <p className={styles.tier}>Gold</p>
              <p className={styles.tierScore}>Score:</p>
            </div>
          </div>
          <div className={styles.bigSquareContainer}>
            <Image src="/flowerReportRectangle.png" alt="Flower Report" width={90} height={90} />
            <div className={styles.tierContent}>
              <p className={styles.tier}>Silver</p>
              <p className={styles.tierScore}>Score:</p>
            </div>
          </div>
          <div className={styles.bigSquareContainer}>
            <Image src="/circleStarReport.png" alt="Circle Star Report" width={90} height={90} />
            <div className={styles.tierContent}>
              <p className={styles.tier}>Platinum</p>
              <p className={styles.tierScore}>Score:</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
