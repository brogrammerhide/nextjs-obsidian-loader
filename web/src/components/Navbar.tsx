import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-400 p-[1px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <span className="text-lg font-black bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                OL
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-100 tracking-tight text-base group-hover:text-purple-300 transition-colors">
              Obsidian Loader
            </span>
            <span className="text-xs text-slate-400 font-mono">Digital Garden</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Notes
          </Link>
          <Link
            href="/graph"
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Graph View
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg text-sm font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all ml-2"
          >
            Docs & Specs
          </a>
        </nav>
      </div>
    </header>
  );
}
