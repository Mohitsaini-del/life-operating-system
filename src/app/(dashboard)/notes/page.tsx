"use client";

import { useEffect, useState } from "react";
import {
  FiSearch,
  FiEdit3,
  FiEye,
  FiSave,
  FiX,
  FiTrash2,
  FiPlus,
  FiChevronLeft,
  FiFileText,
} from "react-icons/fi";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Fetch all notes
  const fetchNotes = async (selectId?: string) => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
        if (selectId) {
          const matched = data.find((n: Note) => n.id === selectId);
          if (matched) {
            setSelectedNote(matched);
            setEditTitle(matched.title);
            setEditContent(matched.content);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle note selection
  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  // Create a new note
  const handleCreateNote = async () => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Note",
          content: "",
        }),
      });

      if (res.ok) {
        const newNote = await res.json();
        // Add to state and select it
        setNotes((prev) => [newNote, ...prev]);
        setSelectedNote(newNote);
        setEditTitle(newNote.title);
        setEditContent(newNote.content);
        setIsEditing(true);
      } else {
        alert("Failed to create note");
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Save changes to note
  const handleSaveNote = async () => {
    if (!selectedNote) return;
    if (!editTitle.trim()) {
      alert("Note title is required");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedNote.id,
          title: editTitle,
          content: editContent,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setNotes((prev) =>
          prev.map((n) => (n.id === updated.id ? updated : n))
        );
        setSelectedNote(updated);
        setIsEditing(false);
      } else {
        alert("Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete note trigger
  const handleDeleteNote = async (id: string) => {
    setNoteToDelete(id);
  };

  // Confirm delete note execution
  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      const res = await fetch(`/api/notes?id=${noteToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteToDelete));
        if (selectedNote?.id === noteToDelete) {
          setSelectedNote(null);
          setEditTitle("");
          setEditContent("");
          setIsEditing(false);
        }
      } else {
        alert("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setNoteToDelete(null);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
    }
    setIsEditing(false);
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Safe client-side Markdown rendering
  const renderMarkdown = (markdown: string) => {
    if (!markdown) return '<p class="text-zinc-400 italic">No content yet.</p>';

    // 1. Escape HTML for safety
    let html = markdown
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 2. Multiline code blocks
    html = html.replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-zinc-100 dark:bg-zinc-850 p-4 rounded-xl font-mono text-xs my-4 overflow-x-auto border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"><code>$1</code></pre>'
    );

    // 3. Inline code
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs text-rose-600 dark:text-rose-400">$1</code>'
    );

    // 4. Headers
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-5 mb-2">$1</h3>'
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-6 mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-1">$1</h2>'
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-8 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">$1</h1>'
    );

    // 5. Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\?/g, '<strong class="font-bold text-zinc-900 dark:text-zinc-50">$1</strong>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-zinc-900 dark:text-zinc-50">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-zinc-800 dark:text-zinc-250">$1</em>');

    // 6. Unordered Lists
    const lines = html.split("\n");
    let inList = false;
    const processedLines = lines.map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const content = trimmed.substring(2);
        let prefix = "";
        if (!inList) {
          inList = true;
          prefix = '<ul class="list-disc pl-6 my-3 space-y-1.5 text-zinc-700 dark:text-zinc-350">';
        }
        return prefix + `<li>${content}</li>`;
      } else {
        if (inList) {
          inList = false;
          return "</ul>\n" + line;
        }
        return line;
      }
    });
    if (inList) {
      processedLines.push("</ul>");
    }
    html = processedLines.join("\n");

    // 7. Paragraph blocks split by empty line space
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs
      .map((p) => {
        const trimmed = p.trim();
        if (!trimmed) return "";
        if (
          trimmed.startsWith("<h") ||
          trimmed.startsWith("<ul") ||
          trimmed.startsWith("<pre") ||
          trimmed.startsWith("</ul")
        ) {
          return trimmed;
        }
        return `<p class="leading-relaxed mb-4 text-zinc-650 dark:text-zinc-300">${trimmed.replace(
          /\n/g,
          "<br />"
        )}</p>`;
      })
      .join("\n");

    return html;
  };

  // Filtered notes by search query
  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Header */}
      <header className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
          Notes Manager
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
          Draft ideas, take logs, or build markdown wikis dynamically.
        </p>
      </header>

      {/* Main Container */}
      <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex overflow-hidden">
        {/* Left Side: Notes List */}
        <div
          className={`w-full lg:w-80 border-r border-zinc-200 dark:border-zinc-800 flex flex-col flex-shrink-0 ${
            selectedNote ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* List Search & Controls */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={handleCreateNote}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-semibold rounded-xl py-2.5 text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-zinc-900/10 dark:shadow-zinc-50/10"
            >
              <FiPlus className="w-4 h-4 font-bold" />
              New Note
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {isLoading ? (
              <p className="p-4 text-zinc-400 text-xs">Loading notes...</p>
            ) : filteredNotes.length === 0 ? (
              <p className="p-4 text-zinc-400 text-xs">
                {searchQuery ? "No matches found." : "No notes yet. Create one!"}
              </p>
            ) : (
              filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={`w-full text-left p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors flex flex-col gap-1 cursor-pointer ${
                    selectedNote?.id === note.id
                      ? "bg-zinc-55 dark:bg-zinc-800/65 border-l-3 border-zinc-900 dark:border-zinc-100"
                      : "border-l-3 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start w-full gap-2">
                    <span className="font-semibold text-sm truncate text-zinc-900 dark:text-zinc-100">
                      {note.title || "Untitled Note"}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap pt-0.5">
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 line-clamp-2">
                    {note.content || "Empty content"}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: View/Edit Panel */}
        <div
          className={`flex-1 flex flex-col min-w-0 ${
            !selectedNote ? "hidden lg:flex items-center justify-center bg-zinc-50/40 dark:bg-zinc-900/20" : "flex"
          }`}
        >
          {selectedNote ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Note actions bar */}
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="lg:hidden p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors cursor-pointer"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                    <FiFileText className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      Last edited {formatDate(selectedNote.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <FiX className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNote}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-105 text-white dark:text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                      >
                        <FiSave className="w-3.5 h-3.5" />
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        <FiEdit3 className="w-3.5 h-3.5" />
                        Edit Note
                      </button>
                      <button
                        onClick={() => handleDeleteNote(selectedNote.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-transparent hover:border-red-100 dark:hover:border-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Editor/Renderer Main Canvas */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                {isEditing ? (
                  <div className="h-full flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full border-none px-0 text-2xl font-bold focus:outline-none focus:ring-0 bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-300 dark:placeholder-zinc-700"
                    />
                    <textarea
                      placeholder="Start writing markdown content... (e.g. # Header, **bold**, - lists, `code`)"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full flex-1 border-none px-0 py-2 focus:outline-none focus:ring-0 bg-transparent text-zinc-800 dark:text-zinc-300 placeholder-zinc-400 font-mono text-sm resize-none"
                    />
                  </div>
                ) : (
                  <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">
                      {selectedNote.title || "Untitled Note"}
                    </h1>
                    <div
                      className="markdown-body text-zinc-800 dark:text-zinc-300 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(selectedNote.content),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-150 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-4">
                <FiFileText className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-150 mb-1">
                No note selected
              </h3>
              <p className="text-zinc-400 dark:text-zinc-500 text-xs">
                Choose a note from the left sidebar list or click the button to create a new markdown note.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-sm w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Delete Note
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              Are you sure you want to delete this note? This action cannot be undone and this note will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setNoteToDelete(null)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-700 dark:text-zinc-350"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteNote}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-md shadow-red-650/10"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
