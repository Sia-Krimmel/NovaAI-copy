'use client';

import React from 'react';
import LottieAnimation from '../LottieAnimation';

export default function LightningAnimation() {
  React.useEffect(() => {
    import('@lottiefiles/lottie-player');
  });

  const Animation = 'https://lottie.host/7d2214ac-94ff-426a-922d-071b6b2e3189/RHFq2u85Qd.json';

  return <LottieAnimation animationData={Animation} loop={true} />;
}
