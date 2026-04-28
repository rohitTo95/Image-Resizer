import { useImageContext } from '../context/ImageContext';
import UploadZone from '../components/UploadZone/UploadZone';
import GroupGrid from '../components/GroupGrid/GroupGrid';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import styles from './Home.module.css';

export default function Home() {
  const { images, groups, processing, progress } = useImageContext();
  const hasGroups = Object.keys(groups).length > 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.nav}>
          <h1 className={styles.logo}>Resizer</h1>
          <p className={styles.tagline}>Client-side · Private · Fast</p>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.upload}>
          <UploadZone />
        </section>

        {processing && (
          <div className={styles.progress}>
            <ProgressBar
              current={progress.current}
              total={progress.total}
              label="Processing images..."
            />
          </div>
        )}

        {hasGroups && (
          <section className={styles.groups}>
            <GroupGrid groups={groups} />
          </section>
        )}

        {!hasGroups && images.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              Upload images to get started. They're grouped automatically by dimensions.
            </p>
            <ul className={styles.features}>
              <li><CheckIcon />No server upload — fully private</li>
              <li><CheckIcon />Bulk processing with Web Workers</li>
              <li><CheckIcon />Strict mode: never crops by default</li>
              <li><CheckIcon />WebP conversion with quality control</li>
            </ul>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>All processing happens in your browser. No images are uploaded anywhere.</p>
      </footer>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
