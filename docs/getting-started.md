# 🚀 Getting Started

Follow these steps to set up and run the Next.js Obsidian Loader ecosystem.

## Prerequisites

- **Node.js**: v20 or v24+
- **npm**: v10+ (or pnpm/yarn)
- Optional: An existing **Obsidian Vault**

## 1. Quick Start with Sample Vault

The repository includes a ready-to-use sample vault in `scripts/obsidian-sync/sample-vault`.

### Step 1: Install Dependencies for the Sync Script
```bash
cd scripts/obsidian-sync
npm install
```

### Step 2: Run the Sync Pipeline
```bash
npm run sync
```
This will parse the sample vault notes and write the generated markdown and `notes-manifest.json` into `web/content/`.

### Step 3: Install & Start the Next.js Web App
```bash
cd ../../web
npm install
npm run dev
```
Open your browser at `http://localhost:3000` to view the notes.

---

## 2. Connecting Your Personal Obsidian Vault

You can point the sync script to any directory on your computer:

```bash
cd scripts/obsidian-sync
npm run sync -- --vault "C:/Users/<Username>/Documents/MyVault" --output "../../web/content"
```

### Continuous Watching
To auto-sync as you edit notes inside Obsidian:
```bash
npm run sync:watch -- --vault "C:/Users/<Username>/Documents/MyVault"
```
