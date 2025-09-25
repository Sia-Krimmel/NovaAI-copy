import styles from '@components/layouts/ThinAppLayout.module.scss';

import * as React from 'react';

export default function ThinAppLayout(props) {
  return <div className={styles.root}>{props.children}</div>;
}
