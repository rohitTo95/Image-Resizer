import styles from './ProgressBar.module.css';

export default function ProgressBar({ current, total, label }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={styles.wrapper} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles.header}>
        <span className={styles.label}>{label || 'Processing...'}</span>
        <span className={styles.count}>{current} / {total}</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.pct}>{pct}%</span>
    </div>
  );
}
