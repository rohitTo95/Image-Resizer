import { useState } from 'react';
import { useImageContext } from '../../context/ImageContext';
import { formatBytes } from '../../utils/image/metadata';
import styles from './GalleryView.module.css';

export default function GalleryView({ group }) {
  const { removeImage } = useImageContext();
  const [selected, setSelected] = useState(null);

  if (!group) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {group.images.map((img) => (
          <figure
            key={img.id}
            className={`${styles.item} ${selected === img.id ? styles.active : ''}`}
            onClick={() => setSelected(selected === img.id ? null : img.id)}
            tabIndex={0}
            role="button"
            aria-label={`${img.name} — ${img.width}×${img.height}`}
            onKeyDown={(e) => e.key === 'Enter' && setSelected(selected === img.id ? null : img.id)}
          >
            <div className={styles.imgWrapper}>
              <img src={img.thumbnail} alt={img.name} className={styles.img} loading="lazy" />
            </div>
            <figcaption className={styles.caption}>
              <span className={styles.name} title={img.name}>{img.name}</span>
              <span className={styles.meta}>{formatBytes(img.size)}</span>
            </figcaption>
            <button
              className={styles.remove}
              onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
              aria-label={`Remove ${img.name}`}
              title="Remove"
            >
              <XIcon />
            </button>
          </figure>
        ))}
      </div>

      {selected && (() => {
        const img = group.images.find((i) => i.id === selected);
        if (!img) return null;
        return (
          <div className={styles.detail} role="region" aria-label="Image details">
            <img src={img.thumbnail} alt={img.name} className={styles.detailImg} />
            <div className={styles.detailInfo}>
              <p className={styles.detailName}>{img.name}</p>
              <dl className={styles.dl}>
                <dt>Dimensions</dt><dd>{img.width} × {img.height}</dd>
                <dt>Aspect ratio</dt><dd>{img.aspectRatio}</dd>
                <dt>File size</dt><dd>{formatBytes(img.size)}</dd>
                <dt>Format</dt><dd>{img.type}</dd>
              </dl>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
