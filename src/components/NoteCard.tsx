import React, { useState } from 'react';
import { Trash2, Calendar, Pin, PinOff, Edit, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Note } from '../types';
import { useStore } from '../store/useStore';
import { TagSelector } from './TagSelector';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  onTogglePin: (id: string) => void;
}

export function NoteCard({ note, onDelete, onEdit, onTogglePin }: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const { tags, toggleNoteTag } = useStore();

  const noteTags = tags.filter((tag) => note.tagIds.includes(tag.id));

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
        note.isPinned ? 'border-2 border-blue-400' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowTagSelector(false);
      }}
    >
      <div className="p-4">
        {noteTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {noteTags.map((tag) => (
              <span
                key={tag.id}
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs text-white ${tag.color}`}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="prose prose-sm mb-3">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <time>{new Date(note.updatedAt).toLocaleDateString()}</time>
            </div>
            {(isHovered || note.isPinned) && (
              <button
                onClick={() => onTogglePin(note.id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title={note.isPinned ? "Unpin note" : "Pin note"}
              >
                {note.isPinned ? (
                  <PinOff className="w-4 h-4 text-blue-600" />
                ) : (
                  <Pin className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTagSelector(!showTagSelector)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Manage tags"
            >
              <Tag className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onEdit(note)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Edit note"
            >
              <Edit className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {showTagSelector && (
          <div className="mt-3 pt-3 border-t">
            <TagSelector
              selectedTagIds={note.tagIds}
              onToggleTag={(tagId) => toggleNoteTag(note.id, tagId)}
            />
          </div>
        )}
      </div>
    </div>
  );
}