export function calculateProportionalDimensions(origWidth, origHeight, targetWidth, targetHeight) {
  const widthRatio = targetWidth / origWidth;
  const heightRatio = targetHeight / origHeight;
  const scale = Math.min(widthRatio, heightRatio);
  return {
    width: Math.round(origWidth * scale),
    height: Math.round(origHeight * scale),
    scale,
  };
}

export function calculateFromWidth(origWidth, origHeight, targetWidth) {
  const scale = targetWidth / origWidth;
  return {
    width: Math.round(targetWidth),
    height: Math.round(origHeight * scale),
    scale,
  };
}

export function calculateFromHeight(origWidth, origHeight, targetHeight) {
  const scale = targetHeight / origHeight;
  return {
    width: Math.round(origWidth * scale),
    height: Math.round(targetHeight),
    scale,
  };
}

export async function resizeImageOnCanvas(file, targetWidth, targetHeight, cropEnabled = false) {
  const imageBitmap = await createImageBitmap(file);
  const origWidth = imageBitmap.width;
  const origHeight = imageBitmap.height;

  let canvasW, canvasH, drawX = 0, drawY = 0, drawW, drawH;

  if (cropEnabled) {
    canvasW = targetWidth;
    canvasH = targetHeight;
    const scale = Math.max(targetWidth / origWidth, targetHeight / origHeight);
    drawW = origWidth * scale;
    drawH = origHeight * scale;
    drawX = (targetWidth - drawW) / 2;
    drawY = (targetHeight - drawH) / 2;
  } else {
    const dims = calculateProportionalDimensions(origWidth, origHeight, targetWidth, targetHeight);
    canvasW = dims.width;
    canvasH = dims.height;
    drawW = canvasW;
    drawH = canvasH;
  }

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(imageBitmap, drawX, drawY, drawW, drawH);
  imageBitmap.close();

  return { canvas, width: canvasW, height: canvasH };
}

export function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      },
      mimeType,
      quality,
    );
  });
}

export function resolveOutputMime(originalType, webpEnabled) {
  if (webpEnabled) return 'image/webp';
  return originalType === 'image/png' ? 'image/png' : 'image/jpeg';
}

export function resolveOutputQuality(webpEnabled, webpMode, webpQuality) {
  if (!webpEnabled) return 0.92;
  if (webpMode === 'lossless') return 1.0;
  if (webpMode === 'high') return 0.92;
  return webpQuality / 100;
}

export function resolveOutputExtension(mimeType, originalName) {
  const base = originalName.replace(/\.[^.]+$/, '');
  if (mimeType === 'image/webp') return `${base}.webp`;
  if (mimeType === 'image/png') return `${base}.png`;
  return `${base}.jpg`;
}
