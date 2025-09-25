export default function ProfilePictureSVG(props) {
  return (
    <svg {...props} width={props.width ?? '35'} height={props.height ?? '38'} viewBox="0 0 35 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="17.5" cy="18.5" r="17.5" fill="var(--theme-color-accent)" />
      <path
        d="M25.5558 17.7337H23.1116V15.2006H20.6674V12.6653V10.1323H18.221V7.59926V5.06623L15.7768 5.06684V7.59926V10.1323H13.3326V12.6653V15.2006H10.8884V17.7337H8.4442H6V20.2667H8.4442H10.8884V22.7997H13.3326V25.3327V27.8658H15.7768V30.3988V32.9318V35.4649V32.9335H18.221V35.4649V32.9318V30.3988V27.8658H20.6674V25.3327V22.7997H23.1116V20.2667H25.5558H28V17.7337H25.5558Z"
        fill="black"
      />
    </svg>
  );
}
