/**
 * Utility to parse and format product videos (YouTube, Shorts, Google Drive, MP4/WebM).
 */

export interface ParsedVideo {
  type: 'youtube' | 'drive' | 'direct';
  embedUrl: string;
  originalUrl: string;
}

export function parseProductVideo(url: string | null | undefined): ParsedVideo | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // 1. YouTube (Standard, Shorts, youtu.be)
  // Matches:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  // - https://youtube.com/embed/VIDEO_ID
  const youtubeMatch =
    trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/i);

  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
      originalUrl: trimmed,
    };
  }

  // 2. Google Drive Video
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    const driveMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      return {
        type: 'drive',
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        originalUrl: trimmed,
      };
    }
  }

  // 3. Direct Video File (.mp4, .webm, .mov, /uploads/...)
  return {
    type: 'direct',
    embedUrl: trimmed,
    originalUrl: trimmed,
  };
}
