const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

export function isSupportedFile(file) {
  return SUPPORTED_TYPES.includes(file.type) ||
    /\.(jpe?g|png)$/i.test(file.name);
}

export async function extractMetadata(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const divisor = gcd(w, h);

      resolve({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        type: file.type || 'image/jpeg',
        size: file.size,
        width: w,
        height: h,
        aspectRatio: `${w / divisor}:${h / divisor}`,
        aspectRatioDecimal: w / h,
        dimensionKey: `${w}x${h}`,
        thumbnail: url,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
}

export async function extractBatch(files) {
  const valid = Array.from(files).filter(isSupportedFile);
  const results = await Promise.allSettled(valid.map(extractMetadata));
  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatDimensions(w, h) {
  return `${w} × ${h}`;
}
