import React from 'react';

interface CivicFixLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  isDark?: boolean;
}

export const CivicFixLogo: React.FC<CivicFixLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  isDark = false,
}) => {
  // Dimensions for different sizes
  const dimensions = {
    sm: { width: 140, height: 42, viewBox: '0 0 280 84' },
    md: { width: 180, height: 54, viewBox: '0 0 280 84' },
    lg: { width: 240, height: 72, viewBox: '0 0 280 84' },
    xl: { width: 320, height: 96, viewBox: '0 0 280 84' },
  }[size];

  // High contrast classic colors
  const primaryColor = isDark ? '#FFFFFF' : '#0F172A'; // deep slate / pure white
  const accentTeal = '#0D9488'; // vibrant government-grade teal
  const accentGold = '#F59E0B'; // restrained civic gold

  return (
    <div className={`inline-flex flex-col items-start ${className}`} role="img" aria-label="CivicFix - Civic Infrastructure Reporting and Resolution">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={dimensions.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible select-none transition-all duration-200"
      >
        {/* Subtle Civic Location / Shield emblem on the left */}
        <g transform="translate(10, 10)">
          {/* Outer geometric shield with precision vector lines */}
          <path
            d="M 28 6 L 50 14 L 50 40 C 50 56 38 66 28 70 C 18 66 6 56 6 40 L 6 14 Z"
            fill={isDark ? '#1E293B' : '#F1F5F9'}
            stroke={primaryColor}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Location pin / civic fix wrench checkmark */}
          <circle cx="28" cy="30" r="8" fill={accentTeal} />
          <path
            d="M 28 20 C 23.5 20 20 23.5 20 28 C 20 34 28 44 28 44 C 28 44 36 34 36 28 C 36 23.5 32.5 20 28 20 Z"
            fill="none"
            stroke={primaryColor}
            strokeWidth="2.5"
          />
          <circle cx="28" cy="27" r="2.8" fill={accentGold} />
          <path
            d="M 23 48 L 27 52 L 34 44"
            fill="none"
            stroke={accentTeal}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 
          TYPOGRAPHIC WORDMARK:
          Upper line: C  [shared I]  V   I   C
          Lower line:    F  [shared I]  X
          
          The first letter 'I' in CIVIC is precisely unified and vertically extended
          as the shared 'I' in FIX, with 'F' positioned immediately to its left
          and 'X' to its right on the lower line. No independent second 'I' is drawn for FIX.
        */}
        <g transform="translate(76, 4)">
          {/* UPPER LINE: CIVIC */}
          {/* Letter C (First) */}
          <text
            x="4"
            y="32"
            fontFamily="'JetBrains Mono', 'Plus Jakarta Sans', monospace, sans-serif"
            fontWeight="900"
            fontSize="30"
            letterSpacing="0.05em"
            fill={primaryColor}
          >
            C
          </text>

          {/* 
            THE SHARED 'I':
            Positioned at x = 32.
            This single continuous, geometrically accented vertical pillar 
            spans both the upper word CIVIC and the lower word FIX!
            Highlighted with teal civic accent.
          */}
          <g>
            {/* Upper crown of shared I */}
            <rect x="29" y="8" width="14" height="4" rx="1.5" fill={primaryColor} />
            {/* The main vertical stem of the shared I spanning both lines */}
            <rect
              x="32.5"
              y="11"
              width="7"
              height="58"
              rx="2.5"
              fill={accentTeal}
            />
            {/* Center connector nodule representing civic connection */}
            <circle cx="36" cy="40" r="3.2" fill={accentGold} />
            {/* Lower foot of shared I */}
            <rect x="29" y="68" width="14" height="4" rx="1.5" fill={primaryColor} />
          </g>

          {/* Letter V */}
          <text
            x="52"
            y="32"
            fontFamily="'JetBrains Mono', 'Plus Jakarta Sans', monospace, sans-serif"
            fontWeight="900"
            fontSize="30"
            letterSpacing="0.05em"
            fill={primaryColor}
          >
            V
          </text>

          {/* Letter I (Second I in CIVIC) */}
          <text
            x="84"
            y="32"
            fontFamily="'JetBrains Mono', 'Plus Jakarta Sans', monospace, sans-serif"
            fontWeight="900"
            fontSize="30"
            letterSpacing="0.05em"
            fill={primaryColor}
          >
            I
          </text>

          {/* Letter C (Last C in CIVIC) */}
          <text
            x="108"
            y="32"
            fontFamily="'JetBrains Mono', 'Plus Jakarta Sans', monospace, sans-serif"
            fontWeight="900"
            fontSize="30"
            letterSpacing="0.05em"
            fill={primaryColor}
          >
            C
          </text>

          {/* 
            LOWER LINE: FIX
            Placed beneath CIVIC.
            'F' to the left of the shared I (x ~ 10).
            [Shared I at x ~ 32.5]
            'X' to the right of the shared I (x ~ 48).
          */}
          {/* Letter F */}
          <text
            x="12"
            y="69"
            fontFamily="'JetBrains Mono', 'Plus Jakarta Sans', monospace, sans-serif"
            fontWeight="900"
            fontSize="28"
            letterSpacing="0.05em"
            fill={primaryColor}
          >
            F
          </text>

          {/* Letter X */}
          <text
            x="50"
            y="69"
            fontFamily="'JetBrains Mono', 'Plus Jakarta Sans', monospace, sans-serif"
            fontWeight="900"
            fontSize="28"
            letterSpacing="0.05em"
            fill={primaryColor}
          >
            X
          </text>

          {/* Subtle separator dot & platform descriptor */}
          <circle cx="95" cy="58" r="3" fill={accentTeal} />
          <text
            x="105"
            y="62"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="700"
            fontSize="10"
            letterSpacing="0.16em"
            fill={isDark ? '#94A3B8' : '#64748B'}
          >
            GOV PORTAL
          </text>
        </g>
      </svg>

      {showTagline && (
        <span
          className={`text-[10px] tracking-widest uppercase font-semibold pl-1 mt-0.5 ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}
        >
          Report It • Track It • Fix It
        </span>
      )}
    </div>
  );
};
