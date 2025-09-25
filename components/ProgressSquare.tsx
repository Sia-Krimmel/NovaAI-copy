import styles from '@components/ProgressSquare.module.scss';

import { classNames } from '@root/common/utilities';
import { ReviewStatusEnum } from '@root/common/types';
import LoadingAnimation from './animations/LoadingAnimation';

export default function ProgressSquare({ number, status, loading }) {
  if (loading) {
    return (
      <div className={styles.spinner}>
        <LoadingAnimation />
      </div>
    );
  }

  const isCompleted = status == ReviewStatusEnum.IN_REVIEW || status == ReviewStatusEnum.APPROVED;

  return (
    <div className={classNames(styles.square, isCompleted ? styles.completed : styles.notCompleted)}>
      <p className={styles.number}>{number}</p>
    </div>
  );
}
