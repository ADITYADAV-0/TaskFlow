import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTask, getProject, updateTask, addComment } from "../data/api";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import { formatDate } from "../hooks/useFormattedDate";
import { STATUS_COLUMNS } from "../data/mockData";
import styles from "./TaskDetail.module.css";

export default function TaskDetail() {
  const { taskId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("loading");
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getTask(taskId)
      .then(async (taskData) => {
        if (cancelled) return;
        if (!taskData) {
          setStatus("not-found");
          return;
        }
        setTask(taskData);
        const projectData = await getProject(taskData.projectId);
        if (cancelled) return;
        setProject(projectData);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  async function handleFieldChange(field, value) {
    setTask((prev) => ({ ...prev, [field]: value }));
    await updateTask(taskId, { [field]: value });
  }

  async function handleAddComment(event) {
    event.preventDefault();
    if (!comment.trim()) return;
    setPosting(true);
    try {
      const updated = await addComment(taskId, { userId: user.id, content: comment.trim() });
      setTask(updated);
      setComment("");
    } finally {
      setPosting(false);
    }
  }

  if (status === "loading") return <p role="status">Loading task…</p>;
  if (status === "not-found") {
    return (
      <div>
        <p>We couldn't find that task. It may have been deleted.</p>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to dashboard
        </Link>
      </div>
    );
  }
  if (status === "error") {
    return (
      <p role="alert" className="form-error">
        Something went wrong loading this task.
      </p>
    );
  }

  return (
    <div className={styles.page}>
      <button className={styles.backLink} onClick={() => navigate(`/projects/${task.projectId}`)}>
        {"\u2190"} Back to {project?.name || "board"}
      </button>

      <div className={styles.layout}>
        <div className={styles.main}>
          <h1 className={styles.title}>{task.title}</h1>

          <div className={styles.metaRow}>
            <span className={`badge badge-status-${task.status}`}>
              {STATUS_COLUMNS.find((c) => c.key === task.status)?.label}
            </span>
            <span className={`badge badge-priority-${task.priority}`}>{task.priority} priority</span>
          </div>

          <section aria-labelledby="description-heading" className={styles.section}>
            <h2 id="description-heading" className={styles.sectionHeading}>
              Description
            </h2>
            <p className={styles.descriptionText}>{task.description || "No description yet."}</p>
          </section>

          <section aria-labelledby="comments-heading" className={styles.section}>
            <h2 id="comments-heading" className={styles.sectionHeading}>
              Comments ({task.comments.length})
            </h2>
            <ul className={styles.commentList}>
              {task.comments.map((c) => (
                <li key={c.id} className={styles.comment}>
                  <Avatar user={c.user} size={28} />
                  <div>
                    <div className={styles.commentMeta}>
                      <strong>{c.user?.name || "Unknown"}</strong>
                      <time dateTime={c.createdAt} className={styles.commentTime}>
                        {formatDate(c.createdAt)}
                      </time>
                    </div>
                    <p className={styles.commentBody}>{c.content}</p>
                  </div>
                </li>
              ))}
              {task.comments.length === 0 && <p className={styles.noComments}>No comments yet — be the first.</p>}
            </ul>

            <form onSubmit={handleAddComment} className={styles.commentForm}>
              <label htmlFor="new-comment" className="visually-hidden">
                Write a comment
              </label>
              <textarea
                id="new-comment"
                rows={2}
                placeholder="Write a comment…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm" disabled={posting || !comment.trim()}>
                {posting ? "Posting\u2026" : "Comment"}
              </button>
            </form>
          </section>
        </div>

        <aside className={styles.sidebar} aria-label="Task details">
          <div className="form-field">
            <label htmlFor="status-select">Status</label>
            <select
              id="status-select"
              value={task.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
            >
              {STATUS_COLUMNS.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="assignee-select">Assignee</label>
            <select
              id="assignee-select"
              value={task.assigneeId || ""}
              onChange={(e) => handleFieldChange("assigneeId", e.target.value || null)}
            >
              <option value="">Unassigned</option>
              {project?.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="priority-select">Priority</label>
            <select
              id="priority-select"
              value={task.priority}
              onChange={(e) => handleFieldChange("priority", e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="due-date-input">Due date</label>
            <input
              id="due-date-input"
              type="date"
              value={task.dueDate || ""}
              onChange={(e) => handleFieldChange("dueDate", e.target.value)}
            />
          </div>

          <div className={styles.sidebarMeta}>
            <span>Created {formatDate(task.createdAt)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
