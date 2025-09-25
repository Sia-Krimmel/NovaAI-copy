import styles from '@components/FeaturedCard.module.scss';

import Button from './Button';
import Link from './Link';
import { ImageSizeEnum, ImageStyleEnum } from '@root/common/types';

export enum ImagePositionEnum {
  LEFT = 'left',
  CENTER = 'center',
}

export default function FeaturedCard({ button, description, footnote, heading, image }: any) {
  const getImageSizeClass = (size) => {
    switch (size) {
      case ImageSizeEnum.SMALL:
        return styles.imageSmall;
      case ImageSizeEnum.MEDIUM:
        return styles.imageMedium;
      case ImageSizeEnum.LARGE:
        return styles.imageLarge;
      default:
        return styles.imageMedium;
    }
  };

  const getImagePositionClass = (position) => {
    switch (position) {
      case ImagePositionEnum.LEFT:
        return styles.imageLeft;
      case ImagePositionEnum.CENTER:
        return styles.imageCenter;
      default:
        return styles.imageCenter;
    }
  };

  const getImageStyleClass = (style) => {
    switch (style) {
      case ImageStyleEnum.NO_BORDER:
        return styles.imageNoBorder;
      case ImageStyleEnum.WITH_BORDER:
        return styles.imageWithBorder;
      default:
        return styles.imageWithBorder;
    }
  };

  const getImageClassName = (size, style, position) => {
    return `${getImageSizeClass(size)} ${getImagePositionClass(position)} ${getImageStyleClass(style)}`;
  };

  return (
    <div className={styles.container}>
      {image?.src &&
        (button?.link ? (
          <Link target="_blank" href={button.href}>
            <img src={image.src} alt={image.alt} className={getImageClassName(image.size, image.style, image.position)} />
          </Link>
        ) : (
          <img src={image.src} alt={image.alt} className={getImageClassName(image.size, image.style, image.position)} />
        ))}

      <div className={styles.textContainer} style={{}}>
        {heading && <h6 className={styles.heading}>{heading}</h6>}
        {description && <p className={styles.p}>{description}</p>}
        {footnote && <p className={styles.footnote} dangerouslySetInnerHTML={{ __html: footnote }} />}
      </div>

      {button && (
        <div style={{ paddingTop: '1rem' }}>
          {' '}
          <Link target="_blank" href={button.href}>
            <Button withArrow={true} target={button?.target ?? '_blank'}>
              {button.text}
            </Button>
          </Link>{' '}
        </div>
      )}
    </div>
  );
}
