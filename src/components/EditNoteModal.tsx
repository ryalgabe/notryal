import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Note } from '../types';

interface EditNoteModalProps {
  note: Note;
  onSave: (id: string, content: string) => void;
  onClose: () => void;
}

export function EditNoteModal({ note, onSave, onClose }: EditNoteModalProps) {
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setContent(note.content);
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSave(note.id, content);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Edit Note</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note... (Markdown supported)"
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            autoFocus
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}