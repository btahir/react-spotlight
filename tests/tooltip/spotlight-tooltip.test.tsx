import { render, screen } from '@testing-library/react'
import { lightTheme } from '../../src/themes/default-light.ts'
import { SpotlightTooltip } from '../../src/tooltip/spotlight-tooltip.tsx'
import type { SpotlightStep } from '../../src/types.ts'

// Mock @floating-ui/react-dom to return stable values
vi.mock('@floating-ui/react-dom', () => ({
  useFloating: () => ({
    refs: {
      setFloating: vi.fn(),
      setReference: vi.fn(),
    },
    floatingStyles: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
    },
    placement: 'bottom' as const,
    middlewareData: {
      arrow: { x: 10, y: undefined },
    },
  }),
  autoUpdate: vi.fn(),
  offset: () => ({}),
  flip: () => ({}),
  shift: () => ({}),
  arrow: () => ({}),
}))

const baseStep: SpotlightStep = {
  target: '#test-target',
  title: 'Test Title',
  content: 'Test content body',
}

const defaultProps = {
  step: baseStep,
  currentIndex: 0,
  totalSteps: 3,
  onNext: vi.fn(),
  onPrevious: vi.fn(),
  onSkip: vi.fn(),
  onClose: vi.fn(),
  theme: lightTheme,
}

describe('SpotlightTooltip', () => {
  let targetElement: HTMLElement

  beforeEach(() => {
    targetElement = document.createElement('div')
    targetElement.id = 'test-target'
    document.body.appendChild(targetElement)
  })

  afterEach(() => {
    document.body.removeChild(targetElement)
  })

  it('returns null when targetElement is null', () => {
    const { container } = render(<SpotlightTooltip {...defaultProps} targetElement={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders with role="dialog" when targetElement is provided', () => {
    render(<SpotlightTooltip {...defaultProps} targetElement={targetElement} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-labelledby="spotlight-title" and aria-describedby="spotlight-content"', () => {
    render(<SpotlightTooltip {...defaultProps} targetElement={targetElement} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'spotlight-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'spotlight-content')
  })

  it('renders step title and content', () => {
    render(<SpotlightTooltip {...defaultProps} targetElement={targetElement} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test content body')).toBeInTheDocument()
  })

  it('renders custom tooltip via renderTooltip prop', () => {
    const renderTooltip = vi.fn(({ step }) => (
      <div data-testid="custom-tooltip">{step.title} custom</div>
    ))

    render(
      <SpotlightTooltip
        {...defaultProps}
        targetElement={targetElement}
        renderTooltip={renderTooltip}
      />,
    )

    expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument()
    expect(screen.getByText('Test Title custom')).toBeInTheDocument()
    expect(renderTooltip).toHaveBeenCalledWith(
      expect.objectContaining({
        step: baseStep,
        currentIndex: 0,
        totalSteps: 3,
      }),
    )
  })

  it('applies theme styles', () => {
    render(<SpotlightTooltip {...defaultProps} targetElement={targetElement} />)
    const dialog = screen.getByRole('dialog')
    // jsdom normalizes hex colors to rgb, so check with toHaveStyle
    expect(dialog).toHaveStyle({ background: lightTheme.tooltip.background })
    expect(dialog).toHaveStyle({ color: lightTheme.tooltip.color })
    expect(dialog.style.borderRadius).toBe(lightTheme.tooltip.borderRadius)
  })
})
