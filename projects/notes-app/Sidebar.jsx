import "./Sidebar.css";

const TAG_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function Sidebar({
  open,
  tags,
  activeTag,
  onTagSelect,
  onNewNote,
  user,
  onLogout,
  onLogin,
}) {
  if (!open) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo">
          <span className="logo-mark" />
          noter
        </span>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeTag === null ? "active" : ""}`}
          onClick={() => onTagSelect(null)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          All notes
        </button>
      </nav>

      {tags.length > 0 && (
        <div className="sidebar-section">
          <span className="sidebar-label">Tags</span>
          <div className="tag-list">
            {tags.map((tag, i) => (
              <button
                key={tag}
                className={`nav-item tag-nav ${activeTag === tag ? "active" : ""}`}
                onClick={() => onTagSelect(activeTag === tag ? null : tag)}
              >
                <span
                  className="tag-dot"
                  style={{ background: TAG_COLORS[i % TAG_COLORS.length] }}
                />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="sidebar-footer">
        <button className="new-note-btn" onClick={onNewNote}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New note
        </button>

        {user ? (
          <div className="user-row">
            <span className="user-avatar">
              {user.username?.[0]?.toUpperCase() ?? "U"}
            </span>
            <span className="user-name">{user.username}</span>
            <button className="btn-ghost logout-btn" onClick={onLogout} title="Sign out">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <button className="btn-ghost" onClick={onLogin} style={{ width: "100%", justifyContent: "center", display: "flex" }}>
            Sign in
          </button>
        )}
      </div>
    </aside>
  );
}
