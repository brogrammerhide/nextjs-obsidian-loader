export interface NoteMetadata {
  slug: string;
  title: string;
  date?: string;
  tags: string[];
  aliases: string[];
  published: boolean;
  filePath: string;
  excerpt: string;
  outlinks: string[];
  backlinks: string[];
}

export interface NotesManifest {
  generatedAt: string;
  totalNotes: number;
  notes: NoteMetadata[];
}

export interface NoteDetail extends NoteMetadata {
  content: string;
  backlinkNotes: Array<{ slug: string; title: string; excerpt: string }>;
  outlinkNotes: Array<{ slug: string; title: string; excerpt: string }>;
}

export interface GraphNode {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  connections: number;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
