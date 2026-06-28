import React, { useState, useEffect } from 'react';
import { Note, NOTE_COLORS } from '../types';
import { X, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface NoteEditorProps {
  initialNote: Note | null;
  onSave: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave, onClose }) => {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [color, setColor] = useState(initialNote?.color || NOTE_COLORS[0]);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      onClose();
      return;
    }
    onSave({ title, content, color });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleSave}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex gap-4 items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2 hidden sm:inline">Color</span>
            {NOTE_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 border transition-transform ${
                  color === c ? 'border-slate-900 scale-110' : 'border-slate-200 hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
                aria-label="Select color"
              />
            ))}
          </div>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col gap-6">
          <div className="h-1.5 w-12 mb-2 transition-colors duration-300 shrink-0" style={{ backgroundColor: color }}></div>
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-3xl font-bold text-slate-900 placeholder-slate-300 outline-none border-none focus:ring-0 px-0 shrink-0"
          />
          <textarea
            placeholder="Start typing your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full flex-1 bg-transparent text-base text-slate-600 leading-relaxed placeholder-slate-300 outline-none border-none focus:ring-0 resize-none min-h-[300px] px-0"
            autoFocus
          />
        </div>
      </motion.div>
    </div>
  );
};
