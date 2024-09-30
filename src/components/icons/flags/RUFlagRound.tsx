export const RUFlagRound = ({ width = '32px', height = '32px' }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 32 32"
        fill="none"
      >
        <g clipPath="url(#clip0)">
          <circle cx="16" cy="16" r="16" fill="#fff" />
          <path d="M0 10.67h32V21.33H0V10.67Z" fill="#0039A6" />
          <path d="M0 21.33h32V32H0V21.33Z" fill="#D52B1E" />
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="32" height="32" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };
  