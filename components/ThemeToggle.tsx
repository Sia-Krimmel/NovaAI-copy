import styles from './ThemeToggle.module.scss';

import * as React from 'react';
import SunSVG from '@root/components/svgs/SunSVG';
import MoonSVG from '@root/components/svgs/MoonSVG';

export default function ThemeToggle({ onHandleThemeChange }) {
  const [themeToggle, setThemeToggle] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.add(savedTheme);
      setIsDarkMode(savedTheme === 'theme-dark');
    }
  }, []);

  const handleThemeChange = () => {
    onHandleThemeChange();
    setThemeToggle(!themeToggle);

    if (isDarkMode) {
      document.body.classList.remove('theme-dark');
    } else {
      document.body.classList.add('theme-dark');
    }

    setIsDarkMode(!isDarkMode);
  };

  return (
    <span className={styles.root} onClick={handleThemeChange}>
      {isDarkMode ? <SunSVG height="16px" /> : <MoonSVG height="16px" />}
    </span>
  );
}
