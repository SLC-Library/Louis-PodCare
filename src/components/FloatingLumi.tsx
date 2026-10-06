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
    <a
      href={LIBRARY_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="ไปยังเว็บไซต์หลัก SLC Library (เปิดแท็บใหม่)"
      title="ไปยังเว็บไซต์หลัก SLC Library"
      className="fixed bottom-5 right-4 z-40 flex h-[76px] w-[76px] items-center justify-center rounded-full border border-blue-200/80 bg-white/95 shadow-lg shadow-slate-900/20 transition-transform hover:scale-110 focus-visible:outline-blue-500 sm:bottom-6 sm:right-6 sm:h-[88px] sm:w-[88px]"
    >
      <img
        key={expression.image}
        src={expression.image}
        alt={expression.alt}
        className="h-full w-full object-contain"
      />
    </a>
  );
};
