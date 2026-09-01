import React, { useEffect, useRef, useState } from 'react';
import { extractYoutubeId, isAudioOnlyPodcast } from '../data/podcasts';
import { PodcastItem } from '../types';

interface AudioPlayerProps {
  podcast: PodcastItem | null;
  onClose: () => void;
  isDark?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  podcast,
  onClose,
  isDark = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showFullAudioModal, setShowFullAudioModal] = useState(false);
  const [isPipVideo, setIsPipVideo] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const youtubeId = podcast ? extractYoutubeId(podcast.youtubeId || podcast.youtubeUrl) : '';
  const isVideo = !!youtubeId;
  const isAudio = isAudioOnlyPodcast(podcast || ({} as PodcastItem)) || !isVideo;

  // Calculate duration in seconds
  const calculateDurationSeconds = (durStr?: string): number => {
    if (!durStr) return 1800;
    if (durStr.includes('min') || durStr.includes('นาที')) {
      const mins = parseInt(durStr.replace(/[^0-9]/g, ''), 10);
      return isNaN(mins) ? 1800 : mins * 60;
    }
    if (durStr.includes(':')) {
      const parts = durStr.split(':').map((p) => parseInt(p.trim(), 10));
      if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
      if (parts.length === 3) return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    }
    const parsedNum = parseInt(durStr, 10);
    if (!isNaN(parsedNum)) {
      return parsedNum > 100 ? parsedNum : parsedNum * 60;
    }
    return 1800;
  };

  const initialDuration = calculateDurationSeconds(podcast?.duration);
  const [durationSeconds, setDurationSeconds] = useState<number>(initialDuration);

  // Reset states when podcast changes
  useEffect(() => {
    setDurationSeconds(calculateDurationSeconds(podcast?.duration));
    setCurrentTime(0);
    setIsPlaying(true);
    setIsPipVideo(false);
    if (isAudio) {
      setShowFullAudioModal(false);
    }
  }, [podcast?.id, podcast?.duration, isAudio]);

  // Audio Playback Handlers
  const handleTogglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (newSeconds: number) => {
    const clamped = Math.max(0, Math.min(durationSeconds, newSeconds));
    setCurrentTime(clamped);
    if (audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
  };

  const handleSetSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  if (!podcast) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, (currentTime / (durationSeconds || 1)) * 100);

  // Origin for YouTube embed
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const youtubeEmbedSrc = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&enablejsapi=1&playsinline=1&rel=0&modestbranding=1&origin=${encodeURIComponent(
        origin
      )}`
    : '';

  // =========================================================================
  // 🎬 1. YOUTUBE VIDEO PLAYER (MODAL / PICTURE-IN-PICTURE)
  // =========================================================================
  if (isVideo) {
    if (isPipVideo) {
      // Floating Mini PiP Player (Bottom Right)
      return (
        <div
          id="youtube-pip-container"
          className="fixed bottom-5 right-5 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-black animate-fade-in"
        >
          <div className="relative aspect-video w-full">
            <iframe
              title={podcast.title}
              src={youtubeEmbedSrc}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {/* Top Bar Floating Controls */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 backdrop-blur-md rounded-lg p-1 z-10">
              <button
                onClick={() => setIsPipVideo(false)}
                className="p-1 text-white/80 hover:text-white rounded hover:bg-white/20 transition-colors"
                title="ขยายเต็มหน้าต่าง (Expand Video)"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_full</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-500/20 transition-colors"
                title="ปิด (Close)"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
          <div className="p-3 bg-[#060e20] text-white flex items-center justify-between gap-2 border-t border-slate-800">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">smart_display</span>
                YouTube Video
              </span>
              <p className="text-xs font-semibold truncate text-slate-200">{podcast.title}</p>
            </div>
          </div>
        </div>
      );
    }

    // Full Video Modal
    return (
      <div
        id="youtube-video-modal"
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
        onClick={onClose}
      >
        <div
          className={`w-full max-w-4xl rounded-3xl p-5 sm:p-7 shadow-2xl border transition-all ${
            isDark ? 'bg-[#060e20] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center gap-3 mb-4 pb-3 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold shadow-sm">
                <span className="material-symbols-outlined text-[16px]">smart_display</span>
                <span>YouTube Video Player</span>
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400">
                {podcast.category} • {podcast.institution || podcast.channel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPipVideo(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="ย่อเป็นหน้าต่างลอยด้านล่าง (Minimize to PiP)"
              >
                <span className="material-symbols-outlined text-[16px]">picture_in_picture_alt</span>
                <span className="hidden sm:inline">ย่อหน้าจอ (PiP)</span>
              </button>

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
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="ปิดหน้าต่างวิดีโอ"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
          </div>

          {/* YouTube Video Frame */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
            <iframe
              title={podcast.title}
              src={youtubeEmbedSrc}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Episode Info */}
          <div className="mt-4 flex flex-col gap-2">
            <h3 className="text-lg sm:text-2xl font-bold leading-snug text-slate-100">
              {podcast.title}
            </h3>

            {podcast.description && (
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {podcast.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 🎧 2. SPOTIFY / AUDIO PODCAST PLAYER (BOTTOM BAR + EXPANDED MODAL)
  // =========================================================================
  return (
    <>
      {/* HTML5 Native Audio for reliable, zero-ad audio playback */}
      {podcast.audioUrl && (
        <audio
          ref={audioRef}
          src={podcast.audioUrl}
          autoPlay
          onTimeUpdate={(e) => setCurrentTime(Math.round(e.currentTarget.currentTime))}
          onLoadedMetadata={(e) => setDurationSeconds(Math.round(e.currentTarget.duration))}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Persistent Bottom Audio Player Bar */}
      <div
        id="spotify-bottom-player-bar"
        className={`fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-50 rounded-2xl shadow-2xl backdrop-blur-xl border p-3 sm:p-4 transition-all duration-300 ${
          isDark
            ? 'bg-[#060e20]/95 border-emerald-500/30 text-[#f8fafc]'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-emerald-500/10'
        }`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            {/* Episode Info & Thumbnail */}
            <div
              className="flex items-center gap-3 min-w-0 cursor-pointer group"
              onClick={() => setShowFullAudioModal(true)}
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-emerald-500/30 group-hover:scale-105 transition-transform">
                <img
                  src={podcast.imageUrl}
                  alt={podcast.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-400 text-[20px] animate-pulse">
                    graphic_eq
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">podcasts</span>
                    Spotify Podcast
                  </span>
                  <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                    • {podcast.channel || podcast.institution}
                  </span>
                </div>
                <h4 className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs md:max-w-md group-hover:text-emerald-400 transition-colors">
                  {podcast.title}
                </h4>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => handleSeek(currentTime - 15)}
                className="hidden sm:flex p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="ย้อนกลับ 15 วินาที"
              >
                <span className="material-symbols-outlined text-[20px]">replay_15</span>
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105"
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
                onClick={() => handleSeek(currentTime + 15)}
                className="hidden sm:flex p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="ข้ามไปข้างหน้า 15 วินาที"
              >
                <span className="material-symbols-outlined text-[20px]">forward_15</span>
              </button>

              {/* Speed toggle */}
              <button
                onClick={() => {
                  const next =
                    playbackSpeed === 1
                      ? 1.25
                      : playbackSpeed === 1.25
                      ? 1.5
                      : playbackSpeed === 1.5
                      ? 2
                      : 1;
                  handleSetSpeed(next);
                }}
                className="hidden sm:inline-block text-xs font-bold px-2 py-1 rounded-md bg-slate-800 text-emerald-400 hover:text-white border border-slate-700"
                title="ความเร็วในการเล่นเสียง"
              >
                {playbackSpeed}x
              </button>

              {/* Expand Modal */}
              <button
                onClick={() => setShowFullAudioModal(true)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="ขยายเครื่องเล่นเสียงเต็มจอ"
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

          {/* Timeline Scrubber */}
          <div className="w-full flex items-center gap-3 pt-1">
            <span className="text-[11px] text-slate-400 font-mono">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={durationSeconds || 1}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700/60 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-[11px] text-slate-400 font-mono">
              {formatTime(durationSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Audio Modal */}
      {showFullAudioModal && (
        <div
          id="spotify-audio-full-modal"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setShowFullAudioModal(false)}
        >
          <div
            className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all ${
              isDark ? 'bg-[#060e20] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">podcasts</span>
                  <span>Spotify Audio Podcast</span>
                </span>
                <span className="text-xs text-slate-400">เสียงระดับสตูดิโอ</span>
              </div>

              <div className="flex items-center gap-2">
                {podcast.spotifyUrl && (
                  <a
                    href={podcast.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    title="Open in Spotify"
                  >
                    <span className="material-symbols-outlined text-[16px]">podcasts</span>
                    <span>เปิดใน Spotify</span>
                  </a>
                )}
                <button
                  onClick={() => setShowFullAudioModal(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="ปิด"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
            </div>

            {/* Spotify Official Embed Player OR Custom Studio Waveform */}
            {podcast.spotifyEmbedUrl ? (
              <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30 bg-black/60 p-2">
                <iframe
                  title={`Spotify Player - ${podcast.title}`}
                  data-testid="embed-iframe"
                  style={{ borderRadius: '14px' }}
                  src={podcast.spotifyEmbedUrl}
                  width="100%"
                  height="232"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full shadow-inner"
                />
              </div>
            ) : (
              /* Audio Album Artwork & Sound Waves */
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col items-center justify-center p-8 mb-6">
                <img
                  src={podcast.imageUrl}
                  alt={podcast.title}
                  className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110 opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-black/60 to-transparent" />

                <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                  <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-emerald-500/30">
                    <img
                      src={podcast.imageUrl}
                      alt={podcast.title}
                      className="w-full h-full object-cover"
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                        <span className="material-symbols-outlined text-emerald-400 text-4xl animate-pulse">
                          graphic_eq
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Animated Equalizer Waveform */}
                  <div className="flex items-end gap-1.5 h-10 mt-2">
                    {[16, 32, 22, 38, 26, 14, 30, 36, 18, 28, 12, 24, 34, 20].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-full bg-emerald-400 transition-all duration-200 shadow-sm shadow-emerald-500/50"
                        style={{
                          height: isPlaying ? `${(h * (1 + (i % 3) * 0.2)) % 36 + 6}px` : '4px',
                          opacity: isPlaying ? 0.95 : 0.4,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-emerald-300">
                    {isPlaying ? 'กำลังเล่นพอดแคสต์เสียงคมชัด...' : 'แตะปุ่มเพื่อเล่นเสียง'}
                  </span>
                </div>
              </div>
            )}

            {/* Episode Title & Description */}
            <div className="flex flex-col gap-2 mb-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {podcast.category} • {podcast.institution || podcast.channel}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                {podcast.title}
              </h3>
              {podcast.description && (
                <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                  {podcast.description}
                </p>
              )}
            </div>

            {/* Timeline Scrubber */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 mb-6">
              <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(durationSeconds)}</span>
              </div>
              <div
                className="w-full h-2.5 bg-slate-700/50 rounded-full overflow-hidden cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  handleSeek(Math.floor(ratio * durationSeconds));
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Audio Controls (Speed, Replay 15, Play, Forward 15) */}
            <div className="flex items-center justify-between gap-4">
              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleSetSpeed(spd)}
                    className={`text-xs px-2 py-1 rounded-lg font-semibold transition-all ${
                      playbackSpeed === spd
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Main Play Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSeek(currentTime - 15)}
                  className="p-3 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title="ย้อนหลัง 15 วินาที"
                >
                  <span className="material-symbols-outlined text-2xl">replay_15</span>
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all"
                  title={isPlaying ? 'หยุดชั่วคราว' : 'เล่นต่อ'}
                >
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                <button
                  onClick={() => handleSeek(currentTime + 15)}
                  className="p-3 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title="ข้ามไปข้างหน้า 15 วินาที"
                >
                  <span className="material-symbols-outlined text-2xl">forward_15</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
