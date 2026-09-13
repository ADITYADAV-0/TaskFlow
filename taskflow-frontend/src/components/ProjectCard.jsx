import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project }) {
  const progress = project.taskCount ? Math.round((project.doneCount / project.taskCount) * 100) : 0;

  return (
    <Link to={`/projects/${project.id}`} className={`card ${styles.card}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{project.name}</h3>
        <div className={styles.avatars}>
          {project.members.slice(0, 3).map((m) => (
            <Avatar key={m.id} user={m} size={24} />
          ))}
        </div>
      </div>
      <p className={styles.description}>{project.description}</p>
      <div className={styles.footer}>
        <div className={styles.progressTrack} role="img" aria-label={`${progress}% of tasks done`}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.progressLabel}>
          {project.doneCount}/{project.taskCount} done
        </span>
      </div>
    </Link>
  );
}
