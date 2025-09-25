export default function SendSVG(props, fill) {
  return (
    <svg {...props} className={props.className} width={props.width || '24'} height={props.height || '24'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.9588 4.22074C22.43 2.86998 21.1694 1.55521 19.8 1.96922L3.30692 6.95549C1.23592 7.58161 1.1558 10.4844 3.18912 11.2238L10.1714 13.7628L11.9755 20.3776C12.557 22.5098 15.5427 22.6134 16.2706 20.5267L21.9588 4.22074ZM17.707 7.70711C18.0976 7.31658 18.0976 6.68342 17.707 6.29289C17.3165 5.90237 16.6834 5.90237 16.2928 6.29289L11.7928 10.7929C11.4023 11.1834 11.4023 11.8166 11.7928 12.2071C12.1834 12.5976 12.8165 12.5976 13.207 12.2071L17.707 7.70711Z"
        fill={fill || 'black'}
      />
    </svg>
  );
}
