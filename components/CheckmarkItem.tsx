import styles from './CheckmarkItem.module.scss';

import CheckmarkSVG from './svgs/CheckmarkSVG';

export default function CheckMarkItem(props) {
  if (props.isMinimal) {
    return (
      <div className={styles.itemMinimal} style={props.style}>
        <span className={styles.leftMinimal}>
          <CheckmarkSVG height="16px" />
        </span>
        <span className={styles.rightMinimal}>{props.children}</span>
      </div>
    );
  }

  return (
    <div className={styles.item} style={props.style}>
      <span className={styles.left}>
        <CheckmarkSVG height="16px" />
      </span>
      <span className={styles.right}>{props.children}</span>
    </div>
  );
}
