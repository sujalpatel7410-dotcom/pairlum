// Uploads a file straight from the browser to Cloudinary using an unsigned upload
// preset. Pairlum has no backend (see n8n/README.md), so this is the only way to
// get user media into the cloud without standing up a server to sign requests.

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  resourceType: string;
}

function getConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  return { cloudName, uploadPreset };
}

export function isCloudinaryConfigured(): boolean {
  const { cloudName, uploadPreset } = getConfig();
  return Boolean(cloudName && uploadPreset);
}

export function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  const { cloudName, uploadPreset } = getConfig();
  if (!cloudName || !uploadPreset) {
    return Promise.reject(new Error(
      'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.'
    ));
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    // "auto" lets Cloudinary route the file to its image or video pipeline.
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            secureUrl: response.secure_url,
            publicId: response.public_id,
            resourceType: response.resource_type
          });
        } catch {
          reject(new Error('Cloudinary returned an unexpected response.'));
        }
      } else {
        reject(new Error(`Cloudinary upload failed (${xhr.status}). Check your cloud name and upload preset.`));
      }
    };

    xhr.onerror = () => reject(new Error('Cloudinary upload failed: network error.'));
    xhr.send(formData);
  });
}

// Cloudinary derives a poster frame for a video by swapping its extension for
// .jpg on the same delivery URL — no separate upload or transformation needed.
export function cloudinaryVideoThumbnail(videoSecureUrl: string): string {
  return videoSecureUrl.replace(/\.\w+(\?.*)?$/, '.jpg');
}
