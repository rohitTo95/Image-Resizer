import {
  resizeImageOnCanvas,
  canvasToBlob,
  resolveOutputMime,
  resolveOutputQuality,
  resolveOutputExtension,
  calculateProportionalDimensions,
} from './resize';

export async function processImage(imageData, targetWidth, targetHeight, settings) {
  const { cropEnabled, webpEnabled, webpMode, webpQuality } = settings;

  const dims = cropEnabled
    ? { width: targetWidth, height: targetHeight }
    : calculateProportionalDimensions(imageData.width, imageData.height, targetWidth, targetHeight);

  const { canvas, width, height } = await resizeImageOnCanvas(
    imageData.file,
    targetWidth,
    targetHeight,
    cropEnabled,
  );

  const mimeType = resolveOutputMime(imageData.type, webpEnabled);
  const quality = resolveOutputQuality(webpEnabled, webpMode, webpQuality);
  const blob = await canvasToBlob(canvas, mimeType, quality);
  const outputName = resolveOutputExtension(mimeType, imageData.name);

  return {
    id: imageData.id,
    name: outputName,
    blob,
    width,
    height,
    size: blob.size,
    mimeType,
  };
}

export async function processBatch(images, targetWidth, targetHeight, settings, onProgress) {
  const results = [];

  for (let i = 0; i < images.length; i++) {
    try {
      const result = await processImage(images[i], targetWidth, targetHeight, settings);
      results.push({ ...result, success: true });
    } catch (err) {
      results.push({ id: images[i].id, name: images[i].name, success: false, error: err.message });
    }
    if (onProgress) onProgress(i + 1, images.length);
    await new Promise((r) => setTimeout(r, 0));
  }

  return results;
}

export async function generatePreview(imageData, targetWidth, targetHeight, settings) {
  const processed = await processImage(imageData, targetWidth, targetHeight, settings);

  const originalUrl = imageData.thumbnail;
  const processedUrl = URL.createObjectURL(processed.blob);

  const reduction = ((imageData.size - processed.size) / imageData.size) * 100;

  return {
    originalUrl,
    processedUrl,
    original: {
      width: imageData.width,
      height: imageData.height,
      size: imageData.size,
      name: imageData.name,
    },
    processed: {
      width: processed.width,
      height: processed.height,
      size: processed.size,
      name: processed.name,
    },
    reduction: Math.max(0, reduction),
    processedBlob: processed.blob,
  };
}
