import { useRef, useState, useCallback } from 'react';
import { useImageContext } from '../../context/ImageContext';
import { extractBatch, isSupportedFile } from '../../utils/image/metadata';
import styles from './UploadZone.module.css';

const ACCEPT = '.jpg,.jpeg,.png';

export default function UploadZone() {
  const { addImages, images, clearAll } = useImageContext();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const processFiles = useCallback(
    async (files) => {
      setError('');
      const valid = Array.from(files).filter(isSupportedFile);
      if (valid.length === 0) {
        setError('No supported images found. Please upload JPG or PNG files.');
        return;
      }
      if (valid.length < files.length) {
        setError(`${files.length - valid.length} file(s) skipped — unsupported format.`);
      }
      setLoading(true);
      try {
        const metadata = await extractBatch(valid);
        addImages(metadata);
      } catch {
        setError('Failed to process some images. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [addImages],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
  };

  const handleChange = (e) => {
    if (e.target.files?.length) processFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <section className={styles.wrapper}>
      <div
        className={`${styles.zone} ${dragging ? styles.dragging : ''} ${loading ? styles.loading : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !loading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload images — drag and drop or click to select"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          onChange={handleChange}
          className="visually-hidden"
          aria-hidden="true"
        />

        {loading ? (
          <div className={styles.loadingState}>
            <span className={styles.spinner} aria-hidden="true" />
            <p>Reading images...</p>
          </div>
        ) : (
          <div className={styles.idle}>
            <UploadIcon />
            <p className={styles.headline}>
              {images.length > 0 ? 'Drop more images' : 'Drop images here'}
            </p>
            <p className={styles.subtext}>or click to browse · JPG, JPEG, PNG</p>
          </div>
        )}
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className={styles.meta}>
          <span className={styles.count}>{images.length} image{images.length !== 1 ? 's' : ''} loaded</span>
          <button className={styles.clear} onClick={clearAll}>
            Clear all
          </button>
        </div>
      )}
    </section>
  );
}

function UploadIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
