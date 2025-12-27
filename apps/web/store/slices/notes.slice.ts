import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  color?: string;
  createdAt: string; // ISO string for Redux serialization
  updatedAt: string; // ISO string for Redux serialization
}

export enum NoteSortBy {
  CREATED_AT_DESC = 'createdAt_desc',
  CREATED_AT_ASC = 'createdAt_asc',
  UPDATED_AT_DESC = 'updatedAt_desc',
  UPDATED_AT_ASC = 'updatedAt_asc',
  TITLE_ASC = 'title_asc',
  TITLE_DESC = 'title_desc',
}

export interface NotesFilters {
  search: string;
  tags: string[];
  sortBy: NoteSortBy;
  showPinnedOnly: boolean;
}

export interface NotesState {
  notes: Note[];
  filters: NotesFilters;
  isLoading: boolean;
  isSubmitting: boolean;
  error?: string;
  recentlyDeleted?: {
    note: Note;
    timestamp: string;
  };
}

// Async thunks
export const createNote = createAsyncThunk(
  'notes/create',
  async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newNote: Note = {
      ...noteData,
      id: `note_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newNote;
  }
);

export const updateNote = createAsyncThunk(
  'notes/update',
  async ({ id, updates }: { id: string; updates: Partial<Omit<Note, 'id' | 'createdAt'>> }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id,
      updates: {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    };
  }
);

export const deleteNote = createAsyncThunk(
  'notes/delete',
  async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return id;
  }
);

export const togglePinNote = createAsyncThunk(
  'notes/togglePin',
  async (id: string, { getState }) => {
    const state = getState() as { notes: NotesState };
    const note = state.notes.notes.find(n => n.id === id);
    
    if (!note) throw new Error('Note not found');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      id,
      isPinned: !note.isPinned,
      updatedAt: new Date().toISOString()
    };
  }
);

const initialState: NotesState = {
  notes: [],
  filters: {
    search: '',
    tags: [],
    sortBy: NoteSortBy.UPDATED_AT_DESC,
    showPinnedOnly: false
  },
  isLoading: false,
  isSubmitting: false,
  error: undefined,
  recentlyDeleted: undefined
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setTagFilter: (state, action: PayloadAction<string[]>) => {
      state.filters.tags = action.payload;
    },
    setSortBy: (state, action: PayloadAction<NoteSortBy>) => {
      state.filters.sortBy = action.payload;
    },
    toggleShowPinnedOnly: (state) => {
      state.filters.showPinnedOnly = !state.filters.showPinnedOnly;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        tags: [],
        sortBy: NoteSortBy.UPDATED_AT_DESC,
        showPinnedOnly: false
      };
    },
    clearError: (state) => {
      state.error = undefined;
    },
    undoDelete: (state) => {
      if (state.recentlyDeleted) {
        state.notes.push(state.recentlyDeleted.note);
        state.recentlyDeleted = undefined;
      }
    },
    clearRecentlyDeleted: (state) => {
      state.recentlyDeleted = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create note
      .addCase(createNote.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.notes.unshift(action.payload); // Add to beginning
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể tạo ghi chú';
      })
      
      // Update note
      .addCase(updateNote.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const { id, updates } = action.payload;
        const noteIndex = state.notes.findIndex(note => note.id === id);
        if (noteIndex !== -1) {
          state.notes[noteIndex] = { ...state.notes[noteIndex], ...updates };
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể cập nhật ghi chú';
      })
      
      // Delete note
      .addCase(deleteNote.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const noteIndex = state.notes.findIndex(note => note.id === action.payload);
        if (noteIndex !== -1) {
          const deletedNote = state.notes[noteIndex];
          state.notes.splice(noteIndex, 1);
          // Store for undo functionality
          state.recentlyDeleted = {
            note: deletedNote,
            timestamp: new Date().toISOString()
          };
        }
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể xóa ghi chú';
      })
      
      // Toggle pin
      .addCase(togglePinNote.pending, (state) => {
        state.error = undefined;
      })
      .addCase(togglePinNote.fulfilled, (state, action) => {
        const { id, isPinned, updatedAt } = action.payload;
        const noteIndex = state.notes.findIndex(note => note.id === id);
        if (noteIndex !== -1) {
          state.notes[noteIndex].isPinned = isPinned;
          state.notes[noteIndex].updatedAt = updatedAt;
        }
      })
      .addCase(togglePinNote.rejected, (state, action) => {
        state.error = action.error.message || 'Không thể cập nhật ghi chú';
      });
  }
});

export const {
  setSearch,
  setTagFilter,
  setSortBy,
  toggleShowPinnedOnly,
  clearFilters,
  clearError,
  undoDelete,
  clearRecentlyDeleted
} = notesSlice.actions;

export default notesSlice.reducer;
