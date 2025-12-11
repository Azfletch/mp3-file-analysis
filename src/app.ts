import path from 'path';
import fs from 'fs';

import express, { Application, NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback, Multer } from 'multer';

import { countMp3Frames } from './lib/count-mp3-frames';
import { FrameCount } from './types/count-mp3-frames';

const app: Application = express();
const uploadFolder: string = './uploads';

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// File filter for mp3 only
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => { // eslint-disable-line no-undef
  if (file.mimetype === 'audio/mpeg' || file.originalname.endsWith('.mp3')) {
    cb(null, true);
  } else {
    cb(new Error('Only MP3 files are allowed!'));
  }
};

const upload: Multer = multer({ storage, fileFilter });

app.get('/', (req: Request, res: Response) => {
  res.send('MP3 File Analysis API is up and running!');
});

app.post('/file-upload', upload.single('mp3'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No mp3 file uploaded' });
  }
  
  const frameCount: FrameCount = await countMp3Frames(req.file.path)

  res.status(200).json({
    frameCount: frameCount
  });
})

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => { // eslint-disable-line
  // Multer errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  if (err && err.message) {
    // Multer fileFilter error
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
