import styles from '@components/GreenScoreCard.module.scss';

import GreenScoreSVG from './svgs/GreenScoreSVG';
import Button, { ButtonStyleEnum } from './Button';
import { P } from './typography';
import Link from './Link';

interface GreenScoreCard {
  withBorder?: boolean;
  withButton?: boolean;
  greenscore?: number;
  greenscoreDate?: string;
  greenScoreReportLink?: string | null;
}

function getLetterGrade(greenscore) {
  if (isNaN(greenscore) || greenscore < 0 || greenscore > 100) {
    return '?';
  }

  switch (true) {
    case greenscore >= 85:
      return 'A';
    case greenscore >= 75:
      return 'B';
    case greenscore >= 65:
      return 'C';
    default:
      return 'C-';
  }
}

export default function GreenScoreCard({ withBorder, greenscore, greenscoreDate, withButton, greenScoreReportLink }: GreenScoreCard) {
  return (
    <div className={styles.container} style={{ border: withBorder ? ' 1px solid var(--theme-color-border)' : 'none', padding: withBorder ? '16px' : '0px' }}>
      <div className={styles.scoreImageContainer}>
        {/* <GreenScoreSVG color="var(--theme-color-accent)" /> */}
        <h6 className={styles.scoreLetter}>{greenscore && !isNaN(greenscore) ? getLetterGrade(greenscore) : '?'}</h6>
      </div>
      <div>
        {greenscoreDate && <P className={styles.scoreDate}>{greenscoreDate}</P>}
        <P className={styles.scorePercent}>Score {greenscore && !isNaN(greenscore) ? greenscore : '?'}/100</P>

        {withButton && greenScoreReportLink && (
          <Link href={greenScoreReportLink} linkStyle="animated-lime-green">
            <P className={styles.reportLink}>View Report</P>
          </Link>
        )}
      </div>
    </div>
  );
}
