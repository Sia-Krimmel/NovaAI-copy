import styles from './Checkbox.module.scss';
import CheckmarkSVG from './svgs/CheckmarkSVG';

function Checkbox(props) {
  return (
    <div className={styles.section} style={props.style}>
      <div className={styles.relative} style={props.checkboxStyle}>
        <label className={styles.figure} htmlFor={`${props.name}-checkbox`}>
          {props.value ? <CheckmarkSVG height="16px" /> : null}
        </label>
        <input checked={props.value} disabled={props.disabled} className={styles.input} id={`${props.name}-checkbox`} type="checkbox" name={props.name} onChange={props.onChange} />
      </div>
      <p className={styles.right}>{props.children}</p>
    </div>
  );
}

export default Checkbox;
