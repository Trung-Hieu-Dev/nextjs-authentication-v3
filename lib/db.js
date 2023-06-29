import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://admin:Admin123@atlascluster.onkjdyo.mongodb.net/nextjs-auth?retryWrites=true&w=majority"
  );
  return client;
}
