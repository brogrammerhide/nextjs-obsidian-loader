import { getMongoDatabase } from "@/lib/mongodb";
import type { AssetRecord, AssetsApiResponse } from "@/types/asset";

interface StoredAssetRecord extends Omit<AssetRecord, "createdAt" | "updatedAt"> {
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const runtime = "nodejs";

export async function GET() {
  try {
    const database = await getMongoDatabase();
    const collection = database.collection<StoredAssetRecord>(
      process.env.MONGODB_ASSETS_COLLECTION || "assets",
    );
    const filter = { status: "PUBLISHED" } as const;
    const [records, total] = await Promise.all([
      collection
        .find(filter, {
          projection: {
            _id: 0,
            storage: 1,
            createdAt: 1,
            file: 1,
            filename: 1,
            status: 1,
            updatedAt: 1,
          },
        })
        .sort({ updatedAt: -1 })
        .toArray(),
      collection.countDocuments(filter),
    ]);

    const response: AssetsApiResponse = {
      data: records.map((record) => ({
        ...record,
        createdAt:
          record.createdAt instanceof Date
            ? record.createdAt.toISOString()
            : record.createdAt,
        updatedAt:
          record.updatedAt instanceof Date
            ? record.updatedAt.toISOString()
            : record.updatedAt,
      })),
      total,
    };

    return Response.json(response);
  } catch (error) {
    console.error("Failed to load asset records from MongoDB.", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return Response.json(
      { error: "Unable to load asset records from MongoDB." },
      { status: 500 },
    );
  }
}
