import styles from './Footer.module.scss';

import React from 'react';
import Link from './Link';
import PageGutterWrapper from './PageGutterWrapper';

export default function FooterNoFade() {
  return (
    // fix rename navbar to footer
    <div className={styles.footerSection}>
      <PageGutterWrapper>
        <nav className={styles.navbarOne}>
          <Link href="/">
            <span className={styles.brandLogo}>
              <span className={styles.brandName}>nova</span>
            </span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="mailto:support@novaenergy.ai" linkStyle="animated-green">
              support@novaenergy.ai
            </Link>
            {/* fix */}
            {/* <div>
            Phone: 555-567-8901
          </div> */}
          </div>
        </nav>
        <div className={styles.navbar}>
          <div className={styles.navLinks}>© 2024 Nova. All Rights Reserved.</div>
          <Link href="/privacy-policy" linkStyle="grey">
            <div className={styles.navLinks}>Privacy Policy</div>
          </Link>
        </div>
      </PageGutterWrapper>
    </div>
  );
}
