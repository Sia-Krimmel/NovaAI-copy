import { classNames } from '@root/common/utilities';

import buttonStyles from './Button.module.scss';

import Loader from '@components/Loader';
import React from 'react';
import ArrowUpSVG from './svgs/ArrowUpSVG';

export const enum ButtonStyleEnum {
  ADD_SQUARE_GREEN = 'add-square-green',
  BLACK = 'black',
  BORDER_BLACK = 'border-black',
  CIRCLE_BORDER_BLACK = 'circle-border-black',
  GREEN = 'green',
  LINK_GREEN = 'link-green',
  SQUARE_BLACK = 'square-black',
  SQUARE_SECONDARY = 'square-secondary',
  SQUARE_GREEN = 'green-square',
  SQUARE_GREEN_OUTLINE = 'green-square-outline',
  WHITE = 'white',
}

function getButtonStyle(style, withArrow) {
  switch (style) {
    case ButtonStyleEnum.BLACK:
      return withArrow ? classNames(buttonStyles.buttonStyleBlackWithArrow, buttonStyles.button) : classNames(buttonStyles.buttonStyleBlack, buttonStyles.button);
    case ButtonStyleEnum.SQUARE_GREEN:
      return withArrow ? classNames(buttonStyles.buttonStyleGreenSquareWithArrow, buttonStyles.buttonSquare) : classNames(buttonStyles.buttonStyleGreen, buttonStyles.buttonSquare);
    case ButtonStyleEnum.SQUARE_GREEN_OUTLINE:
      return classNames(buttonStyles.buttonStyleGreenOutline, buttonStyles.buttonSquare);
    case ButtonStyleEnum.ADD_SQUARE_GREEN:
      return classNames(buttonStyles.buttonAddStyleGreen, buttonStyles.buttonSquare);
    case ButtonStyleEnum.SQUARE_BLACK:
      return classNames(buttonStyles.buttonStyleBlack, buttonStyles.buttonSquare);
    case ButtonStyleEnum.BORDER_BLACK:
      return classNames(buttonStyles.buttonStyleBorderBlack, buttonStyles.buttonSquare);
    case ButtonStyleEnum.LINK_GREEN:
      return classNames(buttonStyles.buttonStyleLink, buttonStyles.buttonLinkGreen);
    case ButtonStyleEnum.WHITE:
      return withArrow ? classNames(buttonStyles.buttonStyleWhiteWithArrow, buttonStyles.button) : classNames(buttonStyles.buttonStyleWhite, buttonStyles.button);
    case ButtonStyleEnum.CIRCLE_BORDER_BLACK:
      return classNames(buttonStyles.buttonCircleBorderBlack);
    case ButtonStyleEnum.SQUARE_SECONDARY:
      return classNames(buttonStyles.buttonSquare, buttonStyles.buttonStyleSecondary);
    default:
    case ButtonStyleEnum.GREEN:
      return withArrow ? classNames(buttonStyles.buttonStyleGreenWithArrow, buttonStyles.button) : classNames(buttonStyles.buttonStyleGreen, buttonStyles.button);
  }
}

export interface ButtonProps {
  children: any;
  className?: string;
  disabled?: boolean;
  href?: string;
  loading?: boolean;
  style?: ButtonStyleEnum;
  styles?: any;
  target?: any;
  type?: any;
  width?: string;
  withArrow?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export default function Button({ children, className, disabled, style = ButtonStyleEnum.GREEN, styles, target, type, withArrow, loading, href, onClick, width }: ButtonProps) {
  if (loading) {
    return (
      <div className={buttonStyles.loader} style={styles}>
        <Loader />
      </div>
    );
  }

  const buttonClass = getButtonStyle(style, withArrow);
  const buttonContent = (
    <>
      <span className={withArrow ? buttonStyles.buttonText : ''} style={{ padding: '4px', textDecoration: 'none' }}>
        {children}
      </span>
      {withArrow && <ArrowUpSVG className={buttonStyles.arrowIcon} color={'var(--color-black)'} width="12px" strokeWidth="1px" />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classNames(buttonStyles.root, buttonClass, className)} style={styles} target={target} onClick={onClick}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button style={styles} type={type} disabled={disabled} className={classNames(buttonStyles.root, buttonClass, className)} onClick={onClick}>
      {buttonContent}
    </button>
  );
}
