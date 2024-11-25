import React, { useState } from 'react';
import { Search, Settings } from 'lucide-react';
import { useStore } from './store/useStore';
import { NoteCard } from './components/NoteCard';
import { NewNoteCard } from './components/NewNoteCard';
import { EditNoteModal } from './components/EditNoteModal';
import { AdminPanel } from './components/AdminPanel';
import { LoginModal } from './components/LoginModal';
import { Note } from './types';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, notes, addNote, updateNote, deleteNote, togglePin } = useStore();
  const [showAdmin, setShowAdmin] = useState(false);

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const filteredNotes = sortedNotes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setShowAdmin(true);
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <button
            onClick={handleAdminClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Admin Panel"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        <div className="space-y-6">
          <NewNoteCard onSave={addNote} />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            {filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={deleteNote}
                onEdit={setEditingNote}
                onTogglePin={togglePin}
              />
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? 'No notes found matching your search.' : 'No notes yet. Write your first note above!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onSave={updateNote}
          onClose={() => setEditingNote(null)}
        />
      )}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}

      {showAdmin && isAuthenticated && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
}

export default App;