'use client';

import styles from '@components/VerticalCardsWithLine.module.scss';

import React, { useRef, useEffect, useState } from 'react';
import { classNames } from '@root/common/utilities';

export default function VerticalCardsWithLine({ cards }) {
  const firstCardRef = useRef<HTMLLIElement>(null);
  const lastCardRef = useRef<HTMLLIElement>(null);

  const hideFirstBorderRef = useRef<HTMLDivElement>(null);
  const hideBottomBorderRef = useRef<HTMLDivElement>(null);

  const updateBorderHeight = () => {
    if (lastCardRef.current) {
      const lastCardHeight = lastCardRef.current.offsetHeight;
      const hideBottomBorderHeight = lastCardHeight / 2;
      if (hideBottomBorderRef.current) {
        hideBottomBorderRef.current.style.height = `${hideBottomBorderHeight}px`;
        hideBottomBorderRef.current.style.marginTop = `-${hideBottomBorderHeight}px`;
      }
    }

    if (firstCardRef.current) {
      const firstCardHeight = firstCardRef.current.offsetHeight;
      const hideFirstBorderHeight = firstCardHeight / 2;
      if (hideFirstBorderRef.current) {
        hideFirstBorderRef.current.style.height = `${hideFirstBorderHeight}px`;
      }
    }
  };

  useEffect(() => {
    updateBorderHeight();
    const resizeObserver = new ResizeObserver(() => {
      updateBorderHeight();
    });

    if (lastCardRef.current) {
      resizeObserver.observe(lastCardRef.current);
    }

    if (firstCardRef.current) {
      resizeObserver.observe(firstCardRef.current);
    }

    return () => {
      if (lastCardRef.current) {
        resizeObserver.unobserve(lastCardRef.current);
      }
      if (firstCardRef.current) {
        resizeObserver.unobserve(firstCardRef.current);
      }
    };
  }, [cards]);

  return (
    <div className={styles.container}>
      <div ref={hideFirstBorderRef} className={styles.hideTopBorder} />
      <ul className={styles.boxItems}>
        {cards.map((item, index) => {
          const isFirstCard = index === 0;
          const isLastCard = index === cards.length - 1;

          return (
            <li key={index} className={styles.boxItem} ref={isFirstCard ? firstCardRef : isLastCard ? lastCardRef : null}>
              <div className={styles.box} style={{ marginBottom: '0.5rem' }}>
                <span className={styles.iconThree}>{item.icon}</span>
                <div className={styles.subVerticalBoxTitle}>
                  <p className={styles.subVerticalBoxNumber}>{item.number}</p>
                  <p>{item.title}</p>
                </div>
                <p className={styles.subVerticalBoxText}>{item.description}</p>
              </div>
              <div className={classNames(styles.circle, { [styles.even]: index % 2 === 0 })} />
            </li>
          );
        })}
      </ul>

      <div ref={hideBottomBorderRef} className={styles.hideBottomBorder} />
    </div>
  );
}
