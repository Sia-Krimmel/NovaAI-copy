import styles from '@components/FeaturedCards.module.scss';

import FeaturedCard from './FeaturedCard';
import { SpacingBreakpointsEnum } from '@root/common/types';

export default function FeaturedCards({ id, cards, description, title, spacingBreakpoints = SpacingBreakpointsEnum.DESKTOP_REGULAR_MOBILE_REGULAR }: any) {
  const getSpacingBreakpointsClassName = (spacingBreakpoints) => {
    switch (spacingBreakpoints) {
      case SpacingBreakpointsEnum.DESKTOP_REGULAR_MOBILE_TINY:
        return styles.spacingDesktopRegularMobileTiny;
      case SpacingBreakpointsEnum.DESKTOP_REGULAR_MOBILE_SMALL:
        return styles.spacingDesktopRegularMobileSmall;
      case SpacingBreakpointsEnum.DESKTOP_REGULAR_MOBILE_REGULAR:
      default:
        return styles.spacingDesktopRegularMobileRegular;
    }
  };

  return (
    <div className={styles.container} id={id}>
      <div style={{ paddingBottom: '1rem' }}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <section className={`${styles.grid} ${getSpacingBreakpointsClassName(spacingBreakpoints)}`}>
        {cards?.map((card, index) => {
          return <FeaturedCard key={index} {...card} />;
        })}
      </section>
    </div>
  );
}
