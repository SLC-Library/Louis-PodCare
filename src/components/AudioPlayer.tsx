import React, { useEffect, useState } from 'react';
import { PodcastItem } from '../types';

interface AudioPlayerProps {
  podcast: PodcastItem | null;
  onClose: () => void;
  isDark?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ podcast, onClose, isDark = true }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(145); // in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(85);
  const [showFullModal, setShowFullModal] = useState(false);

  const durationSeconds = 45 * 60; // 45 minutes default or calculated

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev < durationSeconds ? prev + 1 : 0));
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, durationSeconds]);

  if (!podcast) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, (currentTime / durationSeconds) * 100);

  return (
    <>
      {/* Floating Bottom Player Bar */}
      <div
        id="audio-bottom-bar"
        className={`fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-50 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 ${
          isDark
            ? 'bg-[#060e20]/95 border-blue-500/30 text-white'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-blue-500/10'
        } p-3 sm:p-4`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Episode Info */}
          <div
            className="flex items-center gap-3 min-w-0 cursor-pointer"
            onClick={() => setShowFullModal(true)}
          >
            <img
              src={podcast.imageUrl}
              alt={podcast.title}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-md ring-1 ring-white/10"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider truncate">
                {podcast.category} • {podcast.institution}
              </p>
              <h4 className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {podcast.title}
              </h4>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setCurrentTime((t) => Math.max(0, t - 15))}
              className="hidden sm:flex p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Replay 15s"
            >
              <span className="material-symbols-outlined text-[20px]">replay_10</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <button
              onClick={() => setCurrentTime((t) => Math.min(durationSeconds, t + 15))}
              className="hidden sm:flex p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Forward 15s"
            >
              <span className="material-symbols-outlined text-[20px]">forward_10</span>
            </button>

            {/* Time readout */}
            <div className="hidden md:flex items-center text-xs text-slate-400 font-mono gap-1">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{podcast.duration}</span>
            </div>

            {/* Speed toggle */}
            <button
              onClick={() =>
                setPlaybackSpeed((s) => (s === 1 ? 1.25 : s === 1.25 ? 1.5 : s === 1.5 ? 2 : 1))
              }
              className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              {playbackSpeed}x
            </button>

            {/* Expand / Close */}
            <button
              onClick={() => setShowFullModal(true)}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Expand player"
            >
              <span className="material-symbols-outlined text-[20px]">open_in_full</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
              title="Close player"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-2.5 flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={durationSeconds}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700/60 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      {/* Expanded Modal */}
      {showFullModal && (
        <div
          id="audio-full-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowFullModal(false)}
        >
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border ${
              isDark ? 'bg-[#060e20] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">
                Now Playing
              </span>
              <button
                onClick={() => setShowFullModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <img
              src={podcast.imageUrl}
              alt={podcast.title}
              className="w-full aspect-video rounded-2xl object-cover shadow-2xl mb-6"
            />

            <h3 className="text-2xl font-bold mb-2 leading-tight">{podcast.title}</h3>
            <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">{podcast.institutionIcon}</span>
              <span>{podcast.institution}</span> • <span>{podcast.category}</span>
            </p>

            {podcast.description && (
              <p className="text-sm leading-relaxed text-slate-300 mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {podcast.description}
              </p>
            )}

            {/* Big Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{podcast.duration}</span>
              </div>
              <div
                className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = clickX / rect.width;
                  setCurrentTime(Math.floor(ratio * durationSeconds));
                }}
              >
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Modal Play Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setCurrentTime((t) => Math.max(0, t - 15))}
                className="p-3 rounded-full hover:bg-white/10 text-slate-300"
                title="Replay 15s"
              >
                <span className="material-symbols-outlined text-2xl">replay_15</span>
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all"
              >
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <button
                onClick={() => setCurrentTime((t) => Math.min(durationSeconds, t + 15))}
                className="p-3 rounded-full hover:bg-white/10 text-slate-300"
                title="Forward 15s"
              >
                <span className="material-symbols-outlined text-2xl">forward_15</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
