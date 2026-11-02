---
title: Architecture Overview
date: 2026-11-01T00:00:00.000Z
tags:
  - architecture
  - design
published: true
slug: architecture-overview
backlinks:
  - welcome
---

# Architecture Overview

The system consists of three layers:

1. **Obsidian Vault**: Your local personal knowledge base.
2. **Sync Pipeline** (`scripts/obsidian-sync`): Resolves `[wikilinks](/notes/wikilinks)`, computes backlinks, and emits a structured manifest.
3. **Web Application** (`web/`): Next.js app rendering the digital garden with full search, tags, and interactive backlink exploration.

Back to [Home Note](/notes/welcome).
