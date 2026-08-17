import { useState, useEffect, useRef } from "react";
import "./NoteEditor.css";

const TAG_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function NoteEditor({ note, onChange }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const saveTimer = useRef(null);
  const tagRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setTags(note.tags || []);
    } else {
      setTitle("");
      setContent("");
      setTags([]);
    }
  }, [note?.id]);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [content]);

  const scheduleSync = (patch) => {
    if (!note) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onChange({ ...note, ...patch });
    }, 600);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
    scheduleSync({ title: e.target.value, content, tags });
  };

  const handleContent = (e) => {
    setContent(e.target.value);
    scheduleSync({ title, content: e.target.value, tags });
  };

  const addTag = () => {
    const val = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!val || tags.includes(val)) { setTagInput(""); return; }
    const next = [...tags, val];
    setTags(next);
    setTagInput("");
    scheduleSync({ title, content, tags: next });
  };

  const removeTag = (tag) => {
    const next = tags.filter(t => t !== tag);
    setTags(next);
    scheduleSync({ title, content, tags: next });
  };

  const handleTagKey = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
    if (e.key === "Backspace" && !tagInput && tags.length) removeTag(tags[tags.length - 1]);
  };

  if (!note) {
    return (
      <div className="editor-empty">
        <div className="editor-empty-inner">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <p>Select a note or create one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor">
      <div className="editor-header">
        <input
          className="editor-title"
          type="text"
          placeholder="Note title"
          value={title}
          onChange={handleTitle}
        />

        <div className="editor-meta">
          <span className="word-count">{wordCount} {wordCount === 1 ? "word" : "words"}</span>
        </div>
      </div>

      <div className="tag-bar">
        {tags.map((tag, i) => (
          <span key={tag} className="tag-chip" style={{ "--chip-color": TAG_COLORS[i % TAG_COLORS.length] }}>
            {tag}
            <button className="tag-remove" onClick={() => removeTag(tag)}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={tagRef}
          className="tag-input"
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={handleTagKey}
          onBlur={addTag}
        />
      </div>

      <textarea
        className="editor-body"
        placeholder="Start writing..."
        value={content}
        onChange={handleContent}
        spellCheck={false}
      />

      <div className="editor-footer">
        <span className="footer-hint">Auto-saved</span>
        <span className="footer-hint" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          {new Date(note.updated_at || Date.now()).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
