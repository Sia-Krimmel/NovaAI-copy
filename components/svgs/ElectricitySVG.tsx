export default function ElectricitySVG(props) {
  return (
    <svg {...props} width={props.width ?? '13'} height={props.height ?? '17'} viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.37303 7.67198L8.37428 0.663208H6.37177L0.364258 7.67198V9.67448H5.37052L4.36927 16.6833H6.37177L12.3793 9.67448L12.3793 7.67198H7.37303Z"
        fill={props.color ?? 'gray'}
      />
    </svg>
  );
}
