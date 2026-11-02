# 🏗️ Architecture & Data Flow

This document details the architecture of the **Next.js Obsidian Loader** workspace.

## High-Level Data Flow

```mermaid
graph LR
    subgraph Obsidian["Obsidian Vault (Local Filesystem)"]
        N1["Note 1.md<br/>[[Note 2]]"]
        N2["Note 2.md<br/>Tags: [nextjs]"]
    end

    subgraph SyncEngine["scripts/obsidian-sync"]
        Parser["gray-matter Parser"]
        LinkResolver["Wikilink & Backlink Resolver"]
        ManifestGen["Manifest Generator"]
    end

    subgraph WebContent["web/content/"]
        Manifest["notes-manifest.json<br/>(Graph & Metadata)"]
        CleanNotes["notes/*.md<br/>(Transformed Content)"]
    end

    subgraph NextJS["web/ (Next.js App Router)"]
        PageList["/notes<br/>(Search & Tags)"]
        PageDetail["/notes/[slug]<br/>(Markdown + Backlinks)"]
        GraphView["Graph Visualizer"]
    end

    N1 & N2 --> Parser
    Parser --> LinkResolver
    LinkResolver --> ManifestGen
    ManifestGen --> Manifest
    ManifestGen --> CleanNotes
    Manifest & CleanNotes --> PageList & PageDetail & GraphView
```

## System Components

### 1. Obsidian Vault
- Stored anywhere on your machine or inside `scripts/obsidian-sync/sample-vault/`.
- Uses standard Obsidian conventions: YAML frontmatter, `[[wikilinks]]`, tags, and aliases.

### 2. Synchronization Pipeline (`scripts/obsidian-sync`)
- Written in TypeScript and executed via `tsx`.
- Recursively traverses markdown files, parsing frontmatter using `gray-matter`.
- Normalizes titles to slugs and replaces `[[Target|Label]]` with web-ready `[Label](/notes/slug)` routes.
- Computes bidirectional relationships (outgoing links and backlinks).
- Generates `notes-manifest.json` for lightning-fast queries and page rendering.

### 3. Web Application (`web/`)
- Powered by Next.js App Router and Tailwind CSS v4.
- Reads `notes-manifest.json` and parsed notes during Server-Side Rendering (SSR) or Static Site Generation (SSG).
- Provides rich note reading, tag filtering, fast search, and backlink exploration.
