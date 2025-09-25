import styles from './Notification.module.scss';

import { H5, P } from './typography';
import { ReactNode } from 'react';

interface NotificationProps {
  background?: string;
  color?: string;
  description: string;
  descriptionColor?: string;
  icon?: ReactNode;
  text?: string;
  title: string;
  titleColor?: string;
  width?: string;
}

export default function Notification({ background, title, titleColor, description, descriptionColor, width, icon }: NotificationProps) {
  return (
    <div className={styles.container} style={{ background: background ? background : '', width: width ? width : '100%' }}>
      {icon && <div className={styles.icon}>{icon} </div>}
      <div className={styles.content}>
        {title && (
          <H5 className={styles.title} style={{ color: titleColor ? titleColor : '' }}>
            {title}
          </H5>
        )}
        {description && (
          <P className={styles.description} style={{ color: descriptionColor ? descriptionColor : '' }}>
            {description}
          </P>
        )}
      </div>
    </div>
  );
}
