import path from "path";
import fs from "fs";

const storagePath = "/tmp/storage";

export default function handler(req, res) {
  const { file_name } = req.query;
  const filePath = path.join(storagePath, file_name);

  if (fs.existsSync(filePath)) {
    res.status(200).download(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
}
