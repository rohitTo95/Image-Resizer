import GroupCard from '../GroupCard/GroupCard';
import styles from './GroupGrid.module.css';

export default function GroupGrid({ groups }) {
  const groupList = Object.values(groups);

  if (groupList.length === 0) return null;

  return (
    <section className={styles.section} aria-label="Image groups">
      <header className={styles.header}>
        <h2 className={styles.title}>Groups</h2>
        <span className={styles.subtitle}>
          {groupList.length} dimension group{groupList.length !== 1 ? 's' : ''} detected
        </span>
      </header>
      <div className={styles.grid}>
        {groupList.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
}
