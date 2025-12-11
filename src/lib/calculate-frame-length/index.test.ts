import { calculateFrameLength } from './'

describe('calculateFrameLength()', () => {
  it('should calculate frameLength for mpeg layer 1', () => {
    const frameLength = calculateFrameLength(1, 1, 1, 1, '1')

    expect(frameLength).toBe(48004)
  })

  it('should calculate frameLength for mpeg layer 2', () => {
    const frameLength = calculateFrameLength(2, 1, 1, 1, '1')

    expect(frameLength).toBe(144001)
  })
})
