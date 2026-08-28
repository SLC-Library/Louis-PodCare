import React from 'react';

interface SlcLibraryLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'square' | 'horizontal' | 'badge';
  theme?: 'dark' | 'light';
}

export const SlcLibraryLogo: React.FC<SlcLibraryLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const navyColor = '#082142';

  // Crisp, high-precision SVG matching the official SLC Library Logo
  return (
    <svg
      viewBox="0 0 460 210"
      className={`w-auto h-full max-h-full shrink-0 select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(10, 5)">
        {/* === Left Side: Open Book & Cross with Flame === */}
        
        {/* Book Left Open Pages (layered book effect) */}
        <g stroke={navyColor} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Main Book Outline */}
          <path
            d="M 28 80 C 65 62, 105 66, 134 88 L 134 162 C 105 138, 65 136, 28 152 L 28 80 Z"
            strokeWidth="9"
          />
          {/* Book Inner Page Arch */}
          <path
            d="M 38 95 C 70 82, 102 84, 126 100 L 126 150 C 102 135, 70 134, 38 144"
            strokeWidth="5"
          />
          {/* Bottom Page Flipping Layer */}
          <path
            d="M 28 152 C 60 140, 95 140, 130 156"
            strokeWidth="6"
          />
          <path
            d="M 32 160 C 62 148, 95 148, 128 164"
            strokeWidth="5"
          />
        </g>

        {/* Cross on Book Spine */}
        <rect x="122" y="56" width="19" height="106" rx="2" fill={navyColor} />
        <rect x="88" y="88" width="86" height="19" rx="2" fill={navyColor} />

        {/* Flame atop Cross */}
        {/* Outer Flame (Navy) */}
        <path
          d="M 131.5 24 C 117 38, 117 50, 131.5 56 C 146 50, 146 38, 131.5 24 Z"
          fill={navyColor}
        />
        {/* Inner Flame (Sky Blue) */}
        <path
          d="M 131.5 32 C 123 41, 123 49, 131.5 53 C 140 49, 140 41, 131.5 32 Z"
          fill="#4FA3E3"
        />

        {/* Right Spine Underline */}
        <path
          d="M 141 156 C 152 153, 165 153, 175 156"
          stroke={navyColor}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* === Right Side: S L C Typography === */}
        {/* S - Golden Orange/Yellow */}
        <text
          x="184"
          y="126"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontSize="92"
          fontWeight="900"
          fill="#F5A623"
        >
          S
        </text>

        {/* L - Sky Blue */}
        <text
          x="248"
          y="126"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontSize="92"
          fontWeight="900"
          fill="#54A0FF"
        >
          L
        </text>

        {/* C - Soft Pink */}
        <text
          x="308"
          y="126"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontSize="92"
          fontWeight="900"
          fill="#F783AC"
        >
          C
        </text>

        {/* LIBRARY - Navy Bold Tracked */}
        <text
          x="185"
          y="166"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontSize="36"
          fontWeight="900"
          fill={navyColor}
          letterSpacing="4.5"
        >
          LIBRARY
        </text>
      </g>
    </svg>
  );
};
