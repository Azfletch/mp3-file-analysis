import request from 'supertest';
import path from 'path';
import app from './app';

const file = (fileName: string) => {
  return path.join(__dirname, './lib/test-data/', fileName);
}

describe('MP3 File Analysis API', () => {
  describe('POST /file-upload', () => {
    it('should accept a valid MP3 file and return the frameCount', async () => {
      const testFile = file('sample.mp3');

      const res = await request(app)
        .post('/file-upload')
        .attach('mp3', testFile);

      expect(res.status).toBe(200);
      expect(res.body.frameCount).toBe(6090);
    });

    it('should reject non-mp3 files', async () => {
      const notAudioFile = file('not-audio.txt');

      const res = await request(app)
        .post('/file-upload')
        .attach('mp3', notAudioFile);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Only MP3 files are allowed!');
    });

    it('should return 400 if no file uploaded', async () => {
      const res = await request(app)
        .post('/file-upload')
        .attach('mp3', '');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('No mp3 file uploaded');
    });
  })

  describe('GET /', () => {
    it('should return 200 okay', async () => {
      const res = await request(app)
        .get('/')

      expect(res.status).toBe(200);
      expect(res.text).toBe('MP3 File Analysis API is up and running!');
    });
  })
});
