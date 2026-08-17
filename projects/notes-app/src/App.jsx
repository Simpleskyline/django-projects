import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import NoteList from "./components/NoteList";
import AuthModal from "./components/AuthModal";
import { useNotes } from "./hooks/useNotes";
import { useAuth } from "./hooks/useAuth";
import "./styles/global.css";

export default function App() {
  const { user, login, logout, register, loading: authLoading } = useAuth();
  const {
    notes,
    activeNote,
    setActiveNote,
    createNote,
    updateNote,
    deleteNote,
    searchQuery,
    setSearchQuery,
    activeTag,
    setActiveTag,
    tags,
  } = useNotes(user);

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user && !authLoading) setShowAuth(true);
    if (user) setShowAuth(false);
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="splash">
        <span className="splash-dot" />
      </div>
    );
  }

  return (
    <div className="app">
      {showAuth && (
        <AuthModal
          mode={authMode}
          onSwitchMode={setAuthMode}
          onLogin={login}
          onRegister={register}
          onClose={() => user && setShowAuth(false)}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        tags={tags}
        activeTag={activeTag}
        onTagSelect={setActiveTag}
        onNewNote={createNote}
        user={user}
        onLogout={logout}
        onLogin={() => { setAuthMode("login"); setShowAuth(true); }}
      />

      <div className={`main ${sidebarOpen ? "sidebar-open" : ""}`}>
        <NoteList
          notes={notes}
          activeNote={activeNote}
          onSelect={setActiveNote}
          onDelete={deleteNote}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
        />

        <NoteEditor
          note={activeNote}
          onChange={updateNote}
        />
      </div>
    </div>
  );
}
