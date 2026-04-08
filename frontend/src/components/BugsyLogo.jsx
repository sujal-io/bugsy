function BugsyLogo({ className = "h-8 w-8", wordmarkClassName = "text-xl" }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bugsyG" x1="8" y1="8" x2="56" y2="56">
            <stop stopColor="#60A5FA" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        <path
          d="M32 8c9.5 0 17 7.5 17 17v10c0 11-7.6 21-17 21S15 46 15 35V25c0-9.5 7.5-17 17-17Z"
          fill="url(#bugsyG)"
          opacity="0.95"
        />
        <path
          d="M24 18c1.7 0 3 1.3 3 3 0 2.2-2.2 4.2-4.5 5.8-2.3 1.6-4.5 2.7-4.5 2.7s.7-2.4 2.1-5.1C21.5 21.7 22.8 18 24 18Zm16 0c1.2 0 2.5 3.7 3.9 6.4 1.4 2.7 2.1 5.1 2.1 5.1s-2.2-1.1-4.5-2.7C39.2 25.2 37 23.2 37 21c0-1.7 1.3-3 3-3Z"
          fill="#0B1220"
          opacity="0.65"
        />
        <path
          d="M21 34h22M21 40h22"
          stroke="#0B1220"
          strokeOpacity="0.55"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="26" cy="30" r="2" fill="#0B1220" opacity="0.7" />
        <circle cx="38" cy="30" r="2" fill="#0B1220" opacity="0.7" />
      </svg>

      <div className={`font-bold tracking-tight ${wordmarkClassName}`}>
        Bugsy
      </div>
    </div>
  );
}

export default BugsyLogo;

