export default function EyeSVG(props) {
  return (
    <svg {...props} width={props.width ?? '16'} height={props.height ?? '16'} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clip-rule="evenodd"
        d="M0 6L3.07945 2.30466C4.29638 0.844341 6.09909 0 8 0C9.90091 0 11.7036 0.844343 12.9206 2.30466L16 6L12.9206 9.69534C11.7036 11.1557 9.90091 12 8 12C6.09909 12 4.29638 11.1557 3.07945 9.69534L0 6ZM8 9C9.65685 9 11 7.65685 11 6C11 4.34315 9.65685 3 8 3C6.34315 3 5 4.34315 5 6C5 7.65685 6.34315 9 8 9Z"
        fill={props.color ?? 'white'}
      />
    </svg>
  );
}
