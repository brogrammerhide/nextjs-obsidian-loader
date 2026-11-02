import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { NoteMetadata, NotesManifest, NoteDetail, GraphData } from "@/types/note";

const CONTENT_DIR = path.join(process.cwd(), "content");
const MANIFEST_PATH = path.join(CONTENT_DIR, "notes-manifest.json");
const NOTES_DIR = path.join(CONTENT_DIR, "notes");

/**
 * Reads notes manifest from content/notes-manifest.json
 */
export async function getNotesManifest(): Promise<NotesManifest> {
  try {
    const data = await fs.readFile(MANIFEST_PATH, "utf-8");
    return JSON.parse(data) as NotesManifest;
  } catch {
    return {
      generatedAt: new Date().toISOString(),
      totalNotes: 0,
      notes: [],
    };
  }
}

/**
 * Returns all published notes
 */
export async function getAllPublishedNotes(): Promise<NoteMetadata[]> {
  const manifest = await getNotesManifest();
  return manifest.notes.filter((n) => n.published);
}

/**
 * Returns note details including parsed markdown and linked note info
 */
export async function getNoteBySlug(slug: string): Promise<NoteDetail | null> {
  const manifest = await getNotesManifest();
  const meta = manifest.notes.find((n) => n.slug === slug);
  if (!meta) return null;

  try {
    const filePath = path.join(NOTES_DIR, `${slug}.md`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const parsed = matter(fileContent);

    // Resolve backlink objects
    const backlinkNotes = meta.backlinks
      .map((bSlug) => {
        const found = manifest.notes.find((n) => n.slug === bSlug);
        return found
          ? { slug: found.slug, title: found.title, excerpt: found.excerpt }
          : null;
      })
      .filter((n): n is { slug: string; title: string; excerpt: string } => n !== null);

    // Resolve outlink objects
    const outlinkNotes = meta.outlinks
      .map((oTitle) => {
        const targetSlug = oTitle.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
        const found = manifest.notes.find((n) => n.slug === targetSlug || n.title.toLowerCase() === oTitle.toLowerCase());
        return found
          ? { slug: found.slug, title: found.title, excerpt: found.excerpt }
          : null;
      })
      .filter((n): n is { slug: string; title: string; excerpt: string } => n !== null);

    return {
      ...meta,
      content: parsed.content,
      backlinkNotes,
      outlinkNotes,
    };
  } catch (err) {
    console.error(`Error loading note for slug ${slug}:`, err);
    return null;
  }
}

/**
 * Computes graph representation of notes and links
 */
export async function getGraphData(): Promise<GraphData> {
  const manifest = await getNotesManifest();
  const notes = manifest.notes.filter((n) => n.published);

  const nodes = notes.map((note) => ({
    id: note.slug,
    title: note.title,
    slug: note.slug,
    tags: note.tags,
    connections: note.backlinks.length + note.outlinks.length,
  }));

  const nodeIds = new Set(nodes.map((n) => n.id));
  const links: { source: string; target: string }[] = [];

  for (const note of notes) {
    for (const backlink of note.backlinks) {
      if (nodeIds.has(backlink) && nodeIds.has(note.slug)) {
        // Prevent duplicate reversed links
        const exists = links.some(
          (l) =>
            (l.source === backlink && l.target === note.slug) ||
            (l.source === note.slug && l.target === backlink)
        );
        if (!exists) {
          links.push({ source: backlink, target: note.slug });
        }
      }
    }
  }

  return { nodes, links };
}
