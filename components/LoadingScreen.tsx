import styles from '@components/LoadingScreen.module.scss';

import { P } from './typography';
import LightningAnimation from '@root/components/animations/LightningAnimation';

export default function LoadingScreen({ message }) {
  return (
    <div className={styles.container}>
      <LightningAnimation />
      {message && <P className={styles.message}>{message}</P>}
    </div>
  );
}
