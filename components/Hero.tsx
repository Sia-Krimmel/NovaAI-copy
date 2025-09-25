'use client';

import styles from './Hero.module.scss';

import { classNames } from '@root/common/utilities';
import { PARTNER_LOGOS_CONTENT } from '@root/content/homepage';
import BigStarSVG from './svgs/BigStarSVG';
import Button, { ButtonStyleEnum } from './Button';
import Partners from './Partners';
import React from 'react';
import SmallStarSVG from './svgs/SmallStarSVG';
import ArrowHeroSVG from './svgs/ArrowHeroSVG';
import StarsSVG from './svgs/StarsSVG';
import PageGutterWrapper from './PageGutterWrapper';

export default function Hero() {
  const partnerLogos = PARTNER_LOGOS_CONTENT;

  return (
    <div className={styles.heroContainer}>
      <PageGutterWrapper>
        <div className={styles.heroSection}>
          <div className={styles.mainHeroTitle}>
            <span className={styles.title}>
              CHARTING PATHS
              <ArrowHeroSVG className={styles.arrowIcon} />
            </span>
            <span className={styles.title}>
              TO A <StarsSVG className={styles.starsIcon} /> CLEANER
            </span>
            <span className={styles.title}> DIGITAL FUTURE.</span>
            <div className={styles.starIconSVGs}>
              <BigStarSVG className={styles.bigStarIcon} />
              <SmallStarSVG className={styles.smallStarIcon} />
            </div>
          </div>
          <span className={styles.nonBold}>
            Nova Energy was incubated by the Filecoin Green team as an independent project that addresses the opacity and uncertainty surrounding environmental claims. Explore our
            Energy Validation Process (EVP) & join our quest for a greener, more sustainable digital landscape.
          </span>

          <div className={styles.content}>
            <div className={styles.bottomContent}>
              <a href="#process" className={styles.buttonLink}>
                <Button style={ButtonStyleEnum.BLACK} withArrow={true} styles={{ zIndex: 'var(--z-index-large)', color: 'var(--color-lime-green)' }}>
                  Read the EVP
                </Button>
              </a>

              <Partners partnerLogos={partnerLogos} />
            </div>
          </div>
        </div>
      </PageGutterWrapper>
    </div>
  );
}
