'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Hash, Palette, Pin, Loader2, Type } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Note } from '@/store/slices/notes.slice';

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
  onSave: (noteData: any) => Promise<void>;
  isSubmitting: boolean;
}

const noteColors = [
  '#fbbf24', // amber
  '#f87171', // red
  '#60a5fa', // blue
  '#34d399', // green
  '#a78bfa', // purple
  '#fb7185', // pink
  '#f97316', // orange
];

export default function NoteEditor({ isOpen, onClose, note, onSave, isSubmitting }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [isPinned, setIsPinned] = useState(false);
  const [autoGenerateTitle, setAutoGenerateTitle] = useState(true);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags([...note.tags]);
      setSelectedColor(note.color);
      setIsPinned(note.isPinned);
      setAutoGenerateTitle(false);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setSelectedColor(undefined);
      setIsPinned(false);
      setAutoGenerateTitle(true);
    }
  }, [note]);

  // Auto-resize content textarea
  useEffect(() => {
    if (contentTextareaRef.current) {
      contentTextareaRef.current.style.height = 'auto';
      contentTextareaRef.current.style.height = contentTextareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Auto-generate title from content
  useEffect(() => {
    if (autoGenerateTitle && content && !title) {
      const firstLine = content.split('\n')[0].trim();
      const generatedTitle = firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
      setTitle(generatedTitle);
    }
  }, [content, autoGenerateTitle, title]);

  // Focus title input when opening for new note
  useEffect(() => {
    if (isOpen && !note) {
      setTimeout(() => {
        if (contentTextareaRef.current) {
          contentTextareaRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, note]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const finalTitle = title.trim() || 'Ghi chú không có tiêu đề';

    if (note) {
      // Update existing note
      await onSave({
        title: finalTitle,
        content: content.trim(),
        tags,
        isPinned,
        color: selectedColor
      });
    } else {
      // Create new note
      await onSave({
        title: finalTitle,
        content: content.trim(),
        tags,
        isPinned,
        color: selectedColor
      });
    }

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const addTag = () => {
    const tag = currentTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setAutoGenerateTitle(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl"
            style={{ 
              backgroundColor: selectedColor ? `${selectedColor}20` : 'rgba(255, 255, 255, 0.1)',
              borderColor: selectedColor ? `${selectedColor}40` : 'rgba(255, 255, 255, 0.2)'
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Type className="h-5 w-5 text-white/70" />
                <h2 className="text-lg font-semibold text-white">
                  {note ? 'Chỉnh sửa ghi chú' : 'Tạo ghi chú mới'}
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Pin toggle */}
                <Button
                  onClick={() => setIsPinned(!isPinned)}
                  variant="ghost"
                  size="sm"
                  className={`${
                    isPinned
                      ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title={isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
                >
                  <Pin className="h-4 w-4" />
                </Button>

                {/* Close button */}
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[calc(90vh-200px)] overflow-y-auto">
              {/* Title Input */}
              <div className="mb-4">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Tiêu đề ghi chú..."
                  className="w-full text-xl font-semibold bg-transparent text-white placeholder-white/50 border-none outline-none focus:ring-0"
                />
                {autoGenerateTitle && (
                  <p className="text-xs text-white/40 mt-1">
                    Tiêu đề sẽ tự động tạo từ dòng đầu tiên
                  </p>
                )}
              </div>

              {/* Content Textarea */}
              <div className="mb-4">
                <textarea
                  ref={contentTextareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Viết nội dung ghi chú của bạn..."
                  className="w-full min-h-[200px] bg-transparent text-white placeholder-white/50 border-none outline-none resize-none focus:ring-0"
                  rows={8}
                />
                
                {/* Character counter */}
                <div className="flex justify-between items-center text-xs text-white/40 mt-2">
                  <span>Ctrl/Cmd + Enter để lưu</span>
                  <span>{content.length} ký tự</span>
                </div>
              </div>

              {/* Tags Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/70">Tags</span>
                </div>
                
                {/* Existing tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm text-white/90"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-white/60 hover:text-white/90"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tag input */}
                <input
                  ref={tagInputRef}
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => {
                    if (currentTag.trim()) {
                      addTag();
                    }
                  }}
                  placeholder="Thêm tag (Enter hoặc dấu phẩy để thêm)"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm text-sm"
                />
              </div>

              {/* Color Picker */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/70">Màu sắc</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedColor(undefined)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      !selectedColor 
                        ? 'border-white bg-white/20 scale-110' 
                        : 'border-white/30 bg-white/10 hover:border-white/50 hover:scale-105'
                    }`}
                    title="Không màu"
                  />
                  {noteColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color 
                          ? 'border-white scale-110' 
                          : 'border-white/30 hover:border-white/50 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Màu ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <div className="text-xs text-white/50">
                {note ? `Tạo: ${new Date(note.createdAt).toLocaleDateString('vi-VN')}` : 'Ghi chú mới'}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {note ? 'Cập nhật' : 'Tạo ghi chú'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
