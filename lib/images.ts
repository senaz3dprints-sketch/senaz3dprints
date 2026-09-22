/**
 * Image normalization utility to convert Google Drive, Dropbox,
 * and direct links into standard web-renderable image URLs.
 */

export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // 1. Google Drive URLs
  // Matches:
  // - https://drive.google.com/file/d/FILE_ID/view...
  // - https://drive.google.com/open?id=FILE_ID
  // - https://drive.google.com/uc?id=FILE_ID
  // - https://drive.google.com/thumbnail?id=FILE_ID
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  // 2. Dropbox URLs
  if (trimmed.includes('dropbox.com')) {
    return trimmed.replace('dl=0', 'raw=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  }

  return trimmed;
}

export function parseImageList(rawImages: any): string[] {
  let list: string[] = [];
  try {
    if (Array.isArray(rawImages)) {
      list = rawImages;
    } else if (typeof rawImages === 'string') {
      const parsed = JSON.parse(rawImages);
      list = Array.isArray(parsed) ? parsed : [rawImages];
    }
  } catch {
    if (typeof rawImages === 'string') {
      list = rawImages.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  const normalized = list.map(normalizeImageUrl).filter(Boolean);
  return normalized.length > 0
    ? normalized
    : ['https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'];
}
