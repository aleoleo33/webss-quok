export type ViewType = 'home' | 'dashboard' | 'connect' | 'data' | 'splash' | 'nfc-connect' | 'nfc-connected';

export type WorkspaceSubView = 'dashboard' | 'notes' | 'table' | 'canvas' | 'docs' | 'database' | 'files';
export type DatabaseViewType = 'grid' | 'kanban' | 'calendar' | 'timeline';

export interface DocBlock {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'bullet' | 'numbered' | 'quote' | 'code' | 'callout' | 'divider' | 'toggle';
  content: string;
  checked?: boolean;
  lang?: string;
  icon?: string;
}

export interface DocPage {
  id: string;
  title: string;
  emoji: string;
  blocks: DocBlock[];
  createdAt: string;
  updatedAt: string;
  children?: string[];
}

export type ColumnType = 'text' | 'number' | 'select' | 'multi_select' | 'date' | 'checkbox' | 'url' | 'person';

export interface DatabaseColumn {
  id: string;
  name: string;
  type: ColumnType;
  width?: number;
  options?: { label: string; color: string }[];
}

export interface DatabaseRow {
  id: string;
  cells: Record<string, string | boolean | string[] | null>;
}

export interface CanvasNode {
  id: string;
  type: 'sticky' | 'shape' | 'text' | 'connector';
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
  color: string;
  shape?: 'rect' | 'circle' | 'diamond';
  from?: string;
  to?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'sheet' | 'folder' | 'video';
  size: string;
  modified: string;
  tags: string[];
  shared: boolean;
  folderId?: string;
}

export interface PinnedItem {
  id: string;
  title: string;
  type: 'note' | 'table' | 'canvas';
  color: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  tags: { label: string; color: string }[];
  status: 'todo' | 'in-progress' | 'done';
}
