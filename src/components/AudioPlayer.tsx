import React, { useEffect, useRef, useState } from 'react';
import { extractYoutubeId } from '../data/podcasts';
import { MediaMode, PodcastItem } from '../types';

interface AudioPlayerProps {
  podcast: PodcastItem | null;
  initialMode?: MediaMode;
  onClose: () => void;
  isDark?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  podcast,
  initialMode = 'video',
  onClose,
  isDark = true,
}) => {
  const [mode, setMode] = useState<MediaMode>(initialMode);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);
  const [isPip, setIsPip] = useState(false);

  // Sync mode with initialMode if it changes when selecting a new item
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, podcast?.id]);

  const youtubeId = podcast ? extractYoutubeId(podcast.youtubeId || podcast.youtubeUrl) : '';

  // Parse duration if possible (e.g. "45 mins" -> 2700, "12:30" -> 750)
  const calculateDurationSeconds = (durStr?: string): number => {
    if (!durStr) return 1800;
    if (durStr.includes('min')) {
      const mins = parseInt(durStr, 10);
      return isNaN(mins) ? 1800 : mins * 60;
    }
    if (durStr.includes(':')) {
      const parts = durStr.split(':').map((p) => parseInt(p, 10));
      if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
      if (parts.length === 3) return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    }
    return 1800;
  };

  const durationSeconds = calculateDurationSeconds(podcast?.duration);

  // Audio timer simulation for audio mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && mode === 'audio') {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev < durationSeconds ? prev + 1 : 0));
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, durationSeconds, mode]);

  if (!podcast) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, (currentTime / durationSeconds) * 100);

  return (
    <>
      {/* ================= FLOATING MINI BOTTOM BAR / PiP PLAYER ================= */}
      <div
        id="media-floating-player"
        className={`fixed z-50 transition-all duration-300 ${
          isPip
            ? 'bottom-4 right-4 w-96 rounded-2xl shadow-2xl overflow-hidden border'
            : 'bottom-4 left-4 right-4 max-w-4xl mx-auto rounded-2xl shadow-2xl backdrop-blur-xl border'
        } ${
          isDark
            ? 'bg-[#060e20]/95 border-blue-500/30 text-[#f8fafc]'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-blue-500/10'
        } ${isPip ? 'p-0' : 'p-3 sm:p-4'}`}
      >
        {isPip && mode === 'video' ? (
          /* Mini PiP Video View */
          <div className="relative aspect-video w-full bg-black">
            <iframe
              title={podcast.title}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&enablejsapi=1`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-lg p-1">
              <button
                onClick={() => setIsPip(false)}
                className="p-1 text-white/80 hover:text-white rounded hover:bg-white/20"
                title="Restore Player Bar"
              >
                <span className="material-symbols-outlined text-[18px]">close_fullscreen</span>
              </button>
              <button
                onClick={() => setShowFullModal(true)}
                className="p-1 text-white/80 hover:text-white rounded hover:bg-white/20"
                title="Expand Full Screen"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_full</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-500/20"
                title="Close"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        ) : (
          /* Standard Bottom Player Bar */
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              {/* Episode Info & Thumbnail */}
              <div
                className="flex items-center gap-3 min-w-0 cursor-pointer group"
                onClick={() => setShowFullModal(true)}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md ring-1 ring-white/10 group-hover:scale-105 transition-transform">
                  <img
                    src={podcast.imageUrl}
                    alt={podcast.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-[20px]">
                      {mode === 'video' ? 'movie' : 'headphones'}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider truncate">
                      {podcast.institution}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {mode === 'video' ? 'VIDEO' : 'AUDIO'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold truncate max-w-[180px] sm:max-w-xs md:max-w-md group-hover:text-blue-400 transition-colors">
                    {podcast.title}
                  </h4>
                </div>
              </div>

              {/* Mode Toggle Switch: Video vs Audio */}
              <div className="hidden sm:flex items-center p-1 rounded-xl bg-[#0f172a]/80 border border-slate-700/60 shadow-inner">
                <button
                  id="toggle-video-mode-btn"
                  onClick={() => {
                    setMode('video');
                    setShowFullModal(true);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    mode === 'video'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="ดูคลิปวิดีโอจาก YouTube"
                >
                  <span className="material-symbols-outlined text-[16px]">play_circle</span>
                  <span>ดูคลิป (Video)</span>
                </button>
                <button
                  id="toggle-audio-mode-btn"
                  onClick={() => setMode('audio')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    mode === 'audio'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="ฟังเสียงพอดแคสต์ (Audio Only)"
                >
                  <span className="material-symbols-outlined text-[16px]">headphones</span>
                  <span>ฟังเสียง (Audio)</span>
                </button>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                {mode === 'audio' ? (
                  <>
                    <button
                      onClick={() => setCurrentTime((t) => Math.max(0, t - 15))}
                      className="hidden sm:flex p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="ย้อนกลับ 15 วินาที"
                    >
                      <span className="material-symbols-outlined text-[20px]">replay_15</span>
                    </button>

                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                      title={isPlaying ? 'หยุดชั่วคราว' : 'เล่นต่อ'}
                    >
                      <span
                        className="material-symbols-outlined text-[22px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>

                    <button
                      onClick={() => setCurrentTime((t) => Math.min(durationSeconds, t + 15))}
                      className="hidden sm:flex p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="ข้ามไปข้างหน้า 15 วินาที"
                    >
                      <span className="material-symbols-outlined text-[20px]">forward_15</span>
                    </button>

                    {/* Speed toggle */}
                    <button
                      onClick={() =>
                        setPlaybackSpeed((s) =>
                          s === 1 ? 1.25 : s === 1.25 ? 1.5 : s === 1.5 ? 2 : 1
                        )
                      }
                      className="hidden sm:inline-block text-xs font-bold px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                      title="ความเร็วในการเล่น"
                    >
                      {playbackSpeed}x
                    </button>
                  </>
                ) : (
                  /* Video Quick Controls */
                  <button
                    onClick={() => setShowFullModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                    <span className="hidden sm:inline">เปิดจอใหญ่</span>
                  </button>
                )}

                {/* PiP Button (for video) */}
                {mode === 'video' && (
                  <button
                    onClick={() => setIsPip(true)}
                    className="hidden sm:flex p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="เล่นจอเล็ก (Picture-in-Picture)"
                  >
                    <span className="material-symbols-outlined text-[20px]">picture_in_picture_alt</span>
                  </button>
                )}

                {/* Expand Modal */}
                <button
                  onClick={() => setShowFullModal(true)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="ขยายเครื่องเล่น"
                >
                  <span className="material-symbols-outlined text-[20px]">open_in_full</span>
                </button>

                {/* Close player */}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                  title="ปิดเครื่องเล่น"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Audio Mode Progress & Waveform */}
            {mode === 'audio' && (
              <div className="w-full flex items-center gap-3 pt-1">
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={durationSeconds}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700/60 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-[11px] text-slate-400 font-mono">
                  {podcast.duration}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= EXPANDED FULL MODAL PLAYER ================= */}
      {showFullModal && (
        <div
          id="media-full-modal"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setShowFullModal(false)}
        >
          <div
            className={`w-full max-w-3xl rounded-3xl p-5 sm:p-7 shadow-2xl border transition-all ${
              isDark
                ? 'bg-[#060e20] border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Mode Switcher & Close */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-5 border-b border-slate-700/50 pb-4">
              {/* Dual Mode Selector Pill */}
              <div className="flex items-center bg-[#0f172a] p-1 rounded-2xl border border-slate-700">
                <button
                  id="modal-mode-video-btn"
                  onClick={() => setMode('video')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    mode === 'video'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">movie</span>
                  <span>🎥 ดูคลิป YouTube (Video)</span>
                </button>
                <button
                  id="modal-mode-audio-btn"
                  onClick={() => setMode('audio')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    mode === 'audio'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">headphones</span>
                  <span>🎧 ฟังเสียง (Audio Podcast)</span>
                </button>
              </div>

              {/* Right Action Icons */}
              <div className="flex items-center gap-2">
                <a
                  href={podcast.youtubeUrl || `https://www.youtube.com/watch?v=${youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Open in YouTube"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>YouTube</span>
                </a>
                <button
                  onClick={() => setShowFullModal(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Close Modal"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
            </div>

            {/* Media Content Area based on Mode */}
            {mode === 'video' ? (
              /* ================= VIDEO MODE ================= */
              <div className="flex flex-col gap-4">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
                  <iframe
                    title={podcast.title}
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                      {podcast.category} • {podcast.institution}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {podcast.duration}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold leading-snug text-slate-100">
                    {podcast.title}
                  </h3>

                  {podcast.description && (
                    <p className="text-sm leading-relaxed text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      {podcast.description}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* ================= AUDIO PODCAST MODE ================= */
              <div className="flex flex-col gap-5">
                <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
                  <img
                    src={podcast.imageUrl}
                    alt={podcast.title}
                    className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105 opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-black/50 to-transparent" />

                  {/* Center Audio Artwork & Waveform Animation */}
                  <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-emerald-500/30">
                      <img
                        src={podcast.imageUrl}
                        alt={podcast.title}
                        className="w-full h-full object-cover"
                      />
                      {isPlaying && (
                        <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                          <span className="material-symbols-outlined text-emerald-400 text-3xl animate-pulse">
                            graphic_eq
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Animated Audio Equalizer Bars */}
                    <div className="flex items-end gap-1 h-8">
                      {[14, 28, 18, 32, 22, 12, 26, 30, 16, 24, 10, 20].map((h, i) => (
                        <div
                          key={i}
                          className="w-1.5 rounded-full bg-emerald-400 transition-all duration-200"
                          style={{
                            height: isPlaying ? `${(h * (1 + (i % 3) * 0.2)) % 32 + 8}px` : '4px',
                            opacity: isPlaying ? 0.9 : 0.4,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Episode Info */}
                <div className="text-center">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    {podcast.category} • {podcast.institution}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-2 leading-snug">
                    {podcast.title}
                  </h3>
                  {podcast.description && (
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2 line-clamp-2">
                      {podcast.description}
                    </p>
                  )}
                </div>

                {/* Audio Progress Bar */}
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{podcast.duration}</span>
                  </div>
                  <div
                    className="w-full h-2.5 bg-slate-700/50 rounded-full overflow-hidden cursor-pointer relative"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const ratio = clickX / rect.width;
                      setCurrentTime(Math.floor(ratio * durationSeconds));
                    }}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-150"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  {/* Speed Selector */}
                  <div className="flex items-center gap-1">
                    {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                          playbackSpeed === spd
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  {/* Play / Skip Buttons */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCurrentTime((t) => Math.max(0, t - 15))}
                      className="p-3 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Replay 15s"
                    >
                      <span className="material-symbols-outlined text-2xl">replay_15</span>
                    </button>

                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all"
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
                      className="p-3 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Forward 15s"
                    >
                      <span className="material-symbols-outlined text-2xl">forward_15</span>
                    </button>
                  </div>

                  {/* Switch to Video shortcut */}
                  <button
                    onClick={() => setMode('video')}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold underline underline-offset-4"
                  >
                    <span className="material-symbols-outlined text-[16px]">movie</span>
                    <span>สลับไปดูคลิป</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
