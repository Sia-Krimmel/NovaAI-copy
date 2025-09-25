export default function CalculatorSVG(props) {
  return (
    <svg {...props} width={props.width ?? '16'} height={props.height ?? '16'} viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 16L12 16L12 0H0V16ZM10.5 14.5V11H6.75V14.5H10.5ZM5.25 14.5H1.5L1.5 11H5.25V14.5ZM6.75 9.5H10.5L10.5 5.5H6.75V9.5ZM5.25 5.5V9.5H1.5L1.5 5.5H5.25ZM1.5 4H10.5V1.5L1.5 1.5L1.5 4Z"
        fill="gray"
      />
    </svg>
  );
}
