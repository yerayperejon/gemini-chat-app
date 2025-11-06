import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="40"
    height="40"
    fill="currentColor"
    className="text-rose-900"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12.963 2.286a.75.75 0 00-1.071 1.071L12 4.429l-1.106-1.107a.75.75 0 00-1.071 1.071l1.106 1.107-1.106 1.107a.75.75 0 101.071 1.071L12 6.57l1.106 1.107a.75.75 0 101.071-1.071L13.071 5.5l1.106-1.107a.75.75 0 00-1.071-1.071L12 4.429V2.25a.75.75 0 00-.75-.75h-.563z"
      clipRule="evenodd"
    />
    <path
      d="M7.161 16.22a.75.75 0 01.09-1.056l.33-.28a.75.75 0 01.966.09l.487.567a.75.75 0 01-.09.966l-.33.28a.75.75 0 01-.966-.09l-.487-.567zM15.909 15.164a.75.75 0 011.056.09l.28.33a.75.75 0 01-.09.966l-.567.487a.75.75 0 01-.966-.09l-.28-.33a.75.75 0 01.09-.966l.567-.487z"
    />
    <path
      fillRule="evenodd"
      d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-1.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
      clipRule="evenodd"
    />
  </svg>
);

export default Logo;
