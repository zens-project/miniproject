'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Note } from '@/store/slices/notes.slice';

interface DeleteNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteNoteDialog({ 
  isOpen, 
  onClose, 
  note, 
  onConfirm, 
  isDeleting 
}: DeleteNoteDialogProps) {
  if (!note) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      onConfirm();
    }
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

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md rounded-2xl border border-red-400/30 bg-red-500/10 shadow-2xl backdrop-blur-xl"
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-red-400/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  Xác nhận xóa
                </h2>
              </div>
              
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
                disabled={isDeleting}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-4">
                <p className="text-white/90 mb-2">
                  Bạn có chắc chắn muốn xóa ghi chú này không?
                </p>
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <h3 className="font-medium text-white mb-1 line-clamp-1">
                    {note.title}
                  </h3>
                  <p className="text-sm text-white/70 line-clamp-2">
                    {note.content}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-0.5 bg-white/20 rounded-full text-xs text-white/80"
                        >
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="inline-block px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/60">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-100">
                    <p className="font-medium mb-1">Lưu ý:</p>
                    <p>Ghi chú sẽ được xóa vĩnh viễn sau 5 giây. Bạn có thể hoàn tác trong thời gian này.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-red-400/20">
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10"
                disabled={isDeleting}
              >
                Hủy
              </Button>
              
              <Button
                onClick={onConfirm}
                disabled={isDeleting}
                className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa ghi chú
                  </>
                )}
              </Button>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="px-4 pb-2">
              <p className="text-xs text-white/40 text-center">
                Enter để xác nhận • Esc để hủy
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
