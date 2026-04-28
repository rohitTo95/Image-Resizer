import { useState } from 'react';
import { useImageContext } from '../../context/ImageContext';
import { formatBytes } from '../../utils/image/metadata';
import { generatePreview } from '../../utils/image/convert';
import { downloadBlob } from '../../utils/image/export';
import styles from './PreviewPanel.module.css';

export default function PreviewPanel({ group }) {
  const { settings, customResize, processedImages } = useImageContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewData, setPreviewData] = useState(null);
  const [generating, setGenerating] = useState(false);

  const processed = group ? processedImages[group.id] : null;
  const activeImage = group?.images[activeIndex];
  const activeProcessed = processed?.[activeIndex];

  async function loadPreview(img) {
    const tw = parseInt(customResize.width, 10);
    const th = parseInt(customResize.height, 10);
    if (!tw || !th) return;

    setGenerating(true);
    try {
      const data = await generatePreview(img, tw, th, settings);
      setPreviewData(data);
    } finally {
      setGenerating(false);
    }
  }

  if (!group) return null;

  const hasProcessed = processed && processed.length > 0;

  return (
    <div className={styles.panel}>
      {/* Image selector strip */}
      {group.images.length > 1 && (
        <div className={styles.strip}>
          {group.images.map((img, i) => (
            <button
              key={img.id}
              className={`${styles.stripThumb} ${activeIndex === i ? styles.stripActive : ''}`}
              onClick={() => { setActiveIndex(i); setPreviewData(null); }}
              aria-label={img.name}
              title={img.name}
            >
              <img src={img.thumbnail} alt={img.name} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* Comparison view */}
      {activeImage && (
        <div className={styles.compare}>
          <div className={styles.side}>
            <div className={styles.sideLabel}>Original</div>
            <div className={styles.imgBox}>
              <img src={activeImage.thumbnail} alt="Original" className={styles.img} />
            </div>
            <div className={styles.sideMeta}>
              <span className={styles.dims}>{activeImage.width} × {activeImage.height}</span>
              <span className={styles.fileSize}>{formatBytes(activeImage.size)}</span>
            </div>
          </div>

          <div className={styles.divider}>
            <ArrowsIcon />
          </div>

          <div className={styles.side}>
            <div className={styles.sideLabel}>Processed</div>
            <div className={styles.imgBox}>
              {generating && <div className={styles.placeholder}><span className={styles.spinner} /></div>}
              {!generating && (hasProcessed && activeProcessed?.success) && (
                <img
                  src={URL.createObjectURL(activeProcessed.blob)}
                  alt="Processed"
                  className={styles.img}
                />
              )}
              {!generating && !hasProcessed && (
                <button className={styles.generateBtn} onClick={() => loadPreview(activeImage)}>
                  Generate preview
                </button>
              )}
            </div>
            {hasProcessed && activeProcessed?.success && (
              <div className={styles.sideMeta}>
                <span className={styles.dims}>{activeProcessed.width} × {activeProcessed.height}</span>
                <span className={styles.fileSize}>{formatBytes(activeProcessed.size)}</span>
                {activeProcessed.size < activeImage.size && (
                  <span className={styles.reduction}>
                    -{Math.round((1 - activeProcessed.size / activeImage.size) * 100)}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats summary */}
      {hasProcessed && (
        <div className={styles.stats}>
          <StatItem
            label="Images"
            value={`${processed.filter((p) => p.success).length} / ${processed.length}`}
          />
          <StatItem
            label="Original total"
            value={formatBytes(group.images.reduce((a, i) => a + i.size, 0))}
          />
          <StatItem
            label="Output total"
            value={formatBytes(processed.reduce((a, p) => a + (p.size || 0), 0))}
          />
          <StatItem
            label="Saved"
            value={(() => {
              const orig = group.images.reduce((a, i) => a + i.size, 0);
              const out = processed.reduce((a, p) => a + (p.size || 0), 0);
              const pct = Math.round((1 - out / orig) * 100);
              return pct > 0 ? `${pct}%` : '—';
            })()}
          />
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className={styles.statItem}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

function ArrowsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
