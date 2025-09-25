import styles from './DatePicker.module.scss';

import { formatDate } from '@root/common/utilities';

interface DatePickerProps {
  id: string;
  name?: string;
  value: string; // value is a string in the format YYYY-MM-DD
  min?: string; // optional, also in the format YYYY-MM-DD
  max?: string; // optional, also in the format YYYY-MM-DD
  disabled?: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DatePicker({ id, name, value, min, max, disabled, onChange }: DatePickerProps) {
  const todaysDate = formatDate(new Date());

  return (
    <input
      className={styles.datePicker}
      type="date"
      onChange={onChange}
      id={id}
      name={name ?? 'date-picker'}
      value={value}
      min={min ?? '01-01-1900'}
      max={max ?? todaysDate}
      disabled={disabled}
    />
  );
}
