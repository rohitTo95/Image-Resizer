const ASPECT_RATIO_PRESETS = {
  '16:9': [
    { width: 3840, height: 2160, label: '4K UHD' },
    { width: 2560, height: 1440, label: '2K QHD' },
    { width: 1920, height: 1080, label: 'Full HD' },
    { width: 1280, height: 720, label: 'HD' },
    { width: 854, height: 480, label: '480p' },
    { width: 640, height: 360, label: '360p' },
  ],
  '4:3': [
    { width: 1600, height: 1200, label: 'UXGA' },
    { width: 1280, height: 960, label: 'SXGA-' },
    { width: 1024, height: 768, label: 'XGA' },
    { width: 800, height: 600, label: 'SVGA' },
    { width: 640, height: 480, label: 'VGA' },
  ],
  '1:1': [
    { width: 2048, height: 2048, label: '2048px' },
    { width: 1080, height: 1080, label: '1080px (Instagram)' },
    { width: 800, height: 800, label: '800px' },
    { width: 512, height: 512, label: '512px' },
    { width: 256, height: 256, label: '256px' },
  ],
  '3:2': [
    { width: 2400, height: 1600, label: '2400×1600' },
    { width: 1800, height: 1200, label: '1800×1200' },
    { width: 1200, height: 800, label: '1200×800' },
    { width: 900, height: 600, label: '900×600' },
  ],
  '2:3': [
    { width: 1600, height: 2400, label: '1600×2400' },
    { width: 1200, height: 1800, label: '1200×1800' },
    { width: 800, height: 1200, label: '800×1200' },
    { width: 600, height: 900, label: '600×900' },
  ],
  '9:16': [
    { width: 1080, height: 1920, label: '1080×1920 (Story)' },
    { width: 720, height: 1280, label: '720×1280' },
    { width: 540, height: 960, label: '540×960' },
  ],
};

const PERCENTAGE_OPTIONS = [100, 75, 50, 25];

function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

function normalizeAspectRatio(w, h) {
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
}

export function getSuggestedSizes(group) {
  const { width, height } = group;
  const ratio = normalizeAspectRatio(width, height);

  const percentages = PERCENTAGE_OPTIONS.map((pct) => ({
    type: 'percentage',
    label: `${pct}%`,
    sublabel: pct === 100 ? 'Original size' : `${Math.round(width * pct / 100)} × ${Math.round(height * pct / 100)}`,
    width: Math.round(width * pct / 100),
    height: Math.round(height * pct / 100),
    percentage: pct,
  }));

  const presets = (ASPECT_RATIO_PRESETS[ratio] || [])
    .filter((p) => p.width <= width && p.height <= height)
    .map((p) => ({
      type: 'preset',
      label: p.label,
      sublabel: `${p.width} × ${p.height}`,
      width: p.width,
      height: p.height,
    }));

  return { percentages, presets, ratio };
}

export function getGroupStats(group) {
  const totalSize = group.images.reduce((acc, img) => acc + img.size, 0);
  return {
    count: group.images.length,
    totalSize,
    dimensions: `${group.width} × ${group.height}`,
    aspectRatio: normalizeAspectRatio(group.width, group.height),
  };
}
