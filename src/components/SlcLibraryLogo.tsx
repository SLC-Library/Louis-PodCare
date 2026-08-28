import React from 'react';

interface SlcLibraryLogoProps {
  className?: string;
  theme?: 'dark' | 'light' | 'original';
  height?: number | string;
}

export const SlcLibraryLogo: React.FC<SlcLibraryLogoProps> = ({
  className = '',
  theme = 'original',
}) => {
  // If dark adaptive, we use white/light text for the navy parts so it pops on dark backgrounds,
  // while preserving the signature Orange (S), Cyan/Blue (L), and Pink (C).
  const isDark = theme === 'dark';
  const navyColor = isDark ? '#F1F5F9' : '#0B2545';
  const libraryColor = isDark ? '#E2E8F0' : '#0B2545';

  return (
    <svg
      viewBox="0 0 380 155"
      className={`w-auto select-none ${className}`}
      style={{ overflow: 'visible' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SLC Library Logo"
    >
      {/* === Left Side: Book, Cross & Flame === */}
      <g>
        {/* Open Book Outline */}
        <path
          d="M 12 60 C 44 42, 80 46, 106 66 L 106 138 C 80 118, 44 116, 12 132 Z"
          stroke={navyColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner Page Line */}
        <path
          d="M 22 75 C 50 62, 78 65, 98 80 L 98 126 C 78 114, 50 112, 22 122"
          stroke={navyColor}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bottom Page Flipping Accent */}
        <path
          d="M 14 132 C 42 120, 74 121, 102 135"
          stroke={navyColor}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Cross Vertical Beam */}
        <rect x="96" y="38" width="16" height="98" rx="2" fill={navyColor} />
        {/* Cross Horizontal Beam */}
        <rect x="68" y="66" width="72" height="16" rx="2" fill={navyColor} />

        {/* Flame on top of Cross */}
        {/* Outer Flame */}
        <path
          d="M 104 8 C 91 21, 91 32, 104 38 C 117 32, 117 21, 104 8 Z"
          fill={navyColor}
        />
        {/* Inner Flame (Sky Blue) */}
        <path
          d="M 104 16 C 96 24, 96 31, 104 35 C 112 31, 112 24, 104 16 Z"
          fill="#38BDF8"
        />

        {/* Right page base accent */}
        <path
          d="M 112 132 C 122 129, 134 129, 144 132"
          stroke={navyColor}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      {/* === Right Side: SLC LIBRARY Typography === */}
      <g transform="translate(150, 0)">
        {/* Letter 'S' - Golden Yellow / Amber */}
        <text
          x="0"
          y="98"
          fontFamily="'Arial Black', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="76"
          fontWeight="900"
          fill="#F5A623"
        >
          S
        </text>

        {/* Letter 'L' - Sky Blue */}
        <text
          x="54"
          y="98"
          fontFamily="'Arial Black', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="76"
          fontWeight="900"
          fill="#4FA3E3"
        >
          L
        </text>

        {/* Letter 'C' - Vibrant Pastel Pink */}
        <text
          x="105"
          y="98"
          fontFamily="'Arial Black', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="76"
          fontWeight="900"
          fill="#F770A3"
        >
          C
        </text>

        {/* 'LIBRARY' Subtitle */}
        <text
          x="2"
          y="134"
          fontFamily="'Arial Black', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="30"
          fontWeight="900"
          fill={libraryColor}
          letterSpacing="4"
        >
          LIBRARY
        </text>
      </g>
    </svg>
  );
};
