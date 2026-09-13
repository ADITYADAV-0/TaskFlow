import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { formatDate, isOverdue } from "../hooks/useFormattedDate";
import styles from "./TaskCard.module.css";

const STATUS_ORDER = ["todo", "in_progress", "review", "done"];

export default function TaskCard({ task, onMove, draggable = true }) {
  const currentIndex = STATUS_ORDER.indexOf(task.status);
  const canMoveBack = currentIndex > 0;
  const canMoveForward = currentIndex < STATUS_ORDER.length - 1;
  const overdue = task.status !== "done" && isOverdue(task.dueDate);

  function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", task.id);
    event.dataTransfer.effectAllowed = "move";
  }

  return (
    <li
      className={styles.card}
      draggable={draggable}
      onDragStart={handleDragStart}
      aria-roledescription="Draggable task card"
    >
      <Link to={`/tasks/${task.id}`} className={styles.titleLink}>
        {task.title}
      </Link>

      <div className={styles.badges}>
        <span className={`badge badge-priority-${task.priority}`}>{task.priority}</span>
        {overdue && <span className="badge badge-priority-high">overdue</span>}
      </div>

      <div className={styles.footer}>
        <Avatar user={task.assignee} size={22} />
        {task.dueDate && <span className={styles.due}>Due {formatDate(task.dueDate)}</span>}
      </div>

      <div className={styles.moveControls}>
        <button
          type="button"
          className={styles.moveButton}
          onClick={() => onMove(task.id, STATUS_ORDER[currentIndex - 1])}
          disabled={!canMoveBack}
          aria-label={`Move "${task.title}" to previous column`}
        >
          {"\u2190"}
        </button>
        <button
          type="button"
          className={styles.moveButton}
          onClick={() => onMove(task.id, STATUS_ORDER[currentIndex + 1])}
          disabled={!canMoveForward}
          aria-label={`Move "${task.title}" to next column`}
        >
          {"\u2192"}
        </button>
      </div>
    </li>
  );
}
