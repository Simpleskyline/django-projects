import { formatRelative } from "../utils/date";
import "./NoteList.css";

export default function NoteList({
  notes,
  activeNote,
  onSelect,
  onDelete,
  searchQuery,
  onSearch,
  onToggleSidebar,
}) {
  return (
    <div className="note-list">
      <div className="list-header">
        <button className="btn-ghost icon-btn" onClick={onToggleSidebar} title="Toggle sidebar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
        <span className="list-count">{notes.length} {notes.length === 1 ? "note" : "notes"}</span>
      </div>

      <div className="search-wrap">
        <svg className="search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="search-input"
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => onSearch("")}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div className="list-items">
        {notes.length === 0 && (
          <div className="empty-state">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p>{searchQuery ? "No results found" : "No notes yet"}</p>
          </div>
        )}

        {notes.map(note => (
          <button
            key={note.id}
            className={`note-item ${activeNote?.id === note.id ? "active" : ""}`}
            onClick={() => onSelect(note)}
          >
            <div className="note-item-top">
              <span className="note-item-title">
                {note.title || "Untitled"}
              </span>
              <button
                className="delete-btn"
                onClick={e => { e.stopPropagation(); onDelete(note.id); }}
                title="Delete note"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
            </div>

            <p className="note-item-preview">
              {note.content?.replace(/[#*`_]/g, "").slice(0, 80) || "No content"}
            </p>

            <div className="note-item-meta">
              <span className="note-date">{formatRelative(note.updated_at)}</span>
              <div className="note-tags">
                {note.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="note-tag">{tag}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
