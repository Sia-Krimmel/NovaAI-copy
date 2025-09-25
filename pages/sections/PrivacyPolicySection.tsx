import styles from '@components/PrivacyPolicy.module.scss';
import { P } from '@root/components/typography';

export default function PrivacyPolicySection() {
  return (
    <div className={styles.container}>
      <a href="/" style={{ textDecoration: 'none', border: 'none' }}>
        <p className={styles.homeCta}>&lt; Back</p>
      </a>
      <div className={styles.headingContainer}>
        <h2 className={styles.heading}>Privacy Policy</h2>
      </div>

      <P style={{ color: 'var(--color-black)' }}>
        Nova Energy is dedicated to protecting your privacy and safeguarding your data. Our privacy policy outlines how we collect, use, and store your information during the EVP
        process. We ensure that all data is handled with the utmost confidentiality and security, adhering to the highest standards of data protection. We commit to transparent
        practices, only using your data to enhance our services and provide you with the best experience. Your trust is our top priority, and we are dedicated to maintaining the
        integrity and privacy of your information at all times.
      </P>
    </div>
  );
}
