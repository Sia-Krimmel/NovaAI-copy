import styles from '@components/ProfileCreationSection.module.scss';

import Button, { ButtonStyleEnum } from '@root/components/Button';
import Link from '@root/components/Link';
import EyeSVG from '@root/components/svgs/EyeSVG';
import FilledGridSVG from '@root/components/svgs/FilledGridSVG';
import NovaEnergyGreenSVG from '@root/components/svgs/NovaEnergyGreenSVG';
import NovaLogoSVG from '@root/components/svgs/NovaLogoSVG';
import { P } from '@root/components/typography';

export default function ProfileCreationSection() {
  // TODO: implement dark modal
  return (
    <div className={styles.container}>
      <div className={styles.logoAndTextContainer}>
        <NovaLogoSVG color="var(--color-black)" height="2.5rem" />
        <P style={{ color: ' var(--color-grey200)' }}>Select your profile type</P>
      </div>
      <div className={styles.optionsContainer}>
        <div className={styles.option}>
          <div>
            <div className={styles.profileOption}>
              <FilledGridSVG className={styles.iconStyle} color="var(--color-black)" />
              <p className={styles.optionEmojiText}>Digital Infrastructure Provider</p>
            </div>
            <P className={styles.optionDescription}>If you are Web3 node operations, AI-driven platforms, and data centers, please select this option.</P>
          </div>
          <div style={{ color: 'var(--theme-color-accent)', paddingTop: '2rem' }}>
            <Button href="/app/provider-signup" style={ButtonStyleEnum.SQUARE_BLACK}>
              Create Profile
            </Button>
          </div>

          <div className={styles.login}>
            <a href="/app/provider" className={styles.link}>
              <P className={styles.text}> Have an account? Log in</P>
            </a>
          </div>
        </div>

        <div className={styles.option}>
          <div>
            <div className={styles.profileOption}>
              <EyeSVG className={styles.iconStyle} color="var(--color-black)" />
              <p className={styles.optionEmojiText}>Auditor</p>
            </div>
            <P className={styles.optionDescription}>If you are looking to audit, please select this option.</P>
          </div>
          <div style={{ color: 'var(--theme-color-accent)', paddingTop: '2rem' }}>
            <Button href="/app/auditor-signup" style={ButtonStyleEnum.SQUARE_BLACK}>
              Create Profile
            </Button>
          </div>

          <div className={styles.login}>
            <a href="/app/auditor" className={styles.link}>
              <P className={styles.text}> Have an account? Log in</P>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
