import styles from '@components/FormMessageWithIcon.module.scss';

import { P } from './typography';

export default function FormMessageWithIcon({ message, children, icon }) {
  return (
    <div className={styles.container}>
      {icon}
      <div style={{ paddingBottom: '32px' }}>{message && <P className={styles.message}>{message}</P>}</div>
      {children}
    </div>
  );
}
