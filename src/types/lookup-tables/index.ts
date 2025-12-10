export type MpegVersions = Record<number, '1' | '2' | '2.5' | undefined>
export type Layers = Record<number, 1 | 2 | 3 | undefined>
export type Bitrates = Record<string, Record<number, (number | null)[]>>
export type SampleRates = Record<string, (number | null)[]>
