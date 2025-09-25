'use client';

import styles from '@components/TextAreaWithSpotlight.module.scss';
import React, { useRef, useState } from 'react';

export default function TextAreaWithSpotlight({ disabled, color, type, placeholder, onChange, value, height, width }: any) {
  const divRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
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
    <div className={styles.textAreaContainer} style={{ width: width ? width : '60%' }}>
      <textarea
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        autoComplete="off"
        placeholder={placeholder}
        className={styles.textArea}
        inputMode={type}
        value={value}
        onChange={onChange}
        name={placeholder}
        disabled={disabled}
        style={{
          color: color || 'var(--color-text)',
          height: height ? height : 'var(--input-height-regular)',
          padding: 'var(--input-padding-regular)',
        }}
      />
      <textarea
        ref={divRef}
        disabled
        style={{
          border: '1px solid var(--color-lime-green)',
          opacity,
          height: height ? height : 'var(--input-height-regular)',
          padding: 'var(--input-padding-regular)',
          WebkitMaskImage: `radial-gradient(30% 30px at ${position.x}px ${position.y}px, black 45%, transparent)`,
        }}
        aria-hidden="true"
        className={styles.textAreaMask}
      />
    </div>
  );
}
