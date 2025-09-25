import styles from '@components/PartnersTwo.module.scss';

import { classNames } from '@root/common/utilities';

function PartnersWithContainer({ logos }) {
  return (
    <div className={styles.partnersWithContainer}>
      {logos?.map((logo, index) => {
        return (
          <div key={index} className={styles.logoContainer}>
            <img src={logo.logo} alt={logo?.alt ?? 'image'} className={styles.logo} />
          </div>
        );
      })}
    </div>
  );
}

export default function PartnersTwo({ partnerLogos }) {
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
