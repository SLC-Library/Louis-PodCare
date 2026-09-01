import React, { useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  Headphones,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Radio,
  RotateCcw,
  RotateCw,
  Sparkles,
  Tv,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { extractSpotifyInfo, extractYoutubeId, isAudioOnlyPodcast } from '../data/podcasts';
import { PodcastItem } from '../types';

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
    SpotifyIframeApi?: any;
  }
}

interface AudioPlayerProps {
  podcast: PodcastItem | null;
  initialMode?: 'video' | 'audio';
  onClose: () => void;
  isDark?: boolean;
}

// Singleton loader for Spotify IFrame API
let spotifyApiPromise: Promise<any> | null = null;
function getSpotifyIFrameApi(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window not available'));
  if (window.SpotifyIframeApi) return Promise.resolve(window.SpotifyIframeApi);
  if (spotifyApiPromise) return spotifyApiPromise;

  spotifyApiPromise = new Promise((resolve) => {
    const prevCallback = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
      window.SpotifyIframeApi = IFrameAPI;
      if (prevCallback) prevCallback(IFrameAPI);
      resolve(IFrameAPI);
    };

    if (!document.getElementById('spotify-iframe-api-script')) {
      const script = document.createElement('script');
      script.id = 'spotify-iframe-api-script';
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return spotifyApiPromise;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  podcast,
  initialMode = 'audio',
  onClose,
  isDark = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showFullAudioModal, setShowFullAudioModal] = useState(false);
  const [isPipVideo, setIsPipVideo] = useState(false);
  const [isSpotifyReady, setIsSpotifyReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spotifyContainerRef = useRef<HTMLDivElement | null>(null);
  const spotifyEmbedControllerRef = useRef<any>(null);

  const youtubeId = podcast ? extractYoutubeId(podcast.youtubeId || podcast.youtubeUrl) : '';
  const isVideo = !!youtubeId;
  const isAudio = isAudioOnlyPodcast(podcast || ({} as PodcastItem)) || !isVideo;

  // Spotify info extraction
  const rawSpotifyInput = podcast?.spotifyEmbedUrl || podcast?.spotifyUrl;
  const spotifyInfo = extractSpotifyInfo(rawSpotifyInput);
  const isSpotifyPodcast = isAudio && !!(spotifyInfo?.embedUrl || podcast?.spotifyUrl || podcast?.spotifyEmbedUrl);
  const spotifyUri = spotifyInfo?.type && spotifyInfo?.id
    ? `spotify:${spotifyInfo.type}:${spotifyInfo.id}`
    : podcast?.spotifyUrl || '';

  // Calculate duration in seconds
  const calculateDurationSeconds = (durStr?: string): number => {
    if (!durStr) return 360;
    if (durStr.includes('min') || durStr.includes('นาที')) {
      const mins = parseInt(durStr.replace(/[^0-9]/g, ''), 10);
      return isNaN(mins) ? 360 : mins * 60;
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
    return 360;
  };

  const [durationSeconds, setDurationSeconds] = useState<number>(() => calculateDurationSeconds(podcast?.duration));

  // Initialize and bind Spotify IFrame API Controller
  useEffect(() => {
    if (!podcast || !isSpotifyPodcast || !spotifyContainerRef.current) return;

    let isMounted = true;
    const targetElement = spotifyContainerRef.current;

    getSpotifyIFrameApi()
      .then((IFrameAPI) => {
        if (!isMounted || !targetElement) return;

        // Clear previous content if any
        targetElement.innerHTML = '';
        const embedMount = document.createElement('div');
        targetElement.appendChild(embedMount);

        const options = {
          uri: spotifyUri,
          width: '100%',
          height: 232,
        };

        const callback = (EmbedController: any) => {
          if (!isMounted) return;
          spotifyEmbedControllerRef.current = EmbedController;
          setIsSpotifyReady(true);

          EmbedController.addListener('playback_update', (e: any) => {
            if (!isMounted || !e?.data) return;
            const { isPaused, isBuffering, position, duration } = e.data;

            if (typeof isPaused === 'boolean') {
              setIsPlaying(!isPaused);
            }
            if (typeof position === 'number') {
              setCurrentTime(Math.round(position / 1000));
            }
            if (typeof duration === 'number' && duration > 0) {
              setDurationSeconds(Math.round(duration / 1000));
            }
          });

          EmbedController.addListener('ready', () => {
            if (isMounted) {
              setIsSpotifyReady(true);
            }
          });
        };

        IFrameAPI.createController(embedMount, options, callback);
      })
      .catch(() => {
        setIsSpotifyReady(false);
      });

    return () => {
      isMounted = false;
      spotifyEmbedControllerRef.current = null;
      if (targetElement) {
        targetElement.innerHTML = '';
      }
    };
  }, [podcast?.id, isSpotifyPodcast, spotifyUri]);

  // Reset states when podcast changes
  useEffect(() => {
    setDurationSeconds(calculateDurationSeconds(podcast?.duration));
    setCurrentTime(0);
    setIsPlaying(false);
    setIsPipVideo(false);
  }, [podcast?.id, podcast?.duration]);

  // Audio Playback Handlers (Seamlessly works with Spotify Controller & HTML5 Audio)
  const handleTogglePlay = () => {
    if (isSpotifyPodcast && spotifyEmbedControllerRef.current) {
      try {
        spotifyEmbedControllerRef.current.togglePlay();
      } catch {
        // Fallback toggle state
        setIsPlaying((prev) => !prev);
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleSeek = (newSeconds: number) => {
    const clamped = Math.max(0, Math.min(durationSeconds, newSeconds));
    setCurrentTime(clamped);

    if (isSpotifyPodcast && spotifyEmbedControllerRef.current) {
      try {
        spotifyEmbedControllerRef.current.seek(clamped);
      } catch {
        // ignore
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
  };

  const handleSetSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  if (!podcast) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = durationSeconds > 0 ? Math.min(100, (currentTime / durationSeconds) * 100) : 0;

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
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-500/20 transition-colors"
                title="ปิด (Close)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-3 bg-[#060e20] text-white flex items-center justify-between gap-2 border-t border-slate-800">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <Tv className="w-3 h-3 text-red-400" />
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
                <Tv className="w-4 h-4 text-red-400" />
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
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ย่อหน้าจอ (PiP)</span>
              </button>

              <a
                href={podcast.youtubeUrl || `https://www.youtube.com/watch?v=${youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Open in YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </a>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="ปิดหน้าต่างวิดีโอ"
              >
                <X className="w-5 h-5" />
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
  // 🎧 2. SPOTIFY / AUDIO PODCAST PLAYER (BOTTOM BAR + DOCKED CONTROLLER MODAL)
  // =========================================================================
  return (
    <>
      {/* HTML5 Native Audio for direct MP3 audio playback */}
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
            ? 'bg-[#060e20]/95 border-emerald-500/40 text-[#f8fafc] shadow-emerald-950/40'
            : 'bg-white/95 border-emerald-500/30 text-slate-900 shadow-xl shadow-emerald-500/10'
        }`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            {/* Episode Info & Thumbnail */}
            <div
              className="flex items-center gap-3 min-w-0 cursor-pointer group"
              onClick={() => setShowFullAudioModal(true)}
              title="คลิกเพื่อขยายหน้าจอเครื่องเล่นเต็มรูปแบบ"
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-emerald-500/40 group-hover:scale-105 transition-transform bg-slate-900">
                <img
                  src={podcast.imageUrl}
                  alt={podcast.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-emerald-950/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {isPlaying ? (
                    <div className="flex items-end gap-0.5 h-4">
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-4" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2.5" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    <Headphones className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-400" />
                    Spotify Podcast
                  </span>
                  <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                    • {podcast.channel || podcast.institution}
                  </span>
                  {isPlaying && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      กำลังเล่น
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs md:max-w-md group-hover:text-emerald-400 transition-colors">
                  {podcast.title}
                </h4>
              </div>
            </div>

            {/* Audio Controls (100% Synchronized with Spotify Controller) */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Rewind 15s */}
              <button
                onClick={() => handleSeek(currentTime - 15)}
                className="hidden sm:flex items-center justify-center relative p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="ย้อนกลับ 15 วินาที"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-[9px] font-bold absolute -bottom-0.5 text-emerald-400">15</span>
              </button>

              {/* Main Play / Pause Button (Controls Spotify & Audio) */}
              <button
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
                title={isPlaying ? 'หยุดชั่วคราว (Pause)' : 'เล่นต่อ (Play)'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Forward 15s */}
              <button
                onClick={() => handleSeek(currentTime + 15)}
                className="hidden sm:flex items-center justify-center relative p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="ข้ามไปข้างหน้า 15 วินาที"
              >
                <RotateCw className="w-4 h-4" />
                <span className="text-[9px] font-bold absolute -bottom-0.5 text-emerald-400">15</span>
              </button>

              {/* Expand Full Player Modal */}
              <button
                onClick={() => setShowFullAudioModal(true)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="ขยายเครื่องเล่นเสียงเต็มจอ (Expand Full Player)"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Close Player */}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                title="ปิดเครื่องเล่น (Close)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="w-full flex items-center gap-2.5 pt-1">
            <span className="text-[11px] text-slate-400 font-mono min-w-[34px]">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-grow flex items-center">
              <input
                type="range"
                min="0"
                max={durationSeconds || 1}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700/60 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-mono min-w-[34px] text-right">
              {formatTime(durationSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* 
        Persistent Spotify Embed Host Container
        Kept in the DOM so that audio does not cut off when toggling between minimized bottom bar and expanded modal!
      */}
      <div
        className={
          showFullAudioModal
            ? 'fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in'
            : 'fixed -left-[9999px] -top-[9999px] w-[1px] h-[1px] opacity-0 pointer-events-none'
        }
        onClick={() => setShowFullAudioModal(false)}
      >
        <div
          className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all ${
            isDark ? 'bg-[#060e20] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center gap-3 mb-5 pb-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold shadow-sm">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Spotify Audio Podcast</span>
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">เสียงระดับสตูดิโอ</span>
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
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>เปิดใน Spotify</span>
                </a>
              )}
              <button
                onClick={() => setShowFullAudioModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="ย่อลงแถบด้านล่าง"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Spotify Official Player Embed Frame (Controlled & Live-Synced) */}
          <div className="mb-5 rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30 bg-black/80 p-2 relative">
            <div ref={spotifyContainerRef} className="w-full min-h-[232px]" />

            {/* Sync Badge */}
            <div className="mt-2 px-3 py-1.5 bg-emerald-950/60 rounded-xl border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                <span>{isPlaying ? 'ระบบกำลังเล่นเสียงพอดแคสต์ (ซิงค์ปุ่มควบคุมแล้ว)' : 'กดปุ่ม Play ด้านล่างหรือบน Spotify เพื่อฟังเสียง'}</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400/80">
                {formatTime(currentTime)} / {formatTime(durationSeconds)}
              </span>
            </div>
          </div>

          {/* Episode Title & Description */}
          <div className="flex flex-col gap-2 mb-5">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {podcast.category} • {podcast.institution || podcast.channel}
            </span>
            <h3 className="text-lg sm:text-xl font-bold leading-snug">
              {podcast.title}
            </h3>
            {podcast.description && (
              <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 leading-relaxed max-h-28 overflow-y-auto">
                {podcast.description}
              </p>
            )}
          </div>

          {/* Interactive Synchronized Timeline Scrubber */}
          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 mb-5">
            <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
              <span className="text-emerald-400 font-semibold">{formatTime(currentTime)}</span>
              <span>{formatTime(durationSeconds)}</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max={durationSeconds || 1}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-2 bg-slate-700/60 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          {/* Synchronized Play Controls (Rewind 15s, Play/Pause, Forward 15s) */}
          <div className="flex items-center justify-between gap-4">
            {/* Speed selection indicator */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleSetSpeed(spd)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    playbackSpeed === spd
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Main Synced Play Controls */}
            <div className="flex items-center gap-3">
              {/* Rewind 15s */}
              <button
                onClick={() => handleSeek(currentTime - 15)}
                className="p-3 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors relative flex items-center justify-center group"
                title="ย้อนหลัง 15 วินาที"
              >
                <RotateCcw className="w-6 h-6 group-hover:text-emerald-400 transition-colors" />
                <span className="text-[10px] font-bold absolute -bottom-0.5 text-emerald-400">15</span>
              </button>

              {/* Big Synced Play Button */}
              <button
                onClick={handleTogglePlay}
                className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? 'หยุดชั่วคราว (Pause Spotify)' : 'เล่นต่อ (Play Spotify)'}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>

              {/* Forward 15s */}
              <button
                onClick={() => handleSeek(currentTime + 15)}
                className="p-3 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors relative flex items-center justify-center group"
                title="ข้ามไปข้างหน้า 15 วินาที"
              >
                <RotateCw className="w-6 h-6 group-hover:text-emerald-400 transition-colors" />
                <span className="text-[10px] font-bold absolute -bottom-0.5 text-emerald-400">15</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

