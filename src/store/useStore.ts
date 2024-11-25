import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, Tag } from '../types';

interface AdminState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

interface TagState {
  tags: Tag[];
  addTag: (name: string, color: string) => void;
  deleteTag: (id: string) => void;
}

interface NoteState {
  notes: Note[];
  addNote: (content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  toggleNoteTag: (noteId: string, tagId: string) => void;
}

interface Store extends AdminState, TagState, NoteState {}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // Admin state
      isAuthenticated: false,
      login: (password) => {
        const isValid = password === 'admin';
        if (isValid) {
          set({ isAuthenticated: true });
        }
        return isValid;
      },
      logout: () => set({ isAuthenticated: false }),

      // Tag state
      tags: [],
      addTag: (name, color) =>
        set((state) => ({
          tags: [...state.tags, { id: crypto.randomUUID(), name, color }],
        })),
      deleteTag: (id) =>
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
          notes: state.notes.map((note) => ({
            ...note,
            tagIds: note.tagIds.filter((tagId) => tagId !== id),
          })),
        })),

      // Note state
      notes: [],
      addNote: (content) =>
        set((state) => ({
          notes: [
            {
              id: crypto.randomUUID(),
              content,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              isPinned: false,
              tagIds: [],
            },
            ...state.notes,
          ],
        })),
      updateNote: (id, content) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, content, updatedAt: Date.now() }
              : note
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),
      togglePin: (id) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isPinned: !note.isPinned } : note
          ),
        })),
      toggleNoteTag: (noteId, tagId) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  tagIds: note.tagIds.includes(tagId)
                    ? note.tagIds.filter((id) => id !== tagId)
                    : [...note.tagIds, tagId],
                }
              : note
          ),
        })),
    }),
    {
      name: 'notes-storage',
    }
  )
);