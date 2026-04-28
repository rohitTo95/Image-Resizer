import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useImageContext } from '../context/ImageContext';
import PreviewPanel from '../components/PreviewPanel/PreviewPanel';
import ExportSection from '../components/ExportSection/ExportSection';
import styles from './Preview.module.css';

export default function Preview() {
  const navigate = useNavigate();
  const { groups, processedImages, selectedGroup } = useImageContext();
  const [activeGroupId, setActiveGroupId] = useState(
    selectedGroup || Object.keys(processedImages)[0] || null,
  );

  const groupIds = Object.keys(processedImages).filter((id) => groups[id]);
  const activeGroup = groups[activeGroupId];

  if (groupIds.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No processed images yet.</p>
        <Link to="/" className={styles.backLink}>← Go back and process some images</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.nav}>
          <button className={styles.back} onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeftIcon />
            <span className={styles.logo}>Resizer</span>
          </button>
          <span className={styles.pageTitle}>Preview &amp; Export</span>
        </div>
      </header>

      <main className={styles.main}>
        {/* Group tabs */}
        {groupIds.length > 1 && (
          <nav className={styles.tabs} aria-label="Processed groups">
            {groupIds.map((id) => {
              const g = groups[id];
              if (!g) return null;
              return (
                <button
                  key={id}
                  className={`${styles.tab} ${activeGroupId === id ? styles.tabActive : ''}`}
                  onClick={() => setActiveGroupId(id)}
                  aria-current={activeGroupId === id ? 'page' : undefined}
                >
                  {g.width} × {g.height}
                  <span className={styles.tabCount}>
                    {processedImages[id]?.filter((p) => p.success).length}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        <div className={styles.content}>
          <div className={styles.previewCol}>
            <h2 className={styles.colTitle}>Comparison</h2>
            <PreviewPanel group={activeGroup} />
          </div>

          <aside className={styles.exportCol}>
            <h2 className={styles.colTitle}>Export</h2>
            <ExportSection group={activeGroup} />
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
