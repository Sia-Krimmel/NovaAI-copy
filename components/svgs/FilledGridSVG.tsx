export default function FilledGridSVG(props) {
  return (
    <svg {...props} width={props.width ?? '16'} height={props.height ?? '16'} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clip-rule="evenodd" d="M7 1H1V7H7V1ZM7 9H1V15H7V9ZM9 1H15V7H9V1ZM15 9H9V15H15V9Z" fill={props?.color || 'grey'} />
    </svg>
  );
}
