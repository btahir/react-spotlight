import { fireEvent, render } from '@testing-library/react'
import { SpotlightOverlay } from '../../src/overlay/spotlight-overlay.tsx'
import type { ElementRect } from '../../src/types.ts'

const targetRect: ElementRect = {
  x: 100,
  y: 200,
  width: 300,
  height: 150,
}

describe('SpotlightOverlay', () => {
  it('renders an overlay div with class "spotlight-overlay"', () => {
    const { container } = render(<SpotlightOverlay targetRect={null} />)
    const overlay = container.querySelector('.spotlight-overlay')
    expect(overlay).toBeInTheDocument()
  })

  it('applies clip-path with evenodd fill rule when targetRect is provided', () => {
    const { container } = render(
      <SpotlightOverlay targetRect={targetRect} padding={8} radius={4} />,
    )
    const overlay = container.querySelector('.spotlight-overlay') as HTMLElement
    expect(overlay.style.clipPath).toContain('path(evenodd,')
    // The path should contain coordinates derived from the target rect
    expect(overlay.style.clipPath).not.toBe('')
  })

  it('applies empty clip-path when targetRect is null', () => {
    const { container } = render(<SpotlightOverlay targetRect={null} />)
    const overlay = container.querySelector('.spotlight-overlay') as HTMLElement
    // Empty clip-path is a full-viewport rect with no cutout
    expect(overlay.style.clipPath).toContain('path(')
    // It should only have the outer rectangle (M, H, V, H, Z) with no inner cutout
    const clipPath = overlay.style.clipPath
    expect(clipPath).toContain('M 0 0')
  })

  it('sets background color from overlayColor prop', () => {
    const { container } = render(
      <SpotlightOverlay targetRect={null} overlayColor="rgba(255, 0, 0, 0.8)" />,
    )
    const overlay = container.querySelector('.spotlight-overlay') as HTMLElement
    expect(overlay.style.backgroundColor).toBe('rgba(255, 0, 0, 0.8)')
  })

  it('sets transition duration', () => {
    const { container } = render(<SpotlightOverlay targetRect={null} transitionDuration={500} />)
    const overlay = container.querySelector('.spotlight-overlay') as HTMLElement
    expect(overlay.style.transitionDuration).toBe('500ms')
  })

  it('calls onClick when overlay is clicked', () => {
    const handleClick = vi.fn()
    const { container } = render(<SpotlightOverlay targetRect={null} onClick={handleClick} />)
    const overlay = container.querySelector('.spotlight-overlay') as HTMLElement
    fireEvent.click(overlay)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('keeps pointer-events as "auto" when interactive is true', () => {
    const { container } = render(<SpotlightOverlay targetRect={null} interactive={true} />)
    const overlay = container.querySelector('.spotlight-overlay') as HTMLElement
    expect(overlay.style.pointerEvents).toBe('auto')
  })

  it('sets pointer-events to "auto" when interactive is false (default)', () => {
    const { container } = render(<SpotlightOverlay targetRect={null} />)
    const overlay = container.querySelector('.spotlight-overlay') as HTMLElement
    expect(overlay.style.pointerEvents).toBe('auto')
  })

  it('has aria-hidden="true"', () => {
    const { container } = render(<SpotlightOverlay targetRect={null} />)
    const overlay = container.querySelector('.spotlight-overlay') as HTMLElement
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
  })
})
