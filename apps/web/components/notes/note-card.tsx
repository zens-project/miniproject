'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Pin, Edit3, Trash2, Calendar, Hash } from 'lucide-react';
import { Note } from '@/store/slices/notes.slice';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onTogglePin: (noteId: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes <= 1 ? 'Vừa xong' : `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else if (diffInHours < 48) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative rounded-2xl border border-white/20 shadow-xl backdrop-blur-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        note.isPinned ? 'ring-2 ring-yellow-400/30' : ''
      }`}
      style={{ 
        backgroundColor: note.color ? `${note.color}20` : 'rgba(255, 255, 255, 0.1)',
        borderColor: note.color ? `${note.color}40` : 'rgba(255, 255, 255, 0.2)'
      }}
      onClick={() => onEdit(note)}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-3 right-3 z-10">
          <Pin className="h-4 w-4 text-yellow-400 fill-current" />
        </div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute top-3 left-3 z-10 flex gap-1"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note.id);
          }}
          className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
            note.isPinned
              ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
          title={note.isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
        >
          <Pin className="h-3 w-3" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(note);
          }}
          className="p-1.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white backdrop-blur-sm transition-colors"
          title="Chỉnh sửa"
        >
          <Edit3 className="h-3 w-3" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note);
          }}
          className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 backdrop-blur-sm transition-colors"
          title="Xóa"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </motion.div>

      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 pr-8">
          {note.title}
        </h3>

        {/* Content */}
        <p className="text-white/80 text-sm mb-3 line-clamp-4 leading-relaxed">
          {truncateContent(note.content)}
        </p>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs text-white/90"
              >
                <Hash className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 bg-white/10 rounded-full text-xs text-white/60">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(note.updatedAt)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {note.createdAt !== note.updatedAt && (
              <span className="text-white/40">Đã sửa</span>
            )}
            <span>{note.content.length} ký tự</span>
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
      />
    </motion.div>
  );
}
