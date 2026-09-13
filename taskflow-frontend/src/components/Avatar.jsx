import styles from "./Avatar.module.css";

const PALETTE = ["#1f6f63", "#c98a2b", "#5a6ea6", "#a13d3d", "#3f7d4d"];

function colorFor(name) {
  const sum = [...(name || "")].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

export default function Avatar({ user, size = 28 }) {
  if (!user) {
    return (
      <span
        className={styles.avatar}
        style={{ width: size, height: size, fontSize: size * 0.4, background: "var(--surface-sunken)", color: "var(--ink-faint)" }}
        aria-hidden="true"
        title="Unassigned"
      >
        ?
      </span>
    );
  }
  return (
    <span
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: size * 0.4, background: colorFor(user.name) }}
      role="img"
      aria-label={user.name}
      title={user.name}
    >
      {user.initials || user.name.slice(0, 2).toUpperCase()}
    </span>
  );
}
