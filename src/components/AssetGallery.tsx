"use client";

import { useEffect, useState } from "react";
import type { AssetsApiResponse } from "@/types/asset";

export default function AssetGallery() {
  const [assets, setAssets] = useState<AssetsApiResponse["data"]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAssets() {
      try {
        const response = await fetch("/api/assets", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Asset request failed (${response.status})`);
        }

        const result: AssetsApiResponse = await response.json();
        setAssets(result.data);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load assets.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadAssets();
    return () => controller.abort();
  }, []);

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Stored assets
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Published Cloudinary records stored in MongoDB Atlas.
          </p>
        </div>
        {!isLoading && !error && (
          <span className="shrink-0 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-sm text-purple-300">
            {assets.length} records
          </span>
        )}
      </div>

      {isLoading ? (
        <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
          Loading asset records…
        </p>
      ) : error ? (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/30 p-6 text-red-300">
          Could not load asset records: {error}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <article
              key={asset.storage.publicId}
              className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-100">
                    {asset.filename}
                  </h3>
                  <p className="mt-1 truncate font-mono text-xs text-slate-500">
                    {asset.storage.publicId}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                  {asset.status}
                </span>
              </div>

              <dl className="grid grid-cols-1 gap-y-3 text-sm sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <dt className="text-xs text-slate-500">Provider</dt>
                  <dd className="mt-0.5 text-slate-300">{asset.storage.provider}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Folder</dt>
                  <dd className="mt-0.5 truncate text-slate-300">
                    {asset.storage.assetFolder}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Format</dt>
                  <dd className="mt-0.5 uppercase text-slate-300">
                    {asset.storage.format}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Original file</dt>
                  <dd className="mt-0.5 text-slate-300">
                    {asset.file.extension.toUpperCase()} ·{" "}
                    {(asset.file.size / 1024).toFixed(1)} KB
                  </dd>
                </div>
              </dl>

              <a
                href={asset.storage.secureUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 block truncate border-t border-slate-800 pt-3 text-xs text-purple-300 hover:text-purple-200"
              >
                {asset.storage.secureUrl}
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
