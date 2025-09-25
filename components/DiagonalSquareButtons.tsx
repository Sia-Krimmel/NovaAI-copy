'use client';
import styles from '@components/DiagonalSquareButtons.module.scss';

import PostgresSVG from './svgs/PostgresSVG';
import EyeDiagonalSVG from './svgs/EyeDiagonalSVG';
import IPFSDiagonalSVG from './svgs/IPFSDiagonalSVG';
import CeramicSVG from './svgs/CeramicSVG';
import InfinitySVG from './svgs/InfinitySVG';
import SquareWithCircleSVG from './svgs/SquareWithCircleSVG';
import NextJSSVG from './svgs/NextJsSVG';
import { useEffect, useRef, useState } from 'react';
import TrianglesSVG from '@root/pages/sections/TrianglesSVG';
import LibP2PSVG from './svgs/LibP2PSVG';
import { P } from './typography';
import { classNames } from '@root/common/utilities';

export default function DiagonalSquareButtons() {
  const [activeStates, setActiveStates] = useState(Array(9).fill(false));
  const [currentIndex, setCurrentIndex] = useState(null);
  const currentIndexRef = useRef<number | any>(null);
  const timeoutRef = useRef<number | any>(null);

  const activateNextButton = () => {
    if (currentIndexRef.current !== null) {
      // Unclick the current button
      setActiveStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[currentIndexRef.current] = false;
        return newStates;
      });

      // Wait for 2 seconds before clicking the next button
      setTimeout(() => {
        // Choose the next button to click
        const nextIndex = Math.floor(Math.random() * 9);
        currentIndexRef.current = nextIndex;

        // Click the next button
        setActiveStates((prevStates) => {
          const newStates = [...prevStates];
          newStates[nextIndex] = true;
          return newStates;
        });

        // Schedule the next activation cycle
        timeoutRef.current = setTimeout(activateNextButton, 1000);
      }, 2000); // 2-second delay before clicking the next button
    } else {
      // Initial activation
      const nextIndex = Math.floor(Math.random() * 9);
      currentIndexRef.current = nextIndex;

      setActiveStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[nextIndex] = true;
        return newStates;
      });

      timeoutRef.current = setTimeout(activateNextButton, 1500);
    }
  };

  useEffect(() => {
    activateNextButton();

    // Cleanup function to clear timeouts when the component unmounts
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleClick = (index) => {
    setActiveStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.rotatedSquare}>
        <div className={styles.buttonWithText}>
          <P className={classNames(styles.text, styles.textTop, { [styles.textActive]: activeStates[0] })}>ETHEREUM ATTESTATION SERVICE</P>

          <button className={styles.diagonalButton} onClick={() => handleClick(0)}>
            <span className={`${styles.front} ${activeStates[0] ? styles.active : ''}`}>
              <TrianglesSVG className={styles.icon} />
            </span>
          </button>
        </div>

        <div className={styles.buttonWithText}>
          <P className={classNames(styles.text, styles.textDiagonalRight, { [styles.textActive]: activeStates[1] })} style={{ paddingLeft: '2rem' }}>
            Data <br />
            Interoperabilityy
          </P>

          <button className={styles.diagonalButton} onClick={() => handleClick(1)}>
            <span className={`${styles.front} ${activeStates[1] ? styles.active : ''}`}>
              <InfinitySVG className={styles.icon} />
            </span>
          </button>
        </div>
        <div className={styles.buttonWithText}>
          <P className={classNames(styles.text, styles.textDiagonalRight, { [styles.textActive]: activeStates[2] })}>PostgreSQL</P>

          <button className={styles.diagonalButton} onClick={() => handleClick(2)}>
            <span className={`${styles.front} ${activeStates[2] ? styles.active : ''}`}>
              <PostgresSVG className={styles.icon} />
            </span>
          </button>
        </div>
        <div className={styles.buttonWithText}>
          <P className={classNames(styles.text, styles.textDiagonalLeft, { [styles.textActive]: activeStates[3] })}>NextJS</P>

          <button className={styles.diagonalButton} onClick={() => handleClick(3)}>
            <span className={`${styles.front} ${activeStates[3] ? styles.active : ''}`}>
              <NextJSSVG className={styles.icon} />
            </span>
          </button>
        </div>
        <div className={styles.buttonWithText}>
          <P className={classNames(styles.text, styles.textDiagonalOuterBottom, { [styles.textActive]: activeStates[4] })}>IPFS</P>
          <button className={styles.diagonalButton} onClick={() => handleClick(4)}>
            <span className={`${styles.front} ${activeStates[4] ? styles.active : ''}`}>
              <IPFSDiagonalSVG className={styles.icon} />
            </span>
          </button>
        </div>

        <div className={styles.buttonWithText}>
          <P className={classNames(styles.text, styles.textDiagonalBottomRight, { [styles.textActive]: activeStates[5] })}>
            Verifiable <br /> Credentials
          </P>

          <button className={styles.diagonalButton} onClick={() => handleClick(5)}>
            <span className={`${styles.front} ${activeStates[5] ? styles.active : ''}`}>
              <EyeDiagonalSVG className={styles.icon} />
            </span>
          </button>
        </div>

        <div className={styles.buttonWithText}>
          <P className={classNames(styles.text, styles.textDiagonalLeft, { [styles.textActive]: activeStates[6] })}>Ceramic</P>

          <button className={styles.diagonalButton} onClick={() => handleClick(6)}>
            <span className={`${styles.front} ${activeStates[6] ? styles.active : ''}`}>
              <CeramicSVG className={styles.icon} />
            </span>
          </button>
        </div>

        <div className={styles.buttonWithText}>
          <P className={classNames(styles.text, styles.textDiagonalBottom, { [styles.textActive]: activeStates[7] })}>Compose DB</P>

          <button className={styles.diagonalButton} onClick={() => handleClick(7)}>
            <span className={`${styles.front} ${activeStates[7] ? styles.active : ''}`}>
              <SquareWithCircleSVG className={styles.icon} />
            </span>
          </button>
        </div>

        <div className={styles.buttonWithText}>
          <P className={classNames(styles.text, styles.textDiagonalOuterBottom, { [styles.textActive]: activeStates[8] })}>LibP2P</P>

          <button className={styles.diagonalButton} onClick={() => handleClick(8)}>
            <span className={`${styles.front} ${activeStates[8] ? styles.active : ''}`}>
              <LibP2PSVG className={styles.icon} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
