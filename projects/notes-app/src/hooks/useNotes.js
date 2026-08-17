import { useState, useEffect, useMemo } from "react";
import { apiFetch, apiPost, apiPatch, apiDelete } from "../utils/api";

const DEV_MODE = true; // set to false when Django backend is ready

const MOCK_NOTES = [
  {
    id: 1,
    title: "Getting started",
    content:
      "This is a demo note. The backend is not connected yet.\n\nOnce Django is running, your real notes will appear here.",
    tags: ["demo", "setup"],
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Project plan",
    content:
      "Notes App → Job Board → Freelance CRM\n\nStack: Django REST + React SPA + JWT auth",
    tags: ["planning"],
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 3,
    title: "Django models to build",
    content:
      "- User (built-in)\n- Note (title, content, tags, owner)\n- Tag (name, color)\n\nRelationships: Note → User (FK), Note → Tag (M2M)",
    tags: ["django", "backend"],
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

let mockIdCounter = 4;

export function useNotes(user) {
  const [allNotes, setAllNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    if (user) {
      if (DEV_MODE) {
        setAllNotes(MOCK_NOTES);
      } else {
        fetchNotes();
      }
    } else {
      setAllNotes([]);
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const data = await apiFetch("/api/notes/");
      setAllNotes(data);
    } catch (e) {
      console.error("Failed to fetch notes", e);
    }
  };

  const notes = useMemo(() => {
    let result = [...allNotes];
    if (activeTag) {
      result = result.filter((n) => n.tags?.includes(activeTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.content?.toLowerCase().includes(q) ||
          n.tags?.some((t) => t.includes(q)),
      );
    }
    return result.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
    );
  }, [allNotes, searchQuery, activeTag]);

  const tags = useMemo(() => {
    const set = new Set();
    allNotes.forEach((n) => n.tags?.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [allNotes]);

  const createNote = async () => {
    if (DEV_MODE) {
      const note = {
        id: mockIdCounter++,
        title: "",
        content: "",
        tags: [],
        updated_at: new Date().toISOString(),
      };
      setAllNotes((prev) => [note, ...prev]);
      setActiveNote(note);
      return;
    }
    try {
      const note = await apiPost("/api/notes/", {
        title: "",
        content: "",
        tags: [],
      });
      setAllNotes((prev) => [note, ...prev]);
      setActiveNote(note);
    } catch (e) {
      console.error("Create failed", e);
    }
  };

  const updateNote = async (updated) => {
    if (DEV_MODE) {
      const saved = { ...updated, updated_at: new Date().toISOString() };
      setAllNotes((prev) => prev.map((n) => (n.id === saved.id ? saved : n)));
      setActiveNote(saved);
      return;
    }
    try {
      const saved = await apiPatch(`/api/notes/${updated.id}/`, {
        title: updated.title,
        content: updated.content,
        tags: updated.tags,
      });
      setAllNotes((prev) => prev.map((n) => (n.id === saved.id ? saved : n)));
      setActiveNote(saved);
    } catch (e) {
      console.error("Update failed", e);
    }
  };

  const deleteNote = async (id) => {
    if (DEV_MODE) {
      setAllNotes((prev) => prev.filter((n) => n.id !== id));
      if (activeNote?.id === id) setActiveNote(null);
      return;
    }
    try {
      await apiDelete(`/api/notes/${id}/`);
      setAllNotes((prev) => prev.filter((n) => n.id !== id));
      if (activeNote?.id === id) setActiveNote(null);
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  return {
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
  };
}
