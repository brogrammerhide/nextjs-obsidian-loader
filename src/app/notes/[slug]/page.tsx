import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getNoteBySlug, getAllPublishedNotes } from "@/lib/notes";

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";

export async function generateStaticParams() {
  const notes = await getAllPublishedNotes();
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: NotePageProps) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note) return { title: "Note Not Found" };
  return {
    title: `${note.title} — Obsidian Loader`,
    description: note.excerpt,
  };
}

/**
 * Simple markdown parser for Obsidian notes (headings, callouts, lists, paragraphs, code)
 */
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let inCallout = false;
  let calloutType = "NOTE";
  let calloutBuffer: string[] = [];

  const flushCallout = (key: string) => {
    if (calloutBuffer.length > 0) {
      const isWarn = calloutType.includes("WARN") || calloutType.includes("CAUTION");
      const isTip = calloutType.includes("TIP");

      renderedElements.push(
        <div
          key={key}
          className={`my-6 rounded-xl p-4 sm:p-5 border ${
            isWarn
              ? "bg-amber-950/20 border-amber-500/40 text-amber-200"
              : isTip
              ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
              : "bg-purple-950/20 border-purple-500/40 text-purple-200"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-2">
            <span>{isWarn ? "⚠️" : isTip ? "💡" : "📌"}</span>
            <span>{calloutType}</span>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-slate-200">
            {calloutBuffer.join(" ")}
          </p>
        </div>
      );
      calloutBuffer = [];
      inCallout = false;
    }
  };

  const flushCode = (key: string) => {
    if (codeBuffer.length > 0) {
      renderedElements.push(
        <pre
          key={key}
          className="my-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-purple-200 font-mono text-sm overflow-x-auto"
        >
          <code>{codeBuffer.join("\n")}</code>
        </pre>
      );
      codeBuffer = [];
      inCodeBlock = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        flushCode(`code-${idx}`);
      } else {
        if (inCallout) flushCallout(`callout-${idx}`);
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Callout detection: > [!NOTE]
    const calloutMatch = trimmed.match(/^>\s*\[!([A-Z]+)\]/i);
    if (calloutMatch) {
      if (inCallout) flushCallout(`callout-${idx}`);
      inCallout = true;
      calloutType = calloutMatch[1].toUpperCase();
      return;
    }

    if (inCallout) {
      if (trimmed.startsWith(">")) {
        calloutBuffer.push(trimmed.replace(/^>\s*/, ""));
        return;
      } else if (trimmed === "") {
        // empty line inside callout
        return;
      } else {
        flushCallout(`callout-${idx}`);
      }
    }

    // Empty line
    if (!trimmed) {
      return;
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      renderedElements.push(
        <h1
          key={`h1-${idx}`}
          className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-8 mb-4 tracking-tight"
        >
          {trimmed.replace(/^#\s+/, "")}
        </h1>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      renderedElements.push(
        <h2
          key={`h2-${idx}`}
          className="text-2xl sm:text-3xl font-bold text-slate-100 mt-8 mb-4 border-b border-slate-800 pb-2 tracking-tight"
        >
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith("### ")) {
      renderedElements.push(
        <h3
          key={`h3-${idx}`}
          className="text-xl font-bold text-slate-200 mt-6 mb-3 tracking-tight"
        >
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
      return;
    }

    // Bullet lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const listContent = trimmed.replace(/^[-*]\s+/, "");
      renderedElements.push(
        <li
          key={`li-${idx}`}
          className="ml-6 list-disc text-slate-300 leading-relaxed my-1.5"
          dangerouslySetInnerHTML={{
            __html: parseInlineMarkdown(listContent),
          }}
        />
      );
      return;
    }

    // Numbered lists
    if (/^\d+\.\s+/.test(trimmed)) {
      const listContent = trimmed.replace(/^\d+\.\s+/, "");
      renderedElements.push(
        <li
          key={`oli-${idx}`}
          className="ml-6 list-decimal text-slate-300 leading-relaxed my-1.5"
          dangerouslySetInnerHTML={{
            __html: parseInlineMarkdown(listContent),
          }}
        />
      );
      return;
    }

    // Standard Paragraph
    renderedElements.push(
      <p
        key={`p-${idx}`}
        className="text-slate-300 leading-relaxed my-4 text-base sm:text-lg"
        dangerouslySetInnerHTML={{
          __html: parseInlineMarkdown(line),
        }}
      />
    );
  });

  if (inCallout) flushCallout("callout-end");
  if (inCodeBlock) flushCode("code-end");

  return <div className="note-content space-y-1">{renderedElements}</div>;
}

/**
 * Parses bold, italics, inline code, and links
 */
function parseInlineMarkdown(text: string): string {
  return text
    .replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300 font-mono text-xs">$1</code>'
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-100">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic text-slate-200">$1</em>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-purple-400 underline decoration-purple-500/50 hover:decoration-purple-300 transition-colors font-medium">$1</a>'
    );
}

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-8">
          <Link
            href="/"
            className="hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            ← Back to Notes
          </Link>
          <span>/</span>
          <span className="text-slate-500 font-mono">{note.filePath}</span>
        </div>

        {/* Note Header */}
        <header className="mb-10 pb-8 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Published Note
            </span>
            {note.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800/80 text-purple-300 font-mono border border-slate-700/60"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight mb-4">
            {note.title}
          </h1>

          {note.date && (
            <p className="text-xs text-slate-400 font-mono">
              Date: {new Date(note.date).toLocaleDateString()}
            </p>
          )}
        </header>

        {/* Note Body */}
        <article className="prose prose-invert max-w-none mb-16">
          <MarkdownRenderer content={note.content} />
        </article>

        {/* Bidirectional Linking Grid */}
        <section className="pt-10 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Backlinks */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🔗</span>
              <h2 className="text-lg font-bold text-slate-100">
                Backlinks ({note.backlinkNotes.length})
              </h2>
            </div>
            {note.backlinkNotes.length === 0 ? (
              <p className="text-sm text-slate-500 italic">
                No other notes currently link directly to this note.
              </p>
            ) : (
              <div className="space-y-3">
                {note.backlinkNotes.map((bl) => (
                  <Link
                    key={bl.slug}
                    href={`/notes/${bl.slug}`}
                    className="block group bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-purple-500/40 rounded-xl p-4 transition-all"
                  >
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                      {bl.title}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {bl.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Outlinks */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">↗️</span>
              <h2 className="text-lg font-bold text-slate-100">
                Outgoing Links ({note.outlinkNotes.length})
              </h2>
            </div>
            {note.outlinkNotes.length === 0 ? (
              <p className="text-sm text-slate-500 italic">
                This note does not link to any other indexed notes.
              </p>
            ) : (
              <div className="space-y-3">
                {note.outlinkNotes.map((ol) => (
                  <Link
                    key={ol.slug}
                    href={`/notes/${ol.slug}`}
                    className="block group bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-purple-500/40 rounded-xl p-4 transition-all"
                  >
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                      {ol.title}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {ol.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 bg-slate-950 text-center text-xs text-slate-500">
        <p>Obsidian Loader • Next.js App Router</p>
      </footer>
    </div>
  );
}
