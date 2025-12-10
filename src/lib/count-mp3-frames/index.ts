import { createReadStream, ReadStream } from 'fs';
import { lookupTables } from '../lookup-tables';
import { FrameCount, FrameLength } from '../../types/count-mp3-frames';

export const countMp3Frames = async (filePath: string): Promise<FrameCount> => {
  return new Promise((resolve, reject) => {
    const stream: ReadStream = createReadStream(filePath);

    let buffer = Buffer.alloc(0);
    let offset = 0;
    let frames: FrameCount = 0;
    let id3Skipped = false;

    // Streaming parser
    stream.on('data', (chunk: string | Buffer<ArrayBufferLike>) => {
      buffer = Buffer.concat([buffer.slice(offset), chunk as Buffer<ArrayBufferLike>]); // keep only remainder
      offset = 0;

      // Skip ID3 header once
      if (!id3Skipped && buffer.length >= 10 && buffer.slice(0, 3).toString() === 'ID3') {
        const size =
          (buffer[6] & 0x7f) * 0x200000 +
          (buffer[7] & 0x7f) * 0x4000 +
          (buffer[8] & 0x7f) * 0x80 +
          (buffer[9] & 0x7f);

        offset = 10 + size;
        id3Skipped = true;
      }

      while (offset + 4 <= buffer.length) {
        // Detect MP3 sync
        if (buffer[offset] === 0xFF && (buffer[offset + 1] & 0xE0) === 0xE0) {

          const versionBits = (buffer[offset + 1] & 0x18) >> 3;
          const layerBits = (buffer[offset + 1] & 0x06) >> 1;
          const bitrateIndex = (buffer[offset + 2] & 0xF0) >> 4;
          const sampleIndex = (buffer[offset + 2] & 0x0C) >> 2;
          const padding = (buffer[offset + 2] & 0x02) >> 1;

          const version = lookupTables.mpegVersions[versionBits];
          const layer = lookupTables.layers[layerBits];

          if (!version || !layer) { offset++; continue; }
          const bitrate = lookupTables.bitrates[version][layer][bitrateIndex];
          const sampleRate = lookupTables.sampleRates[version][sampleIndex];

          if (!bitrate || !sampleRate) { offset++; continue; }

          let frameLength: FrameLength;
          if (layer === 1)
            frameLength = ((12 * (bitrate * 1000)) / sampleRate + padding) * 4;
          else {
            const coef = version === '1' ? 144 : 72;
            frameLength = Math.floor((coef * (bitrate * 1000)) / sampleRate) + padding;
          }

          if (offset + frameLength > buffer.length)
            break; // wait for more data

          frames++;
          offset += frameLength;

        } else offset++; // resync
      }
    });

    stream.on('end', () => resolve(frames));
    stream.on('error', reject);
  });
}
