import React from 'react';
import { Note } from '../types';
import { useLongPress } from '../hooks/useLongPress';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleLongPress = () => {
    setShowDeleteConfirm(true);
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const { isLongPress, ...longPressHandlers } = useLongPress(handleLongPress, 500);

  const handleCardClick = (e: React.MouseEvent) => {
    if (isLongPress.current) {
      return;
    }
    if (!showDeleteConfirm) {
      onClick();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white border border-slate-200 p-8 flex flex-col hover:shadow-md cursor-pointer group transition-all relative overflow-hidden h-64 min-h-[16rem]"
      onClick={handleCardClick}
      {...longPressHandlers}
    >
      <div className="h-1.5 w-12 mb-6 shrink-0" style={{ backgroundColor: note.color }}></div>
      <AnimatePresence>
        {showDeleteConfirm ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-slate-900 z-10 p-8 text-center"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <Trash2 className="w-8 h-8 mb-4 text-red-500" />
            <p className="font-bold text-lg leading-tight mb-6">Delete note?</p>
            <div className="flex gap-4 w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-3 border border-slate-300 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex-1 py-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-col h-full overflow-hidden">
        {note.title ? (
          <h3 className="font-bold text-lg mb-3 leading-tight text-slate-900 shrink-0 line-clamp-2">
            {note.title}
          </h3>
        ) : (
          <h3 className="font-bold text-lg mb-3 leading-tight text-slate-400 italic shrink-0 line-clamp-2">
            Untitled
          </h3>
        )}
        <p className="text-slate-500 text-sm leading-relaxed overflow-hidden line-clamp-3">
          {note.content}
        </p>
      </div>
      <div className="mt-auto pt-6 flex justify-between items-center shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {new Date(note.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
        <span className="opacity-0 group-hover:opacity-100 text-[10px] italic text-slate-300 transition-opacity duration-300">Hold to delete</span>
      </div>
    </motion.div>
  );
};
