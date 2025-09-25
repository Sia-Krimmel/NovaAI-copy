import React from 'react';
import ThreeGraticule from './ThreeGraticule';

const ThreeMesh = () => {
  return (
    <mesh>
      <sphereGeometry args={[1, 22]} />
      <meshPhongMaterial color="white" transparent={true} opacity={0.8} />

      <ThreeGraticule />
    </mesh>
  );
};

export default ThreeMesh;
