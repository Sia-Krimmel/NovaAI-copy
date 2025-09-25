import styles from '@components/Input.module.scss';

function Input(props) {
  return <input className={styles.input} {...props} type={props.type} />;
}

export default Input;
