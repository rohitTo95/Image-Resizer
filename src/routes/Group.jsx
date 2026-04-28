import { useParams, useNavigate, Link } from 'react-router-dom';
import { useImageContext } from '../context/ImageContext';
import GalleryView from '../components/GalleryView/GalleryView';
import ControlsPanel from '../components/ControlsPanel/ControlsPanel';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import styles from './Group.module.css';

export default function Group() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { groups, processing, progress } = useImageContext();

  const groupId = decodeURIComponent(id);
  const group = groups[groupId];

  if (!group) {
    return (
      <div className={styles.notFound}>
        <p>Group not found.</p>
        <Link to="/" className={styles.backLink}>← Back to home</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.nav}>
          <button className={styles.back} onClick={() => navigate('/')} aria-label="Back to groups">
            <ArrowLeftIcon />
            <span className={styles.logo}>Resizer</span>
          </button>
          <div className={styles.breadcrumb}>
            <span className={styles.breadGroup}>
              {group.width} × {group.height}
            </span>
            <span className={styles.breadCount}>
              {group.images.length} image{group.images.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.layout}>
          {/* Left: Gallery */}
          <div className={styles.gallery}>
            <h2 className={styles.sectionTitle}>Images</h2>
            <GalleryView group={group} />
          </div>

          {/* Right: Controls */}
          <aside className={styles.controls}>
            <h2 className={styles.sectionTitle}>Resize</h2>

            {processing && (
              <div className={styles.progress}>
                <ProgressBar
                  current={progress.current}
                  total={progress.total}
                  label="Processing..."
                />
              </div>
            )}

            <ControlsPanel group={group} />
          </aside>
        </div>
      </main>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
