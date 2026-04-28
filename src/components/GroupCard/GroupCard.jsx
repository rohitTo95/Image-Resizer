import { useNavigate } from 'react-router-dom';
import { useImageContext } from '../../context/ImageContext';
import { formatBytes } from '../../utils/image/metadata';
import { getGroupStats } from '../../utils/image/grouping';
import styles from './GroupCard.module.css';

export default function GroupCard({ group }) {
  const navigate = useNavigate();
  const { setSelectedGroup } = useImageContext();
  const stats = getGroupStats(group);
  const preview = group.images.slice(0, 3);

  function handleClick() {
    setSelectedGroup(group.id);
    navigate(`/group/${encodeURIComponent(group.id)}`);
  }

  return (
    <article
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Group ${group.width}×${group.height}, ${stats.count} image${stats.count !== 1 ? 's' : ''}`}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className={styles.thumbnails}>
        {preview.map((img, i) => (
          <img
            key={img.id}
            src={img.thumbnail}
            alt={img.name}
            className={styles.thumb}
            style={{ zIndex: preview.length - i }}
            loading="lazy"
          />
        ))}
        {group.images.length > 3 && (
          <div className={styles.overflow}>+{group.images.length - 3}</div>
        )}
      </div>

      <div className={styles.info}>
        <p className={styles.dimensions}>
          {group.width}<span className={styles.x}>×</span>{group.height}
        </p>
        <p className={styles.ratio}>{stats.aspectRatio}</p>
        <div className={styles.footer}>
          <span className={styles.count}>
            {stats.count} {stats.count === 1 ? 'image' : 'images'}
          </span>
          <span className={styles.size}>{formatBytes(stats.totalSize)}</span>
        </div>
      </div>

      <ChevronIcon className={styles.chevron} />
    </article>
  );
}

function ChevronIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
