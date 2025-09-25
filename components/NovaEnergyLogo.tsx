import styles from '@components/NovaEnergyLogo.module.scss';
import NovaLogoSVG from './svgs/NovaLogoSVG';

export default function NovaEnergyLogo(props) {
  return (
    <span className={styles.brandLogo}>
      <span className={styles.brandName} style={{ color: props.color ?? 'var(--color-black)' }}>
        <NovaLogoSVG color={props.color} />
      </span>
    </span>
  );
}
