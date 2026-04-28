import JSZip from 'jszip';

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAsZip(processedImages, zipName = 'resized-images.zip') {
  const zip = new JSZip();
  const folder = zip.folder('resized');

  for (const img of processedImages) {
    if (img.success && img.blob) {
      folder.file(img.name, img.blob);
    }
  }

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  downloadBlob(content, zipName);
}

export async function downloadGroupAsZip(groupId, processedImages) {
  const safeId = groupId.replace(/[^a-z0-9]/gi, '_');
  await downloadAsZip(processedImages, `group_${safeId}.zip`);
}

export async function downloadAllAsZip(allProcessed) {
  const zip = new JSZip();

  for (const [groupId, images] of Object.entries(allProcessed)) {
    const safeId = groupId.replace(/[^a-z0-9]/gi, '_');
    const folder = zip.folder(safeId);
    for (const img of images) {
      if (img.success && img.blob) {
        folder.file(img.name, img.blob);
      }
    }
  }

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  downloadBlob(content, 'all-resized-images.zip');
}
