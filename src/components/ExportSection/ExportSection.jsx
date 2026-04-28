import { useState } from 'react';
import { useImageContext } from '../../context/ImageContext';
import { downloadBlob, downloadGroupAsZip, downloadAllAsZip } from '../../utils/image/export';
import { formatBytes } from '../../utils/image/metadata';
import styles from './ExportSection.module.css';

export default function ExportSection({ group }) {
  const { processedImages } = useImageContext();
  const [exporting, setExporting] = useState(false);

  const processed = group ? processedImages[group.id] : null;
  const successful = processed?.filter((p) => p.success && p.blob) || [];

  const allProcessed = processedImages;
  const allSuccessful = Object.values(allProcessed)
    .flat()
    .filter((p) => p.success && p.blob);

  async function handleGroupZip() {
    if (!group || successful.length === 0) return;
    setExporting(true);
    try {
      await downloadGroupAsZip(group.id, successful);
    } finally {
      setExporting(false);
    }
  }

  async function handleAllZip() {
    if (allSuccessful.length === 0) return;
    setExporting(true);
    try {
      await downloadAllAsZip(allProcessed);
    } finally {
      setExporting(false);
    }
  }

  function handleSingle(img) {
    downloadBlob(img.blob, img.name);
  }

  if (successful.length === 0 && allSuccessful.length === 0) return null;

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Export</h3>

      {/* Individual downloads */}
      {successful.length > 0 && (
        <div className={styles.list}>
          <p className={styles.listLabel}>Individual files</p>
          {successful.map((img) => (
            <div key={img.id} className={styles.row}>
              <span className={styles.fileName} title={img.name}>{img.name}</span>
              <span className={styles.meta}>
                {img.width}×{img.height} · {formatBytes(img.size)}
              </span>
              <button
                className={styles.dlBtn}
                onClick={() => handleSingle(img)}
                aria-label={`Download ${img.name}`}
              >
                <DownloadIcon />
                Download
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bulk actions */}
      <div className={styles.actions}>
        {successful.length > 1 && (
          <button
            className={styles.actionBtn}
            onClick={handleGroupZip}
            disabled={exporting}
            aria-busy={exporting}
          >
            <ZipIcon />
            Download group ({successful.length} files)
          </button>
        )}

        {allSuccessful.length > successful.length && (
          <button
            className={`${styles.actionBtn} ${styles.primaryBtn}`}
            onClick={handleAllZip}
            disabled={exporting}
            aria-busy={exporting}
          >
            <ZipIcon />
            Download all ({allSuccessful.length} files)
          </button>
        )}
      </div>

      {exporting && <p className={styles.exportingMsg}>Preparing ZIP...</p>}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ZipIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}
