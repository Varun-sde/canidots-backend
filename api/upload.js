import multer from "multer";
import path from "path";
import fs from "fs";
import { MongoClient } from "mongodb";

const storagePath = "/tmp/storage";
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, storagePath),
  filename: (_, file, cb) => cb(null, `file${Date.now()}.${file.originalname.split(".").pop()}`),
});
const upload = multer({ storage });

const client = new MongoClient("mongodb+srv://varun:varun123@canidots.zqt8i.mongodb.net/?retryWrites=true&w=majority&appName=canidots", { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'files';
let db;

export default async function handler(req, res) {
  if (req.method === "POST") {
    await upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Error uploading file", err });
      }

      if (!db) {
        await client.connect();
        db = client.db(dbName);
      }

      const collection = db.collection('files');
      if (Math.floor(fs.readdirSync(storagePath).reduce((total, file) => total + fs.statSync(path.join(storagePath, file)).size, 0) / (1024 * 1024 * 1024)) >= 8) {
        await collection.deleteMany({});
        fs.readdirSync(storagePath).forEach(file => fs.unlinkSync(path.join(storagePath, file)));
      }

      if (req.file) {
        const { originalname, encoding, mimetype, filename, size } = req.file;
        try {
          const file = await collection.insertOne({ originalname, encoding, mimetype, filename, size });
          res.status(200).json({ status: "File uploaded...", file });
        } catch (err) {
          res.status(500).json({ message: "File is not uploaded", err });
        }
      } else {
        res.status(500).json({ status: "File not uploaded, try again." });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
