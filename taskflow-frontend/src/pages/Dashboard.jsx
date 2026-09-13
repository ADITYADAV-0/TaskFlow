import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProjects, createProject } from "../data/api";
import ProjectCard from "../components/ProjectCard";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getProjects(user?.id)
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
          setStatus("ready");
        }
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }, [projects, query]);

  async function handleCreate(newProject) {
    const created = await createProject({ ...newProject, ownerId: user.id });
    setProjects((prev) => [created, ...prev]);
    setShowForm(false);
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Your projects</h1>
          <p className={styles.subheading}>
            Welcome back, {user?.name.split(" ")[0]}. Here's what your teams are working on.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ New project"}
        </button>
      </div>

      {showForm && <NewProjectForm onCreate={handleCreate} />}

      <div className={styles.searchRow}>
        <label htmlFor="project-search" className="visually-hidden">
          Search projects
        </label>
        <input
          id="project-search"
          type="search"
          placeholder="Search projects…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {status === "loading" && <p role="status">Loading projects…</p>}
      {status === "error" && (
        <p role="alert" className="form-error">
          Couldn't load your projects. Please refresh the page.
        </p>
      )}

      {status === "ready" && filtered.length === 0 && (
        <div className={styles.empty}>
          <h2>{query ? `No projects match "${query}"` : "No projects yet"}</h2>
          <p>
            {query
              ? "Try a different search, or create a new project to get started."
              : "Create your first project to start organizing tasks on a board."}
          </p>
        </div>
      )}

      {status === "ready" && filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function NewProjectForm({ onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Give the project a name.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onCreate({ name: name.trim(), description: description.trim() });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`card ${styles.form}`} aria-label="Create a new project">
      <div className="form-field">
        <label htmlFor="new-project-name">Project name</label>
        <input id="new-project-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-field">
        <label htmlFor="new-project-description">Description</label>
        <textarea
          id="new-project-description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Creating\u2026" : "Create project"}
      </button>
    </form>
  );
}
