# 🪨 Next.js Obsidian Loader

A monorepo workspace for syncing notes from an [Obsidian](https://obsidian.md) vault and serving them as a modern, high-performance digital garden using [Next.js](https://nextjs.org).

## 📁 Repository Projects

This workspace contains three core projects:

1. **[`web/`](web/)**: Next.js App Router application styled with Tailwind CSS v4. Features page generation, fast search, tag filtering, and bidirectional backlink exploration.
2. **[`scripts/obsidian-sync/`](scripts/obsidian-sync/)**: TypeScript CLI pipeline (`tsx`) that extracts YAML frontmatter, resolves `[[wikilinks]]` to Next.js routes, builds backlinks, and writes parsed content & `notes-manifest.json`.
3. **[`docs/`](docs/)**: Architectural documentation, Getting Started guide, Obsidian vault specification, and manifest schema definitions.

## ⚡ Quick Start

### 1. Sync Obsidian Notes
Run the TypeScript sync pipeline against the bundled sample vault:

```bash
cd scripts/obsidian-sync
npm install
npm run sync
```

### 2. Launch Next.js Web App
Start the Next.js development server:

```bash
cd ../../web
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Documentation

- [System Architecture](docs/architecture.md)
- [Getting Started Guide](docs/getting-started.md)
- [Obsidian Vault Specifications](docs/obsidian-vault-spec.md)
- [Manifest & Graph API](docs/api-and-manifest.md)
