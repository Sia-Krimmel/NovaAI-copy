import styles from './DashboardSideNavbar.module.scss';

import { classNames } from '@root/common/utilities';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import NovaLogoSVG from './svgs/NovaLogoSVG';

export default function DashboardSideNavbar({ provider, prefix, documentId, firstTitle, firstIcon, firstLink, secondTitle, menuNavigation, adminNavigation }: any) {
  const pathname = usePathname();

  const constructHref = (baseHref) => {
    const prefixItem = prefix ? `${prefix}/` : '';
    return `/${prefixItem}evp-process/${baseHref}/${documentId}`;
  };

  return (
    <div className={styles.sidenav}>
      <div className={styles.position}>
        <span className={styles.brandLogo} style={{ padding: '1rem 0rem', color: 'var(--color-grey)' }}>
          <Link href="/home">
            <NovaLogoSVG color="var(--color-text)" />{' '}
          </Link>
        </span>

        {(documentId || provider) && (
          <>
            {firstLink && firstTitle && firstIcon && (
              <Link href={firstLink} style={{ paddingTop: '2rem' }}>
                <span className={styles.firstLinkRow}>
                  {firstIcon && firstIcon}
                  <p style={{ padding: '0' }}>{firstTitle}</p>
                </span>
              </Link>
            )}

            {!firstLink && firstTitle && (
              <p className={styles.title} style={{ paddingLeft: '0.7rem' }}>
                {firstTitle}
              </p>
            )}

            <div style={{ paddingTop: !firstLink || !firstTitle ? '1rem' : '0rem' }}>
              {menuNavigation?.links?.map((link, index) => {
                const href = constructHref(link.href);

                return (
                  <a key={index} href={href}>
                    <span className={classNames(styles.menuItems, pathname === href ? styles.activeLink : '')}>
                      {link.icon}
                      <p className={classNames(pathname === href ? styles.activeLinkBg : '')}> {link.text}</p>
                    </span>
                  </a>
                );
              })}
            </div>
          </>
        )}

        {adminNavigation?.links && (
          <div className={styles.navLinks}>
            {adminNavigation.links.map((link, index) => {
              return (
                <Link key={index} href={link.href}>
                  <div className={styles.menuItems}>
                    {link.icon}
                    {link.text}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <p className={styles.title}>{secondTitle}</p>

        {menuNavigation?.secondaryLinks?.map((link, index) => {
          const href = constructHref(link.href);

          return (
            <a key={index} href={href}>
              <div className={classNames(styles.menuItems, pathname === href ? styles.activeLink : '')}>
                {link.icon}
                <p className={classNames(pathname === href ? styles.activeLinkBg : '')}> {link.text}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
