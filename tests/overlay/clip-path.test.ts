import { generateClipPath, generateEmptyClipPath } from '../../src/overlay/clip-path.ts'
import type { ElementRect } from '../../src/types.ts'

describe('generateClipPath', () => {
  const rect: ElementRect = { x: 100, y: 200, width: 300, height: 150 }

  it('produces a valid SVG path string wrapped in path()', () => {
    const result = generateClipPath(rect, 0, 0)

    expect(result).toMatch(/^path\('.*'\)$/)
  })

  it('contains an outer rectangle and an inner cutout', () => {
    const result = generateClipPath(rect, 0, 0)

    // Outer rectangle starts at M 0 0
    expect(result).toContain('M 0 0')
    // Should have two Z commands — one for outer rect, one for inner cutout
    const zCount = (result.match(/Z/g) || []).length
    expect(zCount).toBe(2)
  })

  it('contains the correct outer viewport size', () => {
    const result = generateClipPath(rect, 0, 0)

    // VIEWPORT_SIZE is 10000
    expect(result).toContain('H 10000')
    expect(result).toContain('V 10000')
  })

  describe('padding', () => {
    it('expands the cutout when padding is applied', () => {
      const noPadding = generateClipPath(rect, 0, 0)
      const withPadding = generateClipPath(rect, 10, 0)

      // With no padding the inner cutout starts at M x (y+r) = M 100 200
      // With 10px padding it starts at M (x-10) (y-10+r) = M 90 190
      expect(noPadding).toContain('M 100 200')
      expect(withPadding).toContain('M 90 190')
    })

    it('increases width and height by 2x padding', () => {
      const result = generateClipPath(rect, 10, 0)

      // Padded: x=90, y=190, w=320, h=170
      // Inner cutout right edge: x + w = 90 + 320 = 410
      expect(result).toContain('H 410')
    })
  })

  describe('radius', () => {
    it('produces Q (quadratic bezier) commands when radius > 0', () => {
      const result = generateClipPath(rect, 0, 8)

      // Should contain Q commands for rounded corners
      expect(result).toContain('Q ')
    })

    it('radius changes the curve control points', () => {
      const r4 = generateClipPath(rect, 0, 4)
      const r16 = generateClipPath(rect, 0, 16)

      // Different radii produce different path strings
      expect(r4).not.toBe(r16)
    })

    it('radius is clamped to half the smaller dimension', () => {
      const smallRect: ElementRect = { x: 0, y: 0, width: 20, height: 10 }
      // Radius 100 should be clamped to min(100, 10, 5) = 5
      const result = generateClipPath(smallRect, 0, 100)

      // The inner cutout start: M 0 5 (x=0, y=0+r where r is clamped to 5)
      expect(result).toContain('M 0 5')
    })

    it('zero radius still produces valid Q commands with zero offset', () => {
      const result = generateClipPath(rect, 0, 0)

      // With r=0: Q x y x y — the control point equals the corner
      expect(result).toContain('Q 100 200 100 200')
    })
  })
})

describe('generateEmptyClipPath', () => {
  it('produces a path string with no cutout', () => {
    const result = generateEmptyClipPath()

    expect(result).toMatch(/^path\('.*'\)$/)
  })

  it('has only one Z command (no inner cutout)', () => {
    const result = generateEmptyClipPath()

    const zCount = (result.match(/Z/g) || []).length
    expect(zCount).toBe(1)
  })

  it('covers the full viewport', () => {
    const result = generateEmptyClipPath()

    expect(result).toContain('M 0 0')
    expect(result).toContain('H 10000')
    expect(result).toContain('V 10000')
  })

  it('is deterministic (same result every call)', () => {
    const a = generateEmptyClipPath()
    const b = generateEmptyClipPath()
    expect(a).toBe(b)
  })
})
