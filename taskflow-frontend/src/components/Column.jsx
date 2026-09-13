import { useState } from "react";
import TaskCard from "./TaskCard";
import styles from "./Column.module.css";

export default function Column({ column, tasks, onMove }) {
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDrop(event) {
    event.preventDefault();
    setIsDragOver(false);
    const taskId = event.dataTransfer.getData("text/plain");
    if (taskId) onMove(taskId, column.key);
  }

  return (
    <section
      className={`${styles.column} ${isDragOver ? styles.dragOver : ""}`}
      aria-label={`${column.label} column, ${tasks.length} tasks`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <header className={styles.header}>
        <h3 className={styles.title}>{column.label}</h3>
        <span className={styles.count}>{tasks.length}</span>
      </header>
      <ul className={styles.list}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onMove={onMove} />
        ))}
        {tasks.length === 0 && <li className={styles.emptyHint}>No tasks here yet.</li>}
      </ul>
    </section>
  );
}
