import styles from '@components/GreenscoreResult.module.scss';
import * as Utilities from 'common/utilities';
import { H6, P } from './typography';

export default function GreenscoreResult({ date, locationScore, confidenceScore, emissionsScore, greenScore }) {
  return (
    <div style={{ paddingBottom: '24px' }}>
      <div className={styles.calculationHeader} style={{ paddingBottom: '24px' }}>
        {date && <P>Submission Date: {date}</P>}
      </div>

      <div style={{ paddingBottom: '24px' }}>
        <div className={styles.tableHeader} style={{ display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', width: '100%', background: 'var(--theme-color-accent)' }}>
          <p className={styles.headerTitle} style={{ color: 'var(--color-white)' }}>
            Green Score Results
          </p>
        </div>
        <div className={styles.gridContainer2Cols}>
          <div className={styles.row}>
            <p className={Utilities.classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Emissions Score</p>
            <p className={Utilities.classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>
              {emissionsScore && !isNaN(emissionsScore) ? emissionsScore : '-'}
            </p>
          </div>

          <div className={styles.row}>
            <p className={Utilities.classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Location Score</p>
            <p className={Utilities.classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{locationScore && !isNaN(locationScore) ? locationScore : '-'}</p>
          </div>
          <div className={styles.row}>
            <p className={Utilities.classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Confidence Score</p>
            <p className={Utilities.classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>
              {confidenceScore && !isNaN(confidenceScore) ? confidenceScore : '-'}
            </p>
          </div>
          <div className={styles.row}>
            <p className={Utilities.classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Green Score</p>
            <p className={Utilities.classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>{greenScore && !isNaN(greenScore) ? greenScore : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
