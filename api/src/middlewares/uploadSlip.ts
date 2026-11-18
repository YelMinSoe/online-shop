// middlewares/uploadSlip.ts
import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const dir = path.join(process.cwd(), "private", "slips");
fs.mkdirSync(dir, { recursive: true });

export const uploadSlip = multer({
  storage: multer.diskStorage({
    destination: dir,
    filename: (_req, file, cb) =>
      cb(
        null,
        `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`,
      ),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});
