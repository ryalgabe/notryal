import React from 'react';
import { Tag } from 'lucide-react';
import { useStore } from '../store/useStore';

interface TagSelectorProps {
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
}

export function TagSelector({ selectedTagIds, onToggleTag }: TagSelectorProps) {
  const tags = useStore((state) => state.tags);

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onToggleTag(tag.id)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors ${
            selectedTagIds.includes(tag.id)
              ? `${tag.color} text-white`
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Tag className="w-3 h-3" />
          {tag.name}
        </button>
      ))}
    </div>
  );
}