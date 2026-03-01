import { render } from '@testing-library/react'
import { lightTheme } from '../../src/themes/default-light.ts'
import { ProgressBar } from '../../src/tooltip/progress-bar.tsx'

describe('ProgressBar', () => {
  it('renders with correct width percentage', () => {
    // current=1, total=4 => (1+1)/4 * 100 = 50%
    const { container } = render(<ProgressBar current={1} total={4} theme={lightTheme} />)

    const bar = container.querySelector('.spotlight-progress-bar') as HTMLElement
    expect(bar).toBeInTheDocument()
    expect(bar.style.width).toBe('50%')
  })

  it('renders 100% on last step', () => {
    // current=3, total=4 => (3+1)/4 * 100 = 100%
    const { container } = render(<ProgressBar current={3} total={4} theme={lightTheme} />)

    const bar = container.querySelector('.spotlight-progress-bar') as HTMLElement
    expect(bar.style.width).toBe('100%')
  })

  it('renders 0% when total is 0', () => {
    const { container } = render(<ProgressBar current={0} total={0} theme={lightTheme} />)

    const bar = container.querySelector('.spotlight-progress-bar') as HTMLElement
    expect(bar.style.width).toBe('0%')
  })

  it('applies theme styles', () => {
    const { container } = render(<ProgressBar current={0} total={3} theme={lightTheme} />)

    const track = container.querySelector('.spotlight-progress') as HTMLElement
    const bar = container.querySelector('.spotlight-progress-bar') as HTMLElement

    // jsdom normalizes hex colors to rgb, so compare height and borderRadius directly
    // and verify background is set (non-empty)
    expect(track.style.height).toBe(lightTheme.progress.height)
    expect(track.style.borderRadius).toBe(lightTheme.progress.borderRadius)
    expect(track.style.background).toBeTruthy()

    expect(bar.style.borderRadius).toBe(lightTheme.progress.borderRadius)
    expect(bar.style.background).toBeTruthy()
  })
})
