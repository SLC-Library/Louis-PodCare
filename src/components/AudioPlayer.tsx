import React, { useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  Headphones,
  Maximize2,
  Minimize2,
  Radio,
  Sparkles,
  Tv,
  X,
} from 'lucide-react';
import { extractSpotifyInfo, extractYoutubeId, isAudioOnlyPodcast } from '../data/podcasts';
import { PodcastItem } from '../types';

interface AudioPlayerProps {
  podcast: PodcastItem | null;
  initialMode?: 'video' | 'audio';
  onClose: () => void;
  isDark?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  podcast,
  initialMode = 'audio',
  onClose,
  isDark = true,
}) => {
  const [isPipVideo, setIsPipVideo] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const youtubeId = podcast ? extractYoutubeId(podcast.youtubeId || podcast.youtubeUrl) : '';
  const isVideo = !!youtubeId;
  const isAudio = isAudioOnlyPodcast(podcast || ({} as PodcastItem)) || !isVideo;

  // Spotify info extraction
  const rawSpotifyInput = podcast?.spotifyEmbedUrl || podcast?.spotifyUrl;
  const spotifyInfo = extractSpotifyInfo(rawSpotifyInput);
  const spotifyEmbedUrl =
    podcast?.spotifyEmbedUrl ||
    spotifyInfo?.embedUrl ||
    (podcast?.spotifyUrl
      ? podcast.spotifyUrl.replace('open.spotify.com/', 'open.spotify.com/embed/')
      : '');

  // Reset states when podcast changes
  useEffect(() => {
    setIsPipVideo(false);
  }, [podcast?.id]);

  if (!podcast) return null;

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
  // 🎧 2. SPOTIFY / AUDIO PODCAST FULL MODAL PLAYER (DIRECT ON CLICK)
  // =========================================================================
  return (
    <div
      id="spotify-audio-full-modal"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      {/* Native MP3 Audio fallback if audioUrl is present */}
      {podcast.audioUrl && (
        <audio ref={audioRef} src={podcast.audioUrl} autoPlay />
      )}

      <div
        className={`w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl border transition-all ${
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
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="ปิดเครื่องเล่น (Close)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Spotify Official Player Embed Frame */}
        {spotifyEmbedUrl ? (
          <div className="mb-5 rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30 bg-black/80 p-1.5">
            <iframe
              title={`Spotify Player - ${podcast.title}`}
              src={spotifyEmbedUrl}
              width="100%"
              height="232"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="w-full rounded-xl"
            />
          </div>
        ) : (
          /* Custom Cover View if no spotifyEmbedUrl */
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col items-center justify-center p-8 mb-5 bg-slate-900/60">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-emerald-500/30 mb-3">
              <img
                src={podcast.imageUrl}
                alt={podcast.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              <span>เครื่องเล่นพอดแคสต์เสียง</span>
            </p>
          </div>
        )}

        {/* Episode Title & Details */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {podcast.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-medium">
              {podcast.institution || podcast.channel}
            </span>
            {podcast.duration && (
              <>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-400 font-mono">
                  {podcast.duration}
                </span>
              </>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold leading-snug text-slate-100">
            {podcast.title}
          </h3>

          {podcast.description && (
            <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 leading-relaxed max-h-36 overflow-y-auto">
              {podcast.description}
            </p>
          )}
        </div>

        {/* Footer info & Spotify action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>กดปุ่ม Play บนกล่อง Spotify ด้านบนเพื่อเริ่มฟังได้ทันที</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

