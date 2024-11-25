export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  tagIds: string[];
}