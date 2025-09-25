'use client';

import styles from '@components/ImageWithCards.module.scss';

import { classNames } from '@root/common/utilities';
import { useState } from 'react';
import { LargeHeading } from './typography';

export default function ImageWithCards({ id, title, image, textCards, imagePosition = 'left' }: any) {
  const [currentImage, setCurrentImage] = useState(image);
  const [nextImage, setNextImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMouseEnter = (newImage) => {
    if (currentImage !== newImage && !loading) {
      setLoading(true);
      setNextImage(newImage);
    }
  };

  const handleAnimationEnd = () => {
    setCurrentImage(nextImage);
    setNextImage('');
    setLoading(false);
  };

  return (
    <div>
      {title && <LargeHeading style={{ textAlign: 'center', paddingBottom: '3rem', color: 'var(--color-white)' }}>{title}</LargeHeading>}

      <div className={styles.container} id={id ?? ''}>
        <div className={classNames(styles.imageContainer, imagePosition === 'left' ? styles.imageLeft : styles.imageRight)}>
          {currentImage && <img src={currentImage} alt="" className={classNames(styles.image, { [styles.fadeOut]: loading })} onAnimationEnd={handleAnimationEnd} />}
          {nextImage && <img src={nextImage} alt="" className={classNames(styles.image, styles.fadeIn, { [styles.hidden]: !loading })} />}
        </div>

        <div className={classNames(styles.textContainer, imagePosition === 'left' ? styles.textContainerLeft : styles.textContainerRight)}>
          {textCards.map((item, index) => {
            const associatedImage = item?.image ?? '/media/hills.png';
            return (
              <div
                key={index}
                className={classNames(styles.textBox, imagePosition === 'left' ? styles.textBoxLeft : styles.textBoxRight)}
                onMouseEnter={() => handleMouseEnter(associatedImage)}
              >
                <h6 className={styles.title}>{item?.title}</h6>
                <p className={styles.description}>{item?.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
