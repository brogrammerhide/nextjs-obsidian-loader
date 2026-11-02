# 📝 Obsidian Vault Specifications

This specification outlines the conventions and markdown extensions supported by the **Next.js Obsidian Loader** sync pipeline.

## Frontmatter Fields

Every Obsidian note can optionally include a YAML frontmatter block at the top:

```markdown
---
title: Understanding Bidirectional Linking
date: 2026-11-01
tags: [knowledge-graphs, architecture, web]
aliases: [Bi-links, Graph Connections]
published: true
draft: false
---
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Display title for the note. If omitted, the filename is used. |
| `date` | `string` (YYYY-MM-DD) | Creation or publication date. |
| `tags` | `string[]` or `string` | List of tags for categorizing and filtering. |
| `aliases` | `string[]` | Alternative names for wikilink resolution. |
| `published` | `boolean` | Set to `false` to exclude note from public web index. |
| `draft` | `boolean` | Set to `true` to keep in draft mode. |

## Wikilinks & References

The pipeline parses internal Obsidian links into Next.js routes:

- **Simple Wikilink**: `[[Architecture Overview]]` -> `[Architecture Overview](/notes/architecture-overview)`
- **Piped Wikilink**: `[[Architecture Overview|Read the architecture]]` -> `[Read the architecture](/notes/architecture-overview)`
- **Embeds**: `![[Architecture Overview]]` -> `![Architecture Overview](/notes/architecture-overview)`

## Callout Blocks

Obsidian callout syntax is preserved and formatted:

```markdown
> [!NOTE]
> Useful contextual information.

> [!WARNING]
> Important caution message.
```
