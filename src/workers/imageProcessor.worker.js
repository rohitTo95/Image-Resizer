function calcProportional(origW, origH, targetW, targetH) {
  const scale = Math.min(targetW / origW, targetH / origH);
  return {
    width: Math.round(origW * scale),
    height: Math.round(origH * scale),
  };
}

async function processOne(item, settings) {
  const { buffer, mimeType, name, targetWidth, targetHeight } = item;
  const { cropEnabled, webpEnabled, webpMode, webpQuality } = settings;

  const blob = new Blob([buffer], { type: mimeType });
  const bitmap = await createImageBitmap(blob);
  const origW = bitmap.width;
  const origH = bitmap.height;

  let canvasW, canvasH, drawX = 0, drawY = 0, drawW, drawH;

  if (cropEnabled) {
    canvasW = targetWidth;
    canvasH = targetHeight;
    const scale = Math.max(targetWidth / origW, targetHeight / origH);
    drawW = origW * scale;
    drawH = origH * scale;
    drawX = (canvasW - drawW) / 2;
    drawY = (canvasH - drawH) / 2;
  } else {
    const dims = calcProportional(origW, origH, targetWidth, targetHeight);
    canvasW = dims.width;
    canvasH = dims.height;
    drawW = canvasW;
    drawH = canvasH;
  }

  const canvas = new OffscreenCanvas(canvasW, canvasH);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, drawX, drawY, drawW, drawH);
  bitmap.close();

  let outputMime = mimeType;
  let quality;

  if (webpEnabled) {
    outputMime = 'image/webp';
    if (webpMode === 'lossless') quality = 1.0;
    else if (webpMode === 'high') quality = 0.92;
    else quality = webpQuality / 100;
  } else {
    quality = mimeType === 'image/png' ? undefined : 0.92;
  }

  const outputBlob = await canvas.convertToBlob({ type: outputMime, quality });

  const ext = outputMime === 'image/webp' ? '.webp' : outputMime === 'image/png' ? '.png' : '.jpg';
  const outputName = name.replace(/\.[^.]+$/, '') + ext;

  return {
    name: outputName,
    blob: outputBlob,
    width: canvasW,
    height: canvasH,
    size: outputBlob.size,
  };
}

self.onmessage = async ({ data }) => {
  const { type, payload } = data;

  if (type !== 'PROCESS_BATCH') return;

  const { items, settings } = payload;
  const results = [];

  for (let i = 0; i < items.length; i++) {
    try {
      const result = await processOne(items[i], settings);
      results.push({ id: items[i].id, success: true, ...result });
    } catch (err) {
      results.push({ id: items[i].id, name: items[i].name, success: false, error: err.message });
    }

    self.postMessage({ type: 'PROGRESS', payload: { current: i + 1, total: items.length } });
  }

  self.postMessage({ type: 'COMPLETE', payload: { results } });
};
