import React, { useState, useEffect } from 'react';
import { Plus, Search, BookOpen } from 'lucide-react';
import { Note } from './types';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('writtenotes_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  useEffect(() => {
    localStorage.setItem('writtenotes_data', JSON.stringify(notes));
  }, [notes]);

  const handleCreateNew = () => {
    setCurrentNote(null);
    setIsEditing(true);
  };

  const handleEdit = (note: Note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSave = (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    if (currentNote) {
      setNotes((prev) =>
        prev.map((n) => (n.id === currentNote.id ? { ...n, ...noteData } : n))
      );
    } else {
      const newNote: Note = {
        ...noteData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }
    setIsEditing(false);
    setCurrentNote(null);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden font-sans text-slate-900 selection:bg-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex shrink-0">
        <div className="p-8">
          <h1 className="text-xs font-black tracking-widest uppercase text-slate-400 mb-8">Writtenotes</h1>
          <nav className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900 font-medium">
              <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
              <span>All Notes</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
              <div className="w-2 h-2 border border-slate-300 rounded-full"></div>
              <span>Personal</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
              <div className="w-2 h-2 border border-slate-300 rounded-full"></div>
              <span>Workspace</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
              <div className="w-2 h-2 border border-slate-300 rounded-full"></div>
              <span>Archives</span>
            </div>
          </nav>
        </div>
        <div className="mt-auto p-8 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[10px] uppercase tracking-tighter text-slate-400 mb-1">Storage</div>
          <div className="w-full h-1 bg-slate-200 rounded-full mb-2 overflow-hidden">
            <div className="h-full bg-slate-400 rounded-full transition-all duration-500" style={{ width: `${Math.min((notes.length / 100) * 100, 100)}%` }}></div>
          </div>
          <div className="text-[10px] text-slate-400 font-medium italic uppercase tracking-widest">{notes.length} Notes Saved</div>
        </div>
      </aside>

      {/* Main View */}
      <main className="flex-1 flex flex-col bg-slate-50 min-w-0">
        {/* Header */}
        <header className="h-24 px-6 md:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center md:hidden gap-2 text-xl font-bold text-slate-900 tracking-tight mr-4">
            <BookOpen className="w-6 h-6 text-slate-900" />
            <span className="hidden sm:inline">Writtenotes</span>
          </div>
          
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-slate-400 transition-colors shadow-sm"
            />
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="hidden sm:flex items-center gap-4 ml-4 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-300 border border-slate-200"></div>
          </div>
        </header>

        {/* Note Grid Container */}
        <div className="flex-1 px-6 md:px-10 pb-24 md:pb-10 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-300 mb-6 rounded-full">
                 <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">No notes yet</h2>
              <p className="text-slate-500 max-w-sm mb-8 text-sm">
                Create your first note by clicking the plus button in the bottom right corner.
              </p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Search className="w-12 h-12 text-slate-300 mb-4" />
              <h2 className="text-lg font-bold text-slate-900 mb-1">No results found</h2>
              <p className="text-slate-500 text-sm">We couldn't find any notes matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
              <AnimatePresence>
                {/* Note creation placeholder (matches design) */}
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleCreateNew}
                  className="border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group hover:bg-white hover:border-slate-300 transition-all cursor-pointer h-64 min-h-[16rem]"
                >
                  <div className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-300 group-hover:text-slate-500 group-hover:border-slate-500 transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Create New Note</span>
                </motion.div>

                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={() => handleEdit(note)}
                    onDelete={() => handleDelete(note.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* FAB */}
      <button
        onClick={handleCreateNew}
        className="absolute right-8 bottom-8 md:right-12 md:bottom-12 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40"
        aria-label="Create note"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditing && (
          <NoteEditor
            initialNote={currentNote}
            onSave={handleSave}
            onClose={() => setIsEditing(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
