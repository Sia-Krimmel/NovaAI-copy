export default function ArrowLeftSVG(props, stroke) {
  return (
    <svg {...props} width={props.width ?? '16'} height={props.height ?? '24'} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.50752 0.999999L0.999997 9.94482M0.999997 9.94482L9.50752 18.8896M0.999997 9.94482L18.8896 9.94482"
        stroke={stroke ? stroke : '#34C759'}
        strokeWidth="1.98774"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
