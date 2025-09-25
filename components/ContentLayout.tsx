import styles from './ContentLayout.module.scss';

import * as React from 'react';

export default function ContentLayout(props) {
  return <div className={styles.root}>{props.children}</div>;
}
