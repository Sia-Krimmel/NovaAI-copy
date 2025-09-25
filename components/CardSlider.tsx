'use client';

import styles from '@components/CardSlider.module.scss';

import { classNames } from '@root/common/utilities';
import { H6, Label, P } from './typography';
import { useEffect, useRef, useState } from 'react';
import ArrowLeftSVG from './svgs/ArrowLeftSVG';
import ArrowRightSVG from './svgs/ArrowRightSVG';

export default function CardSlider({ title, cards, style }) {
  const cardsRowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [isScrollLeftActive, setIsScrollLeftActive] = useState(false);
  const [isScrollRightActive, setIsScrollRightActive] = useState(true);

  const scrollLeftButton = () => {
    if (cardsRowRef.current) {
      cardsRowRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRightButton = () => {
    if (cardsRowRef.current) {
      cardsRowRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Start dragging for a mouse event
  const startDragMouse = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
    setStartX(event.pageX);
    setScrollLeftPos(cardsRowRef.current ? cardsRowRef.current.scrollLeft : 0);
  };

  // Start dragging for a touch event
  const startDragTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(event.touches[0].pageX);
    setScrollLeftPos(cardsRowRef.current ? cardsRowRef.current.scrollLeft : 0);
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  // Update button states based on the current scroll position
  const updateButtonState = () => {
    const container = cardsRowRef.current;
    if (!container) return;

    const isAtStart = container.scrollLeft === 0;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth;

    setIsScrollLeftActive(!isAtStart);
    setIsScrollRightActive(!isAtEnd);
  };

  const handleDragMouse = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging || !cardsRowRef.current) return;
    const walk = (event.pageX - startX) * 2; // Multiply to adjust sensitivity
    cardsRowRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleDragTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !cardsRowRef.current) return;
    const walk = (event.touches[0].pageX - startX) * 2; // Multiply to adjust sensitivity
    cardsRowRef.current.scrollLeft = scrollLeftPos - walk;
  };

  useEffect(() => {
    const container = cardsRowRef.current;

    if (container) {
      container.addEventListener('scroll', updateButtonState);
      updateButtonState();

      return () => {
        container.removeEventListener('scroll', updateButtonState);
      };
    }
  }, []);

  return (
    <div className={styles.container} style={{ ...style }}>
      <div
        className={classNames(styles.cardsRow, { [styles.grabbing]: isDragging })}
        id="how-it-works"
        ref={cardsRowRef}
        onMouseDown={startDragMouse}
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
        onMouseMove={handleDragMouse}
        onTouchStart={startDragTouch}
        onTouchEnd={stopDrag}
        onTouchMove={handleDragTouch}
      >
        <div className={styles.mainCard}>
          <Label className={styles.label}>OUR EVP</Label>
          <H6 className={classNames(styles.mainCardTitle)} style={{ paddingTop: '1rem' }}>
            {title}
          </H6>
        </div>

        {cards?.map((card, index) => {
          return (
            <div key={index} className={styles.card}>
              {card?.image?.src && (
                <div className={styles.imageContainer}>
                  <div className={styles.overlay}></div>
                  <img className={styles.image} src={card.image.src} alt={card?.image?.alt || card.title} />
                </div>
              )}
              <div className={styles.cardText}>
                <P className={styles.number}>{index + 1}</P>
                <div className={styles.cardContent}>
                  <Label className={styles.title}>{card.title}</Label>
                  <P className={styles.description}>{card.description}</P>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.buttonsRow}>
        <button
          onClick={scrollLeftButton}
          className={styles.button}
          style={{
            borderRight: '1px solid var(--color-black)',
            backgroundColor: isScrollLeftActive ? 'var(--theme-color-accent)' : 'var(--color-black)',
          }}
        >
          <ArrowLeftSVG className={styles.arrow} stroke={isScrollLeftActive ? 'var(--color-black)' : 'var(--theme-color-accent)'} />
        </button>
        <button
          onClick={scrollRightButton}
          className={styles.button}
          style={{
            borderRight: '1px solid var(--color-black)',
            backgroundColor: isScrollRightActive ? 'var(--theme-color-accent)' : 'var(--color-black)',
          }}
        >
          <ArrowRightSVG className={styles.arrow} stroke={isScrollRightActive ? 'var(--color-black)' : 'var(--theme-color-accent)'} />
        </button>
      </div>
    </div>
  );
}
