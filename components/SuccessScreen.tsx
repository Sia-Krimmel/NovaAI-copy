'use client';

import styles from '@components/SuccessScreen.module.scss';

import React from 'react';
import LottieAnimation from './LottieAnimation';
import { P } from './typography';

export default function SuccessScreen({ message, showBorder }: any) {
  React.useEffect(() => {
    import('@lottiefiles/lottie-player');
  });

  const AnimationCheck = 'https://lottie.host/a8dcc3f8-fef5-4c73-a89b-fffe55ceb636/EZedbummvI.json';

  return (
    <div className={styles.successScreen} style={{ paddingTop: showBorder ? '3rem' : '0', paddingBottom: showBorder ? '3rem' : '0' }}>
      <div className={styles.content} style={{ border: showBorder ? '1px solid var(--theme-color-border)' : '', borderRadius: showBorder ? 'var(--border-radius-small)' : '' }}>
        <LottieAnimation animationData={AnimationCheck} />
        {message && <P className={styles.message}>{message}</P>}
      </div>
    </div>
  );
}
