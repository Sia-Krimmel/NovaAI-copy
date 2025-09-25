import styles from '@components/NavigationTwo.module.scss';

import { P } from './typography';
import Link from './Link';
import WhiteLogoWithTextSVG from './svgs/WhiteLogoWithTextSVG';

export default function NavigationTwo({ links, cta }) {
  return (
    <div style={{ color: 'red' }}>
      <div className={styles.container}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <WhiteLogoWithTextSVG width="150px" />
        </a>

        <div className={styles.linksRow}>
          {links?.map((link, index) => {
            return (
              <Link key={index} href={link.href} linkStyle="animated-lime-green">
                <P className={styles.text}>{link.text}</P>
              </Link>
            );
          })}
        </div>

        {cta?.href && cta?.text && (
          <Link href={cta.href} className={styles.cta}>
            <span>{cta.text}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
