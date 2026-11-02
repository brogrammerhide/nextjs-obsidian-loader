```json
{
  storage: {
    provider: 'cloudinary',
    cloudName: 'f8k2ntq4',
    assetFolder: 'ruecli-test',
    publicId: 'test-badman_tfbvck',
    secureUrl: 'https://res.cloudinary.com/f8k2ntq4/image/upload/v1793590674/test-badman_tfbvck.avif',
    format: 'avif'
  },
  createdAt: ISODate('2026-11-02T03:37:55.692Z'),
  file: {
    size: NumberInt('90930'),
    extension: 'png'
  },
  filename: 'test-badman.png',
  source: {
    path: '/mnt/c/Users/hideh/Desktop/asus-rubuntu/ruecli/test/fixtures/test-badman.png'
  },
  status: 'PUBLISHED',
  updatedAt: ISODate('2026-11-02T03:37:55.692Z')
}
```

## MongoDB Atlas asset API

Configure the Atlas connection in `web/.env.local`:

```dotenv
MONGODB_URI=
MONGODB_DB=
MONGODB_ASSETS_COLLECTION=assets
```

Set `MONGODB_URI` to the connection string from Atlas and `MONGODB_DB` to the
database containing the asset records. `MONGODB_ASSETS_COLLECTION` is optional
and defaults to `assets`. Keep the connection string server-side; do not prefix
it with `NEXT_PUBLIC_`.

`GET /api/assets` returns published records as `{ "data": [...], "total": n }`.
The response omits each record's source filesystem path. Visit `/assets` to
render the returned records in the gallery. If the connection settings are
missing or Atlas cannot be reached, the endpoint responds with HTTP 500.

## Themes

Use the theme selector in the navigation bar to choose one of eight UI palettes:
Midnight Violet, Obsidian, Ocean, Forest, Sunset, Rose, Paper, or Nord. The
selection applies across the notes, graph, and assets pages and is saved in
browser storage.