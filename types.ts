export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  color: string;
}

export const NOTE_COLORS = [
  '#0f172a', // slate-900
  '#3b82f6', // blue-500
  '#f97316', // orange-400
  '#e2e8f0', // slate-200
  '#10b981', // emerald-500
  '#8b5cf6', // purple-500
];
