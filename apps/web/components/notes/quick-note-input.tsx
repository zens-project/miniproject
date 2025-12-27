'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Hash, Palette, Save, Loader2 } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Note } from '@/store/slices/notes.slice';

interface QuickNoteInputProps {
  onCreateNote: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isSubmitting: boolean;
}

const noteColors = [
  '#fbbf24', // amber
  '#f87171', // red
  '#60a5fa', // blue
  '#34d399', // green
  '#a78bfa', // purple
  '#fb7185', // pink
  '#fbbf24', // orange
];

export default function QuickNoteInput({ onCreateNote, isSubmitting }: QuickNoteInputProps) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [showOptions, setShowOptions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Auto-generate title from first line
  const generateTitle = (content: string): string => {
    const firstLine = content.split('\n')[0].trim();
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine || 'Ghi chú không có tiêu đề';
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const title = generateTitle(content);
    
    await onCreateNote({
      title,
      content: content.trim(),
      tags,
      isPinned: false,
      color: selectedColor
    });

    // Reset form
    setContent('');
    setTags([]);
    setCurrentTag('');
    setSelectedColor(undefined);
    setShowOptions(false);
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
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

  const handleFocus = () => {
    setIsExpanded(true);
    setShowOptions(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't collapse if clicking on options
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.closest('.note-options')) {
      return;
    }
    
    // Only collapse if no content
    if (!content.trim()) {
      setIsExpanded(false);
      setShowOptions(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-xl overflow-hidden"
      style={{ backgroundColor: selectedColor ? `${selectedColor}20` : undefined }}
    >
      <div className="p-4">
        {/* Main Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isExpanded ? "Viết ghi chú của bạn...\n\nMẹo: Dòng đầu tiên sẽ là tiêu đề\nCtrl/Cmd + Enter để lưu nhanh" : "Ghi chú nhanh..."}
            className={`w-full bg-transparent text-white placeholder-white/50 border-none outline-none resize-none transition-all duration-300 ${
              isExpanded ? 'min-h-[120px] text-base' : 'min-h-[60px] text-lg'
            }`}
            rows={isExpanded ? 5 : 2}
          />
          
          {/* Character Counter */}
          {content.length > 0 && (
            <div className="absolute bottom-2 right-2 text-xs text-white/40">
              {content.length} ký tự
            </div>
          )}
        </div>

        {/* Tags Display */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 mb-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-sm text-white/90"
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

        {/* Options Panel */}
        <motion.div
          initial={false}
          animate={{ 
            height: showOptions ? 'auto' : 0,
            opacity: showOptions ? 1 : 0
          }}
          className="note-options overflow-hidden"
        >
          <div className="pt-3 border-t border-white/10">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Tag Input */}
              <div className="flex-1">
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={(e) => {
                      // Add tag on blur if there's content
                      if (currentTag.trim()) {
                        addTag();
                      }
                    }}
                    placeholder="Thêm tag..."
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm text-sm"
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-white/60" />
                <div className="flex gap-1">
                  <button
                    onClick={() => setSelectedColor(undefined)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      !selectedColor 
                        ? 'border-white bg-white/20' 
                        : 'border-white/30 bg-white/10 hover:border-white/50'
                    }`}
                  />
                  {noteColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        selectedColor === color 
                          ? 'border-white scale-110' 
                          : 'border-white/30 hover:border-white/50 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-3">
              <div className="text-xs text-white/50">
                Ctrl/Cmd + Enter để lưu nhanh
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setContent('');
                    setTags([]);
                    setCurrentTag('');
                    setSelectedColor(undefined);
                    setShowOptions(false);
                    setIsExpanded(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  size="sm"
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
                      Lưu ghi chú
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
