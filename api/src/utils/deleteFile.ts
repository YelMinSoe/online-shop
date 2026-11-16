import fs from "node:fs/promises";
import path from "node:path";

export const deleteFile = (urlPath: string) =>
  fs.unlink(path.join(process.cwd(), urlPath)).catch(() => {});
