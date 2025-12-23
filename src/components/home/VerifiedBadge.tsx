export default function VerifiedBadge({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L15.09 5.26L19.18 5.27L20.74 9.1L23.82 11.37L22.26 15.2L22.27 19.29L18.44 20.85L15.17 23.93L11.34 22.37L7.51 23.93L4.24 20.85L0.41 19.29L0.42 15.2L-1.14 11.37L1.94 9.1L3.5 5.27L7.59 5.26L12 2Z"
        fill="#09B4C6"
        transform="translate(0.18 0.07) scale(0.96)"
      />
      <path
        d="M9 12L11 14L15 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="#09B4C6"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
