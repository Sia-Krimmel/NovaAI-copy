'use client';

import styles from '@components/InputWithSpotlight.module.scss';
import React, { useRef, useState } from 'react';

export default function InputWithSpotlight({ type, isForm, disabled, placeholder, onChange, value, color, background, height }: any) {
  const divRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div className={styles.inputContainer}>
      <input
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        autoComplete="off"
        placeholder={placeholder}
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        name={placeholder}
        disabled={disabled}
        style={{
          background: background ? background : '',
          backgroundColor: isForm ? 'var(--theme-primary-light-background)' : '',
          height: height ? height : 'var(--input-height-regular)',
          padding: 'var(--input-padding-regular)',
          color: color ? color : 'var(--color-text)',
        }}
      />
      <input
        ref={divRef}
        disabled={true}
        style={{
          border: '1px solid var(--color-lime-green)',
          opacity,
          background: background ? background : '',
          height: height ? height : 'var(--input-height-regular)',
          padding: 'var(--input-padding-regular)',
          WebkitMaskImage: `radial-gradient(30% 30px at ${position.x}px ${position.y}px, black 45%, transparent)`,
          color: color ? color : '',
        }}
        aria-hidden="true"
        className={styles.inputMask}
      />
    </div>
  );
}
