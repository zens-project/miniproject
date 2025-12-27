'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  StickyNote, 
  Search, 
  Plus, 
  Pin, 
  Tag, 
  Filter,
  SortAsc,
  SortDesc,
  X,
  Edit3,
  Trash2,
  Undo2,
  Coffee,
  Sparkles
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  createNote, 
  updateNote, 
  deleteNote, 
  togglePinNote,
  setSearch,
  setTagFilter,
  setSortBy,
  toggleShowPinnedOnly,
  clearFilters,
  undoDelete,
  clearRecentlyDeleted,
  NoteSortBy,
  type Note
} from '@/store/slices/notes.slice';
import { Button } from '@workspace/ui';
import QuickNoteInput from '@/components/notes/quick-note-input';
import NoteCard from '@/components/notes/note-card';
import NoteEditor from '@/components/notes/note-editor';
import DeleteNoteDialog from '@/components/notes/delete-note-dialog';
import Image from 'next/image';

export default function NotesPage() {
  const dispatch = useAppDispatch();
  const { notes, filters, isLoading, isSubmitting, error, recentlyDeleted } = useAppSelector(
    (state) => state.notes
  );

  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Auto-clear recently deleted after 5 seconds
  useEffect(() => {
    if (recentlyDeleted) {
      const timer = setTimeout(() => {
        dispatch(clearRecentlyDeleted());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [recentlyDeleted, dispatch]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let filtered = [...notes];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(note =>
        filters.tags.every(tag => note.tags.includes(tag))
      );
    }

    // Pinned filter
    if (filters.showPinnedOnly) {
      filtered = filtered.filter(note => note.isPinned);
    }

    // Sort
    filtered.sort((a, b) => {
      // Pinned notes always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (filters.sortBy) {
        case NoteSortBy.CREATED_AT_DESC:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case NoteSortBy.CREATED_AT_ASC:
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case NoteSortBy.UPDATED_AT_DESC:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case NoteSortBy.UPDATED_AT_ASC:
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case NoteSortBy.TITLE_ASC:
          return a.title.localeCompare(b.title);
        case NoteSortBy.TITLE_DESC:
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [notes, filters]);

  const handleCreateNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    await dispatch(createNote(noteData));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleUpdateNote = async (updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    if (editingNote) {
      await dispatch(updateNote({ id: editingNote.id, updates }));
      setShowEditor(false);
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (noteToDelete) {
      await dispatch(deleteNote(noteToDelete.id));
      setShowDeleteDialog(false);
      setNoteToDelete(null);
    }
  };

  const handleTogglePin = async (noteId: string) => {
    await dispatch(togglePinNote(noteId));
  };

  const handleUndoDelete = () => {
    dispatch(undoDelete());
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with Coffee Theme */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/coffee-bg.jpeg"
          alt="Coffee Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-stone-900/70 to-neutral-900/85" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Floating Coffee Beans Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-amber-400/20"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
              y: -20,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              rotate: 360
            }}
            transition={{ 
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              ease: "linear",
              delay: i * 3
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative rounded-full bg-gradient-to-br from-purple-400 to-pink-600 p-4 shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <StickyNote className="h-8 w-8 text-white" strokeWidth={2.5} />
                <motion.div
                  className="absolute -right-1 -top-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-300" fill="currentColor" />
                </motion.div>
              </motion.div>
              
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Ghi chú
                </h1>
                <p className="text-lg text-amber-100/90 mt-1">
                  Ghi chú nhanh và quản lý ý tưởng
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="ghost"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Filter className="mr-2 h-4 w-4" />
                Bộ lọc
              </Button>
              <Button
                onClick={() => setShowEditor(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tạo ghi chú
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Note Input - Mobile First */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <QuickNoteInput onCreateNote={handleCreateNote} isSubmitting={isSubmitting} />
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm ghi chú..."
                        value={filters.search}
                        onChange={(e) => dispatch(setSearch(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="flex gap-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => dispatch(setSortBy(e.target.value as NoteSortBy))}
                      className="px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-400/50"
                    >
                      <option value={NoteSortBy.UPDATED_AT_DESC}>Mới cập nhật</option>
                      <option value={NoteSortBy.UPDATED_AT_ASC}>Cũ cập nhật</option>
                      <option value={NoteSortBy.CREATED_AT_DESC}>Mới tạo</option>
                      <option value={NoteSortBy.CREATED_AT_ASC}>Cũ tạo</option>
                      <option value={NoteSortBy.TITLE_ASC}>A-Z</option>
                      <option value={NoteSortBy.TITLE_DESC}>Z-A</option>
                    </select>

                    <Button
                      onClick={() => dispatch(toggleShowPinnedOnly())}
                      variant="ghost"
                      size="sm"
                      className={`${
                        filters.showPinnedOnly 
                          ? 'bg-purple-500/30 border-purple-400/50' 
                          : 'bg-white/10 border-white/20'
                      } text-white hover:bg-white/20`}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>

                    <Button
                      onClick={() => dispatch(clearFilters())}
                      variant="ghost"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tags Filter */}
                {allTags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            const newTags = filters.tags.includes(tag)
                              ? filters.tags.filter(t => t !== tag)
                              : [...filters.tags, tag];
                            dispatch(setTagFilter(newTags));
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            filters.tags.includes(tag)
                              ? 'bg-purple-500/30 border border-purple-400/50 text-white'
                              : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Undo Delete Banner */}
        <AnimatePresence>
          {recentlyDeleted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <div className="rounded-xl bg-orange-500/20 border border-orange-400/30 p-4 text-orange-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    <span>Đã xóa ghi chú "{recentlyDeleted.note.title}"</span>
                  </div>
                  <Button
                    onClick={handleUndoDelete}
                    variant="ghost"
                    size="sm"
                    className="text-orange-100 hover:bg-orange-400/20"
                  >
                    <Undo2 className="h-4 w-4 mr-2" />
                    Hoàn tác
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 rounded-xl bg-red-500/20 border border-red-400/30 p-4 text-red-100"
          >
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              <span className="font-medium">Lỗi:</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Notes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-xl">
                <StickyNote className="h-16 w-16 mx-auto mb-4 text-white/40" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {filters.search || filters.tags.length > 0 || filters.showPinnedOnly
                    ? 'Không tìm thấy ghi chú'
                    : 'Chưa có ghi chú nào'
                  }
                </h3>
                <p className="text-white/60 mb-4">
                  {filters.search || filters.tags.length > 0 || filters.showPinnedOnly
                    ? 'Thử thay đổi bộ lọc hoặc tìm kiếm khác'
                    : 'Tạo ghi chú đầu tiên của bạn'
                  }
                </p>
                {!filters.search && filters.tags.length === 0 && !filters.showPinnedOnly && (
                  <Button
                    onClick={() => setShowEditor(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo ghi chú đầu tiên
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <NoteCard
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onTogglePin={handleTogglePin}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Note Editor Modal */}
      <NoteEditor
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingNote(null);
        }}
        note={editingNote}
        onSave={editingNote ? handleUpdateNote : handleCreateNote}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteNoteDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setNoteToDelete(null);
        }}
        note={noteToDelete}
        onConfirm={confirmDelete}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
