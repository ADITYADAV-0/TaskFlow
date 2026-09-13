import { Link } from "react-router-dom";
import styles from "./Landing.module.css";

const FEATURES = [
  {
    title: "One board, not five tabs",
    body: "Every task lives in one place with a single owner, a single status, and a single thread of comments.",
  },
  {
    title: "Status you can see",
    body: "Drag a card across the board and the whole team sees it move — no status meeting required.",
  },
  {
    title: "Built for handoffs",
    body: "Assign, comment, and attach files right on the task, so context never gets lost between people.",
  },
];

export default function Landing() {
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <span className={styles.brand}>TaskFlow</span>
          <nav aria-label="Primary">
            <Link to="/login" className="btn btn-secondary btn-sm">
              Log in
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className={`container ${styles.hero}`}>
          <div className={styles.heroText}>
            <h1>
              Plan the work.
              <br />
              See it move.
            </h1>
            <p className={styles.heroLede}>
              TaskFlow gives your team a shared board for projects, tasks, and the
              conversation around them — so everyone can see what's happening
              without asking.
            </p>
            <div className={styles.heroActions}>
              <Link to="/login" className="btn btn-primary">
                Get started
              </Link>
              <a href="#how-it-works" className="btn btn-secondary">
                See how it works
              </a>
            </div>
          </div>

          <div className={styles.heroArt} aria-hidden="true">
            <BoardPreview />
          </div>
        </section>

        <section id="how-it-works" className={`container ${styles.features}`}>
          <h2 className={styles.featuresHeading}>Everything a task needs, in one card</h2>
          <div className={styles.featureGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`container ${styles.ctaBand}`}>
          <div>
            <h2>Bring your team's work into one board</h2>
            <p>No credit card, no setup call — just sign in and create your first project.</p>
          </div>
          <Link to="/login" className="btn btn-primary">
            Get started free
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <span>TaskFlow</span>
          <span className={styles.footerNote}>Created By Aditya Yadav</span>
        </div>
      </footer>
    </div>
  );
}

function BoardPreview() {
  return (
    <svg viewBox="0 0 360 260" className={styles.boardSvg} role="presentation">
      <rect x="0" y="0" width="360" height="260" rx="14" fill="var(--surface)" stroke="var(--border)" />
      {[16, 130, 244].map((x, i) => (
        <g key={x}>
          <rect x={x} y="20" width="100" height="14" rx="4" fill="var(--surface-sunken)" />
          {[0, 1].slice(0, i === 1 ? 1 : 2).map((row) => (
            <g key={row} transform={`translate(${x}, ${48 + row * 66})`}>
              <rect width="100" height="54" rx="8" fill="var(--surface)" stroke="var(--border)" />
              <rect x="10" y="12" width="60" height="8" rx="3" fill="var(--ink-faint)" />
              <rect x="10" y="28" width="40" height="6" rx="3" fill="var(--border)" />
              <circle cx="86" cy="16" r="7" fill={i === 0 ? "var(--primary)" : i === 1 ? "var(--accent)" : "#3f7d4d"} />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
