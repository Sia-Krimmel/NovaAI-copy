export default function CopySVG(props) {
  return (
    <svg {...props} width={props.width ?? '17'} height={props.height ?? '17'} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.361816 0.0627441H10.3743V4.06776H4.36683V10.0753H0.361816V0.0627441Z" fill={props.color || '#F7F0EA'} />
      <path d="M16.3819 6.07026H6.36933V16.0828H16.3819V6.07026Z" fill={props.color || '#F7F0EA'} />
    </svg>
  );
}
