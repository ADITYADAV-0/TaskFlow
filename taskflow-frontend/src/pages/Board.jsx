import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProject, getTasksByProject, updateTaskStatus, createTask } from "../data/api";
import Column from "../components/Column";
import Avatar from "../components/Avatar";
import { STATUS_COLUMNS } from "../data/mockData";
import styles from "./Board.module.css";

export default function Board() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    Promise.all([getProject(projectId), getTasksByProject(projectId)])
      .then(([projectData, taskData]) => {
        if (cancelled) return;
        if (!projectData) {
          setStatus("not-found");
          return;
        }
        setProject(projectData);
        setTasks(taskData);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  async function handleMove(taskId, newStatus) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch {
      // Roll back on failure so the board never silently disagrees with the server.
      getTasksByProject(projectId).then(setTasks);
    }
  }

  async function handleCreateTask(fields) {
    const task = await createTask(projectId, fields);
    setTasks((prev) => [...prev, task]);
    setShowForm(false);
  }

  if (status === "loading") return <p role="status">Loading board…</p>;
  if (status === "not-found") {
    return (
      <div>
        <p>We couldn't find that project.</p>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to dashboard
        </Link>
      </div>
    );
  }
  if (status === "error") {
    return (
      <p role="alert" className="form-error">
        Something went wrong loading this board.
      </p>
    );
  }

  return (
    <div>
      <button className={styles.backLink} onClick={() => navigate("/dashboard")}>
        {"\u2190"} All projects
      </button>

      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>{project.name}</h1>
          <p className={styles.description}>{project.description}</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.avatars}>
            {project.members.map((m) => (
              <Avatar key={m.id} user={m} size={26} />
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "+ Add task"}
          </button>
        </div>
      </div>

      {showForm && (
        <NewTaskForm project={project} onCreate={handleCreateTask} onCancel={() => setShowForm(false)} />
      )}

      <div className={styles.board}>
        {STATUS_COLUMNS.map((column) => (
          <Column
            key={column.key}
            column={column}
            tasks={tasks.filter((t) => t.status === column.key)}
            onMove={handleMove}
          />
        ))}
      </div>
    </div>
  );
}

function NewTaskForm({ project, onCreate, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Give the task a title.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim(),
        priority,
        assigneeId: assigneeId || null,
        dueDate: dueDate || null,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`card ${styles.form}`} aria-label="Add a new task">
      <div className="form-field">
        <label htmlFor="task-title">Title</label>
        <input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-field">
        <label htmlFor="task-description">Description</label>
        <textarea id="task-description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className={styles.formRow}>
        <div className="form-field">
          <label htmlFor="task-priority">Priority</label>
          <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="task-assignee">Assignee</label>
          <select id="task-assignee" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            <option value="">Unassigned</option>
            {project.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="task-due">Due date</label>
          <input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className={styles.formActions}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Adding\u2026" : "Add task"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
