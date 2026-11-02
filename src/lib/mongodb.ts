import { MongoClient, type Db } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export async function getMongoDatabase(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }
  if (!databaseName) {
    throw new Error("MONGODB_DB is not configured.");
  }

  if (!globalForMongo.mongoClientPromise) {
    const clientPromise = new MongoClient(uri).connect();
    globalForMongo.mongoClientPromise = clientPromise;
    void clientPromise.catch(() => {
      if (globalForMongo.mongoClientPromise === clientPromise) {
        delete globalForMongo.mongoClientPromise;
      }
    });
  }

  const client = await globalForMongo.mongoClientPromise;
  return client.db(databaseName);
}
