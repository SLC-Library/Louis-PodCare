import React, { useEffect, useState } from 'react';
import happyImage from '../assets/lumi-happy.png';
import sleepyImage from '../assets/lumi-sleepy.png';
import smartImage from '../assets/lumi-smart.png';
import surprisedImage from '../assets/lumi-surprised.png';
import thinkingImage from '../assets/lumi-thinking.png';
import wavingImage from '../assets/lumi-waving.png';

const expressions = [
  { image: wavingImage, alt: 'Lumi โบกมือ' },
  { image: happyImage, alt: 'Lumi ยิ้มดีใจ' },
  { image: thinkingImage, alt: 'Lumi กำลังคิด' },
  { image: smartImage, alt: 'Lumi ใส่แว่น' },
  { image: surprisedImage, alt: 'Lumi ประหลาดใจ' },
  { image: sleepyImage, alt: 'Lumi ง่วงนอน' },
];

const LIBRARY_URL = 'https://library.slc.ac.th/lib2025/index.php';

export const FloatingLumi: React.FC = () => {
  const [expressionIndex, setExpressionIndex] = useState(0);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPreference.matches) return;

    const intervalId = window.setInterval(() => {
      setExpressionIndex((index) => (index + 1) % expressions.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const expression = expressions[expressionIndex];

  return (
    <div className="fixed bottom-5 right-4 z-40 flex items-center gap-2 sm:bottom-6 sm:right-6 sm:gap-3">
      <span
        aria-hidden="true"
        className="rounded-2xl border border-blue-200 bg-white px-3 py-2 text-right text-xs font-semibold leading-relaxed text-slate-800 shadow-lg shadow-slate-900/15 sm:text-sm"
      >
        กลับสู่เว็บไซต์ห้องสมุด
        <br />
        คลิก Lumi
      </span>
      <a
        href={LIBRARY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="กลับสู่เว็บไซต์ห้องสมุด คลิก Lumi (เปิดแท็บใหม่)"
        title="กลับสู่เว็บไซต์ห้องสมุด คลิก Lumi"
        className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border border-blue-300 bg-gradient-to-br from-blue-100 to-indigo-200 shadow-lg shadow-slate-900/25 transition-transform hover:scale-110 focus-visible:outline-blue-500 sm:h-[88px] sm:w-[88px]"
      >
        <img
          key={expression.image}
          src={expression.image}
          alt={expression.alt}
          className="h-full w-full object-contain"
        />
      </a>
    </div>
  );
};
