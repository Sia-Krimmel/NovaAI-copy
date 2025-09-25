import styles from './ReportLayout.module.scss';

import * as React from 'react';

export default function ReportLayout(props) {
  return <div className={styles.root}>{props.children}</div>;
}
