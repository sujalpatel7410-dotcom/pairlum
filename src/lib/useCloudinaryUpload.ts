import { useCallback, useState } from 'react';
import { uploadToCloudinary, CloudinaryUploadResult } from './cloudinary';

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<CloudinaryUploadResult | null> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    try {
      return await uploadToCloudinary(file, setProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { upload, isUploading, progress, error };
}
