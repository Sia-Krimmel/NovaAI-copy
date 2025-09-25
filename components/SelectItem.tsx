const SelectItem = ({ value, onChange, options }) => {
  return (
    <select value={value} onChange={onChange}>
      {options.map((optionValue) => (
        <option key={optionValue} value={optionValue}>
          {optionValue}
        </option>
      ))}
    </select>
  );
};

export default SelectItem;
