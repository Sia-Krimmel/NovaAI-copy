import styles from './GreenscoreReportLayout.module.scss';

import * as React from 'react';

export default function GreenscoreReportLayout(props) {
  return <div className={styles.root}>{props.children}</div>;
}
