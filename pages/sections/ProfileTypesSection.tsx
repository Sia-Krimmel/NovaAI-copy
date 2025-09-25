import styles from '@components/ProfileTypesSection.module.scss';

import NovaEnergyLogo from '@root/components/NovaEnergyLogo';
import GridSVG from '@root/components/svgs/GridSVG';
import Link from '@root/components/Link';
import NovaLogoSVG from '@root/components/svgs/NovaLogoSVG';

export default function ProfileTypesSection() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <NovaLogoSVG color="var(--color-black)" height="2.5rem" />
      </div>

      <p style={{ paddingBottom: '16px', color: 'var(--theme-label-dark-text)' }}>Select your profile type</p>
      <section className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <GridSVG color="var(--color-white)" /> <p>Digital Infrastructure Provider</p>
        </div>
        <p className={styles.profileDescription}>I am a Digital Infrastructure Provider and would like to be audited for Energy Validation Process.</p>
        <Link href="/app">
          <span style={{ color: 'var(--color-lime-green)', fontSize: '16px', borderBottom: '1px solid var(--color-lime-green)' }}>Create Profile</span>
        </Link>
      </section>
    </div>
  );
}
