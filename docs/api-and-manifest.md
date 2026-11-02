# ⚙️ API & Manifest Specification

When `scripts/obsidian-sync` executes, it generates a centralized metadata file at `web/content/notes-manifest.json`. This document defines its JSON schema and how Next.js consumes it.

## Manifest Schema

```json
{
  "generatedAt": "2026-11-01T20:45:00.000Z",
  "totalNotes": 2,
  "notes": [
    {
      "slug": "architecture-overview",
      "title": "Architecture Overview",
      "date": "2026-11-01",
      "tags": ["architecture", "design"],
      "aliases": [],
      "published": true,
      "filePath": "Architecture Overview.md",
      "excerpt": "The system consists of three layers: 1. Obsidian Vault... 2. Sync Pipeline... 3. Web Application...",
      "outlinks": ["Welcome"],
      "backlinks": ["welcome"]
    }
  ]
}
```

## Data Types (TypeScript)

```typescript
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
```

## Consuming in Next.js

```typescript
import manifestData from "@/../content/notes-manifest.json";

export async function getNotesList() {
  return manifestData.notes.filter((note) => note.published);
}

export async function getNoteBySlug(slug: string) {
  return manifestData.notes.find((note) => note.slug === slug);
}
```
