import styles from './Footer.module.scss';

import React from 'react';
import Link from './Link';
import PageGutterWrapper from './PageGutterWrapper';
import FeaturedCards from './FeaturedCards';

export default function Footer({ spacingBreakpoints, cards }) {
  return (
    <footer className={styles.footerSection}>
      <img src="/pixels.png" className={styles.pixelsBackground} />
      <PageGutterWrapper>
        <div style={{ paddingBottom: '1.5rem', paddingTop: ' 1.5rem' }}>{cards && <FeaturedCards spacingBreakpoints={spacingBreakpoints} cards={cards} />} </div>
        <div className={styles.navbarOne}>
          <Link href="/">
            <span className={styles.brandLogo}>
              <span className={styles.brandName}>nova</span>
            </span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="mailto:support@novaenergy.ai" linkStyle="animated-green">
              support@novaenergy.ai
            </Link>
          </div>
        </div>
        <div className={styles.navbar}>
          <div className={styles.navLinks}>© 2024 Nova. All Rights Reserved.</div>
          <Link href="/privacy-policy" linkStyle="grey">
            <div className={styles.navLinks}>Privacy Policy</div>
          </Link>
        </div>
      </PageGutterWrapper>
    </footer>
  );
}
