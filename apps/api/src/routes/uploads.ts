import { Router } from 'express';
import { requireAdmin } from '../middleware/auth';
import { saveLocal, upload } from '../services/storage.service';

export const uploadsRouter = Router();

uploadsRouter.post('/', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'no_file' });
  const saved = await saveLocal(req.file);
  res.status(201).json({ success: true, data: saved });
});
