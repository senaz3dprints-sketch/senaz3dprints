import fs from 'fs';
import path from 'path';

const ALLOWED_3D_EXTENSIONS = ['.stl', '.obj', '.3mf', '.step', '.stp', '.gcode'];
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const MAX_3D_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  error?: string;
}

export async function saveUploadedFile(file: File, category: '3d-models' | 'images'): Promise<UploadResult> {
  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  const extension = path.extname(file.name).toLowerCase();

  // Validate extension
  if (category === '3d-models' && !ALLOWED_3D_EXTENSIONS.includes(extension)) {
    return {
      success: false,
      error: `Invalid file format. Allowed 3D extensions: ${ALLOWED_3D_EXTENSIONS.join(', ')}`,
    };
  }

  if (category === 'images' && !ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
    return {
      success: false,
      error: `Invalid image format. Allowed extensions: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
    };
  }

  // Validate file size limit
  const maxSize = category === '3d-models' ? MAX_3D_FILE_SIZE : MAX_IMAGE_FILE_SIZE;
  if (file.size > maxSize) {
    const sizeInMb = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      success: false,
      error: `File size exceeds maximum limit of ${sizeInMb}MB.`,
    };
  }

  // Create target folder
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate safe filename without path traversal risk
  const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const finalFileName = `${uniquePrefix}_${sanitizedOriginalName}`;
  const targetPath = path.join(uploadDir, finalFileName);

  // Write file buffer safely
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  fs.writeFileSync(targetPath, buffer);

  const fileUrl = `/uploads/${category}/${finalFileName}`;

  return {
    success: true,
    fileUrl,
    fileName: file.name,
  };
}
