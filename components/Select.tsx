import styles from './Select.module.scss';
import ArrowUpSVG from './svgs/ArrowUpSVG';

export default function Select(props) {
  let label = 'No options available';

  if (!props.options || !props.options.length) {
    return (
      <figure className={styles.disabled} style={props.style}>
        <span className={styles.passiveText}>{label}</span>
      </figure>
    );
  }

  label = props.options[0].label;

  const selectedOption = props.options.find((e) => e.value === props.value);

  if (selectedOption) {
    label = selectedOption.label;
  } else if (props.options.length > 0) {
    label = props.options[0].label;
  }

  return (
    <figure className={styles.root} style={props.style}>
      <span className={styles.activeText}>{label}</span>
      <ArrowUpSVG height="6px" className={styles.icon} />

      <select className={styles.select} onChange={props.onChange} disabled={props.disabled}>
        {props.options &&
          props.options.map((each) => {
            return (
              <option key={each.label} value={each.value}>
                {each.label}
              </option>
            );
          })}
      </select>
    </figure>
  );
}
