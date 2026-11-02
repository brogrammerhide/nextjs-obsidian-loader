import AssetGallery from "@/components/AssetGallery";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Asset Storage — Obsidian Loader",
  description: "Browse Cloudinary asset records stored in MongoDB Atlas.",
};

export default function AssetsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-300">
            MongoDB Atlas
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
            Asset storage
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Published Cloudinary assets retrieved from the configured Atlas
            collection.
          </p>
        </div>
        <AssetGallery />
      </main>
    </div>
  );
}
