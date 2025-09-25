'use client';

import React from 'react';
import LottieAnimation from '../LottieAnimation';

export default function SuccessCheckAnimation() {
  React.useEffect(() => {
    import('@lottiefiles/lottie-player');
  });

  const AnimationCheck = 'https://lottie.host/d01bd9c4-2700-41a3-9973-a0f2a2302ab6/I1LquQRpuy.json';

  return <LottieAnimation animationData={AnimationCheck} />;
}
