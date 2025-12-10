const mpegVersions: Record<number, '1' | '2' | '2.5' | undefined> = {
  0b00: '2.5',
  0b10: '2',
  0b11: '1',
};

const layers: Record<number, 1 | 2 | 3 | undefined> = {
  0b11: 1, // Layer I
  0b10: 2, // Layer II
  0b01: 3, // Layer III
};

const bitrates: Record<string, Record<number, (number | null)[]>> = {
  '1': {
    1: [null, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, null],
    2: [null, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, null],
    3: [null, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, null]
  },
  '2': {
    1: [null, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, null],
    2: [null, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, null],
    3: [null, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, null]
  },
  '2.5': {
    1: [null, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, null],
    2: [null, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, null],
    3: [null, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, null]
  },
};

const sampleRates: Record<string, (number | null)[]> = {
  '1': [44100, 48000, 32000, null],
  '2': [22050, 24000, 16000, null],
  '2.5': [11025, 12000, 8000, null],
};

export const lookupTables = {
  mpegVersions,
  layers,
  bitrates,
  sampleRates
}
