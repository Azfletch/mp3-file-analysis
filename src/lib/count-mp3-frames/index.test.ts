import * as fs from 'fs';
import * as path from 'path';

import { countMp3Frames } from './';

const file = (pathStr: string) => {
  return path.join(__dirname, '/../test-data/', pathStr);
}

describe('countMp3Frames()', () => {
  const testFile = file('sample.mp3');

  beforeAll(() => {
    if (!fs.existsSync(testFile)) {
      throw new Error(
        `Test MP3 missing at: ${testFile}\n` +
        `Place a sample MP3 file in /test-data/ to run tests.`
      );
    }
  });

  it('should return a valid frame count as a number', async () => {
    const frames = await countMp3Frames(testFile);

    expect(typeof frames).toBe('number');
    expect(frames).toBeGreaterThan(0);
  });

  it('should match known frame count for sample.mp3', async () => {
    const frames = await countMp3Frames(testFile);

    expect(frames).toBe(6090);
  });

  it('should gracefully handle non-MP3 input without throwing', async () => {
    const notAudioFile = file('not-audio.txt');

    const frames = await countMp3Frames(notAudioFile);
    expect(frames).toBe(0);
  });

  it("should return 0 frames for a corrupted/invalid MP3", async () => {
    const invalidMp3File = file("invalid.mp3");

    const frames = await countMp3Frames(invalidMp3File);
    expect(frames).toBe(0);
  });
});
