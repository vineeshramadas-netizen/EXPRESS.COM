import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const localUploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(localUploadDir)) fs.mkdirSync(localUploadDir, { recursive: true });

export const upload = multer({ dest: localUploadDir, limits: { fileSize: 5 * 1024 * 1024 } });

export async function saveLocal(file: Express.Multer.File) {
  const ext = path.extname(file.originalname);
  const newName = `${crypto.randomUUID()}${ext}`;
  const newPath = path.join(localUploadDir, newName);
  await fs.promises.rename(file.path, newPath);
  return { key: newName, url: `/uploads/${newName}` };
}
