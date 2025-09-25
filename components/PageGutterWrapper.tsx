import styles from '@components/PageGutterWrapper.module.scss';

export default function PageGutterWrapper({ children, style }: any) {
  return (
    <div className={styles.container} style={style}>
      {children}
    </div>
  );
}
