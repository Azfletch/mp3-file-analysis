import { FrameLength, Layer, Version } from '../../types/calculate-frame-length';

export const calculateFrameLength = (layer: Layer, bitrate: number, sampleRate: number, padding: number, version: Version): FrameLength => {
  let frameLength: FrameLength;

  if (layer === 1)
    frameLength = ((12 * (bitrate * 1000)) / sampleRate + padding) * 4;
  else {
    const coef = version === '1' ? 144 : 72;
    frameLength = Math.floor((coef * (bitrate * 1000)) / sampleRate) + padding;
  }

  return frameLength
}
