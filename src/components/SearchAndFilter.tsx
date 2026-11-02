"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { NoteMetadata } from "@/types/note";

interface SearchAndFilterProps {
  initialNotes: NoteMetadata[];
}

export default function SearchAndFilter({ initialNotes }: SearchAndFilterProps) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    initialNotes.forEach((n) => n.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [initialNotes]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return initialNotes.filter((note) => {
      const matchesTag = selectedTag ? note.tags?.includes(selectedTag) : true;
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.excerpt.toLowerCase().includes(q) ||
        note.tags?.some((t) => t.toLowerCase().includes(q));

      return matchesTag && matchesQuery;
    });
  }, [initialNotes, query, selectedTag]);

  return (
    <div className="space-y-8">
      {/* Search and Tag Controls */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-purple-950/20">
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes by title, keywords, or content..."
            className="w-full pl-12 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm sm:text-base"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tag Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
            Tags:
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-xs px-3 py-1 rounded-full transition-all font-medium ${
              selectedTag === null
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            All Notes ({initialNotes.length})
          </button>
          {allTags.map((tag) => {
            const count = initialNotes.filter((n) => n.tags?.includes(tag)).length;
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`text-xs px-3 py-1 rounded-full transition-all font-medium flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <span>#{tag}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-200">{filteredNotes.length}</strong>{" "}
          note{filteredNotes.length === 1 ? "" : "s"}
        </span>
        {selectedTag && (
          <span className="text-xs text-purple-400">
            Filtered by #{selectedTag}
          </span>
        )}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
          <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3">
            🔍
          </div>
          <p className="text-base font-semibold text-slate-200">No matching notes found</p>
          <p className="text-sm text-slate-400 mt-1">
            Try adjusting your query or resetting the tag filter.
          </p>
          {(query || selectedTag) && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedTag(null);
              }}
              className="mt-4 px-4 py-2 bg-slate-800 text-purple-400 rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map((note) => (
            <Link
              key={note.slug}
              href={`/notes/${note.slug}`}
              className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-1">
                    {note.title}
                  </h3>
                  {note.backlinks && note.backlinks.length > 0 && (
                    <span className="shrink-0 text-[11px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>🔗</span>
                      <span>{note.backlinks.length} backlink{note.backlinks.length === 1 ? "" : "s"}</span>
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {note.excerpt}
                </p>
              </div>

              <div>
                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer metadata */}
                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono truncate max-w-[200px]">
                    {note.filePath}
                  </span>
                  <span className="text-purple-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold">
                    Read Note →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
