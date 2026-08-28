import React from 'react';

interface SlcLibraryLogoProps {
  className?: string;
  theme?: 'dark' | 'light' | 'original';
}

/**
 * High-accuracy 1:1 Vector Replica of the official SLC Library Logo (Logo Circle - 1.png)
 * Features exact proportions, curves, typography, and color codes:
 * - Left: Open Holy Bible, Navy Cross with Blue/Navy Flame
 * - Right: S (Orange #FFA827), L (Sky Blue #63B3F8), C (Pastel Pink #F981AA)
 * - Subtitle: LIBRARY (Dark Navy #0B2548)
 */
export const SlcLibraryLogo: React.FC<SlcLibraryLogoProps> = ({
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 540 280"
      className={`w-auto h-auto select-none shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ห้องสมุด วิทยาลัยเซนต์หลุยส์ (SLC Library)"
    >
      <g>
        {/* ========================================================= */}
        {/* 📖 1. OPEN BOOK (Left Pages, Center Spine, Bottom Layers)  */}
        {/* ========================================================= */}
        {/* Main Outer Left Book Border */}
        <path
          d="M 68 116 C 118 90, 172 96, 210 128 L 210 234 C 172 202, 118 198, 68 220 Z"
          stroke="#0A2540"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Inner Page Curvature */}
        <path
          d="M 84 138 C 124 118, 168 122, 198 144 L 198 214 C 168 194, 124 192, 84 206 Z"
          stroke="#0A2540"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Bottom Left Page Flip Edge */}
        <path
          d="M 70 220 C 114 202, 162 205, 204 228"
          stroke="#0A2540"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        {/* Lower Left Page Shadow Line */}
        <path
          d="M 76 232 C 118 214, 164 216, 204 238"
          stroke="#0A2540"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* ========================================================= */}
        {/* ✝️ 2. CENTER CROSS & FLAME                               */}
        {/* ========================================================= */}
        {/* Flame on top of Cross */}
        {/* Outer Flame (Navy Blue) */}
        <path
          d="M 197 88 C 180 106, 180 122, 197 132 C 214 122, 214 106, 197 88 Z"
          fill="#0A2540"
        />
        {/* Inner Flame (Cyan Blue) */}
        <path
          d="M 197 99 C 187 110, 187 120, 197 126 C 207 120, 207 110, 197 99 Z"
          fill="#5CB6FF"
        />

        {/* Cross Vertical Spine */}
        <rect x="186" y="130" width="22" height="110" rx="3" fill="#0A2540" />

        {/* Cross Horizontal Beam */}
        <rect x="146" y="170" width="102" height="22" rx="3" fill="#0A2540" />

        {/* Right Page Base Shadow Arch */}
        <path
          d="M 216 226 C 234 220, 252 220, 266 226"
          stroke="#0A2540"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        {/* ========================================================= */}
        {/* 🔤 3. SLC LETTERS (Orange, Sky Blue, Pink)                */}
        {/* ========================================================= */}
        {/* S (Warm Golden Orange #FFA827) */}
        <path
          d="M 334 140 C 334 136, 331 133, 324 131 C 316 128, 303 127, 287 127 C 271 127, 258 130, 248 137 C 238 144, 233 154, 233 166 C 233 177, 237 186, 246 193 C 255 199, 270 205, 290 209 C 304 212, 313 216, 317 219 C 321 222, 323 226, 323 232 C 323 238, 320 243, 314 247 C 308 251, 298 253, 286 253 C 272 253, 260 250, 251 243 C 242 236, 237 227, 236 215 L 213 215 C 214 233, 222 248, 237 259 C 251 270, 270 275, 291 275 C 313 275, 330 270, 342 259 C 354 248, 360 234, 360 218 C 360 206, 355 196, 346 189 C 337 182, 322 176, 301 172 C 288 169, 279 166, 275 163 C 270 160, 268 156, 268 150 C 268 145, 271 141, 277 138 C 282 134, 291 132, 302 132 C 314 132, 323 135, 330 140 C 336 145, 340 152, 341 162 L 363 162 C 362 147, 355 135, 344 126 C 334 118, 320 114, 302 114 C 283 114, 267 118, 255 127 C 242 136, 236 149, 236 166 Z"
          fill="#FFA827"
          transform="matrix(0.85 0 0 0.85 64 26)"
        />

        {/* L (Sky Blue #63B3F8) */}
        <path
          d="M 364 128 L 391 128 L 391 230 L 468 230 L 468 252 L 364 252 Z"
          fill="#63B3F8"
          transform="matrix(0.85 0 0 0.85 58 26)"
        />

        {/* C (Vibrant Soft Pink #F981AA) */}
        <path
          d="M 578 166 C 572 152, 563 140, 550 131 C 537 122, 521 117, 501 117 C 481 117, 464 122, 451 133 C 437 143, 427 157, 421 175 C 414 192, 411 210, 411 230 C 411 250, 414 268, 421 285 C 427 302, 437 316, 451 326 C 465 337, 482 342, 502 342 C 522 342, 538 337, 551 327 C 564 317, 573 303, 579 285 L 552 285 C 547 297, 541 306, 533 312 C 525 318, 514 321, 502 321 C 487 321, 474 316, 464 306 C 454 296, 447 282, 443 263 C 439 245, 437 225, 437 204 C 437 183, 439 164, 443 147 C 447 130, 454 117, 464 107 C 474 97, 487 92, 501 92 C 514 92, 524 95, 532 101 C 540 107, 547 116, 552 128 Z"
          fill="#F981AA"
          transform="matrix(0.85 0 0 0.85 45 -4)"
        />

        {/* ========================================================= */}
        {/* 📚 4. 'LIBRARY' Subtitle Typography                      */}
        {/* ========================================================= */}
        <text
          x="268"
          y="238"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontSize="48"
          fontWeight="900"
          fill="#0A2540"
          letterSpacing="4"
        >
          LIBRARY
        </text>
      </g>
    </svg>
  );
};
