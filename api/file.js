import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb+srv://varun:varun123@canidots.zqt8i.mongodb.net/?retryWrites=true&w=majority&appName=canidots", { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'files';
let db;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { filename } = req.query;

    if (!db) {
      await client.connect();
      db = client.db(dbName);
    }

    const collection = db.collection('files');
    const file = await collection.findOne({ filename });
    if (file) {
      res.status(200).json({ status: "File found...", file });
    } else {
      res.status(404).json({ status: "File not found..." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
