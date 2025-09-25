export default function ArrowUpSVG(props) {
  return (
    <svg {...props} width={props.width || '16'} height={props.height || '10'} viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 9L8 2L15 9" stroke={props.color ?? '#5F6377'} stroke-width={props.strokeWidth || '2'} />
    </svg>
  );
}
