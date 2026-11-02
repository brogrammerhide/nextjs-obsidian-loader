# 📚 Project Documentation

Welcome to the **Next.js Obsidian Loader** repository documentation. This repository is organized as a multi-project workspace designed to bridge local Obsidian vaults with a modern, fast Next.js digital garden.

## 📁 Repository Structure

```
.
├── web/                     # Next.js App Router web application
│   ├── src/                 # Application source code (components, pages, styles)
│   ├── content/             # Synced markdown notes & notes-manifest.json
│   ├── public/              # Static assets
│   └── package.json
│
├── scripts/                 # Utility scripts & tooling
│   └── obsidian-sync/       # TypeScript pipeline to parse & transform Obsidian notes
│       ├── src/index.ts     # Core sync & wikilink resolution engine
│       ├── sample-vault/    # Starter Obsidian notes for local testing
│       └── package.json
│
└── docs/                    # Architecture & engineering guides
    ├── README.md            # Documentation directory index (this file)
    ├── architecture.md      # Data flow & system architecture
    ├── getting-started.md   # Setup, commands, and workflow guide
    ├── obsidian-vault-spec.md # Vault conventions, markdown syntax & frontmatter
    └── api-and-manifest.md  # JSON manifest schema & graph relations
```

## 📖 Available Guides

- [Architecture & Data Flow](architecture.md) — How Obsidian markdown notes are transformed and loaded into Next.js.
- [Getting Started Guide](getting-started.md) — Prerequisites, installation, and daily development workflow.
- [Obsidian Vault Specifications](obsidian-vault-spec.md) — Frontmatter keys, wikilink syntax, and callout conventions.
- [API & Manifest Specification](api-and-manifest.md) — JSON schema for note metadata, backlinks, and graph indexing.
