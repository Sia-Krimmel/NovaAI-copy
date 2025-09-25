import styles from '@components/ProgressCircle.module.scss';

import LoadingAnimation from './animations/LoadingAnimation';
import { classNames } from '@root/common/utilities';
import { ReviewStatusEnum } from '@root/common/types';

export default function ProgressCircle({ number, status, loading }) {
  if (loading) {
    return (
      <div className={styles.spinner}>
        <LoadingAnimation />
      </div>
    );
  }

  const isCompleted = status == ReviewStatusEnum.IN_REVIEW || status == ReviewStatusEnum.APPROVED;

  return (
    <div className={classNames(styles.circle, isCompleted ? styles.completed : styles.notCompleted)}>
      <p className={styles.number}>{number}</p>
    </div>
  );
}
