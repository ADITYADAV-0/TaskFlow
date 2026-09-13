import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import styles from "./AppShell.module.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Projects", icon: BoardIcon },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <div className={styles.shell}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className={styles.topbar}>
        <button
          className={styles.menuButton}
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          aria-controls="app-sidebar"
          onClick={() => setDrawerOpen((v) => !v)}
        >
          <MenuIcon />
        </button>
        <NavLink to="/dashboard" className={styles.brand}>
          TaskFlow
        </NavLink>
        <div className={styles.topbarSpacer} />
        {user && (
          <div className={styles.userMenu}>
            <Avatar user={user} size={32} />
            <span className={styles.userName}>{user.name}</span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </header>

      <div className={styles.body}>
        <nav
          id="app-sidebar"
          className={`${styles.sidebar} ${drawerOpen ? styles.sidebarOpen : ""}`}
          aria-label="Primary"
        >
          <ul>
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  <Icon />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {drawerOpen && (
          <button
            className={styles.scrim}
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        <main id="main-content" className={styles.main} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BoardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="2.5" width="4.2" height="13" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="7.4" y="2.5" width="4.2" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="12.8" y="2.5" width="4.2" height="11" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
