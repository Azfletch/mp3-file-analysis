import express, { Application, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

import { countMp3Frames } from './lib/count-mp3-frames';

const app: Application = express();
const PORT: number = 3000;

const uploadFolder = './uploads';
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
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype === 'audio/mpeg' || file.originalname.endsWith('.mp3')) {
    cb(null, true);
  } else {
    cb(new Error('Only MP3 files are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

app.get('/', (req: Request, res: Response) => {
  res.send('MP3 File Analysis API is up and running! 🚀');
});

app.post('/file-upload', upload.single('mp3'), async (req: Request, res: Response) => {
  // #swagger.description = 'POST endpoint for uploading a mp3 file to. When a valid file is uploaded, the response contains the frame count of the MP3'

  if (!req.file) {
    return res.status(400).json({ error: 'No mp3 file uploaded' });
  }
  
  const frameCount = await countMp3Frames(req.file.path)

  res.status(200).json({
    message: 'MP3 uploaded successfully!',
    savedAs: req.file.filename,
    location: req.file.path,
    frameCount: frameCount
  });


  // TODO: supertest API
  // TODO: Add types
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
