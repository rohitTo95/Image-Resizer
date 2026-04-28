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
        <a
          href="https://github.com/rohitTo95"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          <GitHubIcon />
          rohitTo95
        </a>
      </footer>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
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
