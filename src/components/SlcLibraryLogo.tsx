import React from 'react';

interface SlcLibraryLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'horizontal' | 'badge';
  theme?: 'dark' | 'light';
}

export const SlcLibraryLogo: React.FC<SlcLibraryLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  theme = 'light',
}) => {
  const sizeMap = {
    sm: { w: 120, h: 48, iconSize: 32 },
    md: { w: 160, h: 64, iconSize: 42 },
    lg: { w: 200, h: 80, iconSize: 54 },
    xl: { w: 260, h: 104, iconSize: 72 },
  };

  const isDark = theme === 'dark';
  const navyColor = isDark ? '#E2E8F0' : '#0B2545';
  const libraryTextColor = isDark ? '#94A3B8' : '#0B2545';

  if (variant === 'circle') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-full bg-white shadow-md p-2 overflow-hidden border border-slate-100 ${className}`}
        style={{ width: sizeMap[size].iconSize * 1.5, height: sizeMap[size].iconSize * 1.5 }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Open Book */}
          <path
            d="M 60 220 C 110 200 160 205 200 230 L 200 330 C 160 305 110 300 60 320 Z"
            stroke="#0B2545"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M 75 240 C 120 225 160 228 190 248 L 190 315 C 160 298 120 295 75 310 Z"
            stroke="#0B2545"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Cross on Spine */}
          <rect x="190" y="195" width="22" height="135" rx="3" fill="#0B2545" />
          <rect x="155" y="235" width="92" height="20" rx="3" fill="#0B2545" />
          
          {/* Flame above Cross */}
          <path
            d="M 201 160 C 188 175 188 188 201 195 C 214 188 214 175 201 160 Z"
            fill="#0B2545"
          />
          <path
            d="M 201 168 C 194 178 195 186 201 190 C 207 186 208 178 201 168 Z"
            fill="#38BDF8"
          />

          {/* S (Orange/Amber) */}
          <text
            x="260"
            y="280"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="105"
            fontWeight="900"
            fill="#F5A623"
            letterSpacing="-2"
          >
            S
          </text>

          {/* L (Sky Blue) */}
          <text
            x="330"
            y="280"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="105"
            fontWeight="900"
            fill="#4DA1FF"
            letterSpacing="-2"
          >
            L
          </text>

          {/* C (Pink) */}
          <text
            x="395"
            y="280"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="105"
            fontWeight="900"
            fill="#F770A3"
            letterSpacing="-2"
          >
            C
          </text>

          {/* LIBRARY (Navy) */}
          <text
            x="260"
            y="330"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="44"
            fontWeight="900"
            fill="#0B2545"
            letterSpacing="6"
          >
            LIBRARY
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 460 200"
        className="h-full w-auto max-h-[50px] shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Open Book */}
        <path
          d="M 25 70 C 65 52 105 56 138 78 L 138 160 C 105 138 65 134 25 152 Z"
          stroke={navyColor}
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 38 88 C 72 74 105 77 128 94 L 128 148 C 105 133 72 130 38 144 Z"
          stroke={navyColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Cross on Spine */}
        <rect x="130" y="48" width="18" height="114" rx="2.5" fill={navyColor} />
        <rect x="100" y="82" width="78" height="17" rx="2.5" fill={navyColor} />
        
        {/* Flame above Cross */}
        <path
          d="M 139 20 C 128 32 128 42 139 48 C 150 42 150 32 139 20 Z"
          fill={navyColor}
        />
        <path
          d="M 139 26 C 133 34 134 40 139 44 C 144 40 145 34 139 26 Z"
          fill="#38BDF8"
        />

        {/* S (Orange/Amber) */}
        <text
          x="185"
          y="120"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="88"
          fontWeight="900"
          fill="#F5A623"
        >
          S
        </text>

        {/* L (Sky Blue) */}
        <text
          x="245"
          y="120"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="88"
          fontWeight="900"
          fill="#4DA1FF"
        >
          L
        </text>

        {/* C (Pink) */}
        <text
          x="300"
          y="120"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="88"
          fontWeight="900"
          fill="#F770A3"
        >
          C
        </text>

        {/* LIBRARY (Navy) */}
        <text
          x="186"
          y="160"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="36"
          fontWeight="900"
          fill={libraryTextColor}
          letterSpacing="4"
        >
          LIBRARY
        </text>
      </svg>
    </div>
  );
};
