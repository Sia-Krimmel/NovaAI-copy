export default function WaterSVG(props) {
  return (
    <svg {...props} width={props.width ?? '13'} height={props.height ?? '17'} viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.37052 0.863525L1.31043 7.35967C0.692113 8.34898 0.364258 9.49215 0.364258 10.6588V10.8761C0.364258 14.1939 3.05392 16.8836 6.37177 16.8836C9.68964 16.8836 12.3793 14.1939 12.3793 10.8761V10.6588C12.3793 9.49214 12.0514 8.34898 11.4331 7.35967L7.37303 0.863525H5.37052ZM8.37428 10.8761C8.37428 11.982 7.47773 12.8786 6.37177 12.8786V14.8811C8.58368 14.8811 10.3768 13.088 10.3768 10.8761H8.37428Z"
        fill={props.color ?? 'gray'}
      />
    </svg>
  );
}
