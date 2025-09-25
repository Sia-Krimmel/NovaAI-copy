import styles from './DashboardTopNavbar.module.scss';

import Link from 'next/link';
import ProfilePictureSVG from './svgs/ProfilePictureSVG';
import ThemeToggle from './ThemeToggle';
import PageGutterWrapper from './PageGutterWrapper';

export default function DashboardTopNavbar({ onHandleThemeChange, dashboardNavigation, logoPath = '' }) {
  const constructHref = (baseHref) => {
    return `/${baseHref}`;
  };

  const profileLink = dashboardNavigation?.profileLink ? constructHref(dashboardNavigation?.profileLink) : '/profile';

  return (
    <div style={{ borderBottom: ' 1px solid var(--theme-color-border)' }}>
      <PageGutterWrapper>
        <div className={styles.navbar}>
          {logoPath ? (
            <div className={styles.navbarLogo}>
              <img src={logoPath} alt="Dashboard Logo" />
            </div>
          ) : null}
          {dashboardNavigation?.links && (
            <div className={styles.navbarLinks}>
              {dashboardNavigation.links.map((link, index) => {
                const href = constructHref(link.href);

                return (
                  <Link key={index} href={href}>
                    {link.text}
                  </Link>
                );
              })}
            </div>
          )}
          <div className={styles.navbarProfile}>
            <div className={styles.modeSwitch}>
              <ThemeToggle onHandleThemeChange={onHandleThemeChange} />
            </div>
            <div>
              <a href={profileLink}>View Profile</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <a href={profileLink}>
                <ProfilePictureSVG />
              </a>
            </div>
          </div>
        </div>
      </PageGutterWrapper>
    </div>
  );
}
