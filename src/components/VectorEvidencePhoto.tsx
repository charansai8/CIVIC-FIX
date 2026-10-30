import React from 'react';

interface VectorEvidencePhotoProps {
  title: string;
  category?: string;
  type?: 'reported' | 'resolved' | 'warning';
  className?: string;
  photoUrl?: string;
}

export const VectorEvidencePhoto: React.FC<VectorEvidencePhotoProps> = ({
  title,
  category = 'PUBLIC INFRASTRUCTURE',
  type = 'reported',
  className = '',
  photoUrl,
}) => {
  // If the user uploaded an actual data URL (like image/jpeg), render img
  if (photoUrl && photoUrl.startsWith('data:image/') && !photoUrl.includes('svg+xml')) {
    return (
      <img
        src={photoUrl}
        alt={title}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  const isResolved = type === 'resolved' || title.toLowerCase().includes('repaired') || title.toLowerCase().includes('fixed') || title.toLowerCase().includes('sealed');
  const isDanger = type === 'warning' || title.toLowerCase().includes('pothole') || title.toLowerCase().includes('leak') || title.toLowerCase().includes('dump');

  const bgColor = isResolved ? '#ECFDF5' : isDanger ? '#FEF2F2' : '#EFF6FF';
  const borderColor = isResolved ? '#10B981' : isDanger ? '#EF4444' : '#0284C7';
  const iconColor = isResolved ? '#059669' : isDanger ? '#DC2626' : '#0369A1';

  return (
    <div
      className={`relative w-full h-full min-h-[180px] flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <svg
        viewBox="0 0 600 360"
        className="w-full h-full max-h-[360px]"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Border Grid */}
        <rect
          x="14"
          y="14"
          width="572"
          height="332"
          rx="12"
          fill="none"
          stroke={borderColor}
          strokeWidth="2.5"
          strokeDasharray="6 6"
        />

        {/* Center Emblem Icon */}
        <g transform="translate(300, 140)">
          <circle
            cx="0"
            cy="0"
            r="54"
            fill={iconColor}
            fillOpacity="0.12"
            stroke={iconColor}
            strokeWidth="3.5"
          />
          {isResolved ? (
            <path
              d="M -22 2 L -6 18 L 24 -14"
              fill="none"
              stroke={iconColor}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <g>
              <path
                d="M 0 -24 L 24 20 L -24 20 Z"
                fill="none"
                stroke={iconColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="0" cy="12" r="3" fill={iconColor} />
              <line x1="0" y1="-8" x2="0" y2="4" stroke={iconColor} strokeWidth="4" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* Title & Metadata */}
        <text
          x="300"
          y="235"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="900"
          fontSize="20"
          fill={iconColor}
          textAnchor="middle"
        >
          {title.toUpperCase()}
        </text>

        <text
          x="300"
          y="265"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="700"
          fontSize="13"
          fill="#475569"
          textAnchor="middle"
          letterSpacing="0.08em"
        >
          CIVIC EVIDENCE • {category.replace('_', ' ').toUpperCase()}
        </text>

        {/* Timestamp & Verification badge */}
        <g transform="translate(300, 300)">
          <rect
            x="-110"
            y="-14"
            width="220"
            height="24"
            rx="6"
            fill="#FFFFFF"
            stroke={borderColor}
            strokeWidth="1.2"
          />
          <text
            x="0"
            y="2"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="700"
            fontSize="10"
            fill="#334155"
            textAnchor="middle"
            letterSpacing="0.05em"
          >
            {isResolved ? '✓ VERIFIED COMPLETION SEAL' : '📍 GEO-TAGGED CITIZEN PROOF'}
          </text>
        </g>
      </svg>
    </div>
  );
};
