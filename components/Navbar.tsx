import styles from './Navbar.module.scss';

import React from 'react';
import Link from './Link';
import PageGutterWrapper from './PageGutterWrapper';

export default function Navbar({ navigation }) {
  return (
    <div className={styles.navbarContainer}>
      <PageGutterWrapper>
        <nav className={styles.navbar}>
          {navigation?.brandName && (
            <Link href="/">
              <span className={styles.brandLogo}>
                <span className={styles.brandName}>{navigation?.brandName ?? 'nova'}</span>
              </span>
            </Link>
          )}

          {navigation?.links && (
            <div className={styles.navLinks}>
              {navigation.links.map((link, index) => {
                return (
                  <Link key={index} href={link.href} linkStyle="animated-green">
                    {link.text}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </PageGutterWrapper>
    </div>
  );
}
