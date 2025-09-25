import React from 'react';
import styles from './Process.module.scss';
import Image from 'next/image';
import PageGutterWrapper from './PageGutterWrapper';

import ListSVG from './svgs/ListSVG';
import StarSVG from './svgs/StarSVG';
import SwordsSVG from './svgs/SwordsSVG';
import VerticalCardsWithLine from './VerticalCardsWithLine';
import { PROCESS_CONTENT } from '@root/content/homepage';
import { FadeInEffectWrapper } from './FadeInEffectWrapper';

export default function Process() {
  const cards = PROCESS_CONTENT;

  return (
    <div className={styles.heroSection}>
      <PageGutterWrapper>
        <FadeInEffectWrapper>
          <div></div>
          <h5 className={styles.h5} style={{ paddingBottom: '0.5rem' }} id="requirements">
            Energy Validation Requirements
          </h5>
          {/* <h6 className={styles.subText}></h6> */}

          <div className={styles.threeBoxes}>
            <div className={styles.subBox}>
              <ListSVG alt="list" width={33} height={33} className={styles.iconThree} />
              Reporting
              <div className={styles.subBoxText}>
                Node operators make sustainability claims by sharing information on location, water usage, energy consumption & renewable energy purchases to Filecoin.{' '}
              </div>
            </div>
            <div className={styles.subBox}>
              <StarSVG src="/star.png" alt="star" width={33} height={33} className={styles.iconThree} />
              Verification
              <div className={styles.subBoxText}>
                Third party validators verify this submitted information by using utility bills, metering logs, calibration records, & various other records to be verified.{' '}
              </div>
            </div>
            <div className={styles.subBox}>
              <SwordsSVG src="/Icon.png" alt="Icon" width={33} height={33} className={styles.iconThree} />
              Attestation
              <div className={styles.subBoxText}>
                Additionally, validators attest the validty of sealing, storing, and cumulative energy use data within the estimated lower and upper bounds by minerID.{' '}
              </div>
            </div>
          </div>
        </FadeInEffectWrapper>

        <FadeInEffectWrapper>
          <div className={styles.allInARow} id="process">
            <div className={styles.leftOfScreen}>
              <h5 className={styles.h5block} style={{ paddingBottom: '0.5rem' }}>
                Energy Validation Process
              </h5>
              <h6 className={styles.subTextTwo}>
                Designed to address the opacity and uncertainty surrounding environmental claims, our EVP is a robust framework that validates and quantifies the sustainability
                practices of digital operations.
              </h6>
              <Image src="/bigFlower.png" alt="Big Flower" width={192} height={192} className={styles.bigFlower} />
              <Image src="/smallFlower.png" alt="Small Flower" width={81} height={81} className={styles.smallFlower} />
              <Image src="/dot.png" alt="dot" width={27} height={27} className={styles.dot} />
            </div>
            {/* moved to vertical boxes */}
            <div className={styles.verticalCards}>
              <VerticalCardsWithLine cards={cards} />
            </div>
          </div>
        </FadeInEffectWrapper>
      </PageGutterWrapper>
    </div>
  );
}
