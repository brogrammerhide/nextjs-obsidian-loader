import Link from "next/link";
import Navbar from "@/components/Navbar";
import SearchAndFilter from "@/components/SearchAndFilter";
import InteractiveGraph from "@/components/InteractiveGraph";
import { getAllPublishedNotes, getGraphData, getNotesManifest } from "@/lib/notes";

export const dynamic = "force-static";

export const metadata = {
  title: "Obsidian Loader — Digital Garden & Knowledge Graph",
  description: "Seamlessly parse, transform, and browse Obsidian notes with backlinks, tags, and interactive graph exploration in Next.js.",
};

export default async function HomePage() {
  const [notes, graphData, manifest] = await Promise.all([
    getAllPublishedNotes(),
    getGraphData(),
    getNotesManifest(),
  ]);

  // Aggregate stats
  const totalNotes = notes.length;
  const totalLinks = graphData.links.length;
  const allTags = new Set<string>();
  notes.forEach((n) => n.tags?.forEach((t) => allTags.add(t)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800/60 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
            Next.js + Obsidian Sync Pipeline
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-4xl">
            A Modern Digital Garden Powered by{" "}
            <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
              Obsidian & Next.js
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-8">
            Sync markdown files directly from your personal Obsidian vault.
            Preserve internal wikilinks, compute bidirectional backlinks, and explore
            your knowledge network.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <span className="text-xs font-medium text-slate-400">Total Notes</span>
              <p className="text-2xl font-black text-slate-100 mt-1">{totalNotes}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <span className="text-xs font-medium text-slate-400">Connected Links</span>
              <p className="text-2xl font-black text-purple-400 mt-1">{totalLinks}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <span className="text-xs font-medium text-slate-400">Tags Cataloged</span>
              <p className="text-2xl font-black text-indigo-400 mt-1">{allTags.size}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <span className="text-xs font-medium text-slate-400">Sync Status</span>
              <p className="text-sm font-semibold text-emerald-400 mt-2 truncate flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {totalNotes > 0 ? "Synced" : "Awaiting Sync"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        {/* Search & Note Cards Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                Vault Notes
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Browse through all parsed and indexed notes from your vault.
              </p>
            </div>
            <Link
              href="/graph"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-semibold"
            >
              Open Full Graph →
            </Link>
          </div>

          <SearchAndFilter initialNotes={notes} />
        </section>

        {/* Knowledge Graph Preview */}
        {notes.length > 0 && (
          <section className="pt-6 border-t border-slate-800/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                  Knowledge Graph
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Visual map of note interconnections and bidirectional links.
                </p>
              </div>
              <Link
                href="/graph"
                className="text-sm text-purple-400 hover:text-purple-300 font-semibold"
              >
                Full Screen View →
              </Link>
            </div>

            <InteractiveGraph data={graphData} height={420} />
          </section>
        )}

        {/* Sync Instructions Quick Card */}
        <section className="bg-gradient-to-r from-purple-950/30 to-slate-900/50 border border-purple-500/20 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                Syncing Notes from Your Local Obsidian Vault
              </h3>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Run the TypeScript CLI tool in <code className="bg-slate-950/80 px-2 py-0.5 rounded text-purple-300 font-mono text-xs">scripts/obsidian-sync</code> to parse any custom vault directory and update the Next.js digital garden.
              </p>
            </div>
            <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 font-mono text-xs text-purple-300 shrink-0">
              npm run sync -- --vault &quot;/path/to/vault&quot;
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>Next.js Obsidian Loader • Built with Next.js App Router & Tailwind CSS</p>
          <p className="mt-1">
            Last manifest sync: {manifest.generatedAt ? new Date(manifest.generatedAt).toLocaleString() : "Never"}
          </p>
        </div>
      </footer>
    </div>
  );
}
