import styles from '@components/Partners.module.scss';
import { classNames } from '@root/common/utilities';

export default function Partners({ partnerLogos }) {
  return (
    <div className={classNames(styles.marqueeContainer)}>
      <div className={styles.rectangle} />

      <div className={classNames(styles.marquee, styles.marquee1)}>
        <div className={styles.marqueeContent}>
          {partnerLogos.map((item, index) => {
            return <img src={item.logo} key={index} className={styles.logo} alt={item.alt} />;
          })}
        </div>
      </div>
      <div className={classNames(styles.marquee, styles.marquee2)}>
        <div className={styles.marqueeContent}>
          {partnerLogos.map((item, index) => {
            return <img src={item.logo} key={index} className={styles.logo} alt={item.alt} />;
          })}
        </div>
      </div>
      <div className={styles.rectangleRight} />
    </div>
  );
}
