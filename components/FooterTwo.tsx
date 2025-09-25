import styles from '@components/FooterTwo.module.scss';

import { H3, P } from './typography';
import Link from './Link';
import PageGutterWrapper from './PageGutterWrapper';
import NovaEnergyLogo from './NovaEnergyLogo';

export default function FooterTwo(props) {
  return (
    <div className={styles.wrapper} {...props}>
      <PageGutterWrapper>
        <section className={styles.footerSectionOne}>
          <H3 className={styles.heading}>Charting paths to a cleaner digital future.</H3>
          <img src={'/media/star-icon.png'} className={styles.footerImage} />{' '}
        </section>
      </PageGutterWrapper>
      <section className={styles.footerSectionTwo}>
        <PageGutterWrapper>
          <div className={styles.container}>
            <NovaEnergyLogo color="var(--color-black)" />

            <div className={styles.linksRow}>
              <div className={styles.linksRow}>
                <Link href="https://twitter.com/NovaEnergyAI" target="_blank" linkStyle="animated-black">
                  <span style={{ color: 'var(--color-black)', fontSize: 16 }}>X</span>
                </Link>

                <Link href="https://www.linkedin.com/company/nova-energy-ai/" target="_blank" linkStyle="animated-black">
                  <span style={{ color: 'var(--color-black)', fontSize: 16 }}>LinkedIn</span>
                </Link>

                <Link href="mailto:support@novaenergy.ai" linkStyle="animated-black">
                  <span style={{ color: 'var(--color-black)', fontSize: 16 }}>support@nova.ai</span>
                </Link>

                <Link href="/privacy-policy" linkStyle="animated-black">
                  <span style={{ color: 'var(--color-black)', fontSize: 16 }}> Privacy Policy</span>
                </Link>
              </div>
              <P className={styles.copyright}>© 2024 Nova. All Rights Reserved.</P>
            </div>
          </div>
        </PageGutterWrapper>
      </section>
    </div>
  );
}
