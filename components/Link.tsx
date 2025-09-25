import styles from '@components/Link.module.scss';

import { ReactNode } from 'react';

function SwitchLinkStyle(style) {
  let defaultStyle;

  switch (style) {
    case 'animated-background-green':
      return (defaultStyle = `${styles.animated}  ${styles.background}`);
    case 'animated-green':
      return (defaultStyle = `${styles.animated} ${styles.green}`);
    case 'animated-black':
      return (defaultStyle = `${styles.animated} ${styles.black}`);
    case 'animated-lime-green':
      return (defaultStyle = `${styles.animated} ${styles.limeGreen}`);
    case 'text':
    default:
      return (defaultStyle = `${styles.grey}`);
  }
}

export interface LinkProps {
  children: ReactNode;
  className?: string;
  color?: string;
  href: string;
  props?: any;
  linkStyle?: string;
  target?: string;
  style?: React.CSSProperties;
}

export default function Link({ children, className, color, href, props, linkStyle, target, style }: LinkProps) {
  const defaultStyle = SwitchLinkStyle(linkStyle);

  return (
    <a href={href} className={`${defaultStyle} ${className}`} {...props} target={target ?? '_self'} style={style}>
      <span style={{ color: color }}>{children}</span>
    </a>
  );
}
