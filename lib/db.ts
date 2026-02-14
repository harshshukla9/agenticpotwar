import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

let client: MongoClient;
let db: Db;

export async function getDb(): Promise<Db> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required. Add it to .env.local");
  }
  if (db) return db;
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db("potwar");
  await ensureIndexes(db);
  return db;
}

async function ensureIndexes(database: Db): Promise<void> {
  const col = database.collection("pot_activity");
  await col.createIndex({ round: 1, timestamp: -1 });
  await col.createIndex({ timestamp: -1 });
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = undefined as unknown as MongoClient;
    db = undefined as unknown as Db;
  }
}
