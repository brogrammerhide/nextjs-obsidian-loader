import Navbar from "@/components/Navbar";
import InteractiveGraph from "@/components/InteractiveGraph";
import { getGraphData, getAllPublishedNotes } from "@/lib/notes";

export const dynamic = "force-static";

export const metadata = {
  title: "Interactive Knowledge Graph — Obsidian Loader",
  description: "Explore the interconnected network of your Obsidian notes.",
};

export default async function GraphPage() {
  const [graphData, notes] = await Promise.all([
    getGraphData(),
    getAllPublishedNotes(),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Interactive Knowledge Graph
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Visualizing {notes.length} notes and {graphData.links.length} inter-note connections.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-600 inline-block border border-purple-400"></span>
              Note Node
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-slate-600 inline-block"></span>
              Wikilink / Backlink
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-[550px] flex">
          <InteractiveGraph data={graphData} height={600} />
        </div>
      </main>

      <footer className="border-t border-slate-800/60 py-6 bg-slate-950 text-center text-xs text-slate-500">
        <p>Obsidian Loader • Knowledge Graph Visualization</p>
      </footer>
    </div>
  );
}
