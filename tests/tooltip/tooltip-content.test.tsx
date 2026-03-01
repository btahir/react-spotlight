import { fireEvent, render, screen } from '@testing-library/react'
import { lightTheme } from '../../src/themes/default-light.ts'
import type { TooltipContentProps } from '../../src/tooltip/tooltip-content.tsx'
import { TooltipContent } from '../../src/tooltip/tooltip-content.tsx'
import type { SpotlightStep } from '../../src/types.ts'

function makeStep(overrides: Partial<SpotlightStep> = {}): SpotlightStep {
  return {
    target: '#test',
    title: 'Test Title',
    content: 'Test content body',
    ...overrides,
  }
}

function defaultProps(overrides: Partial<TooltipContentProps> = {}): TooltipContentProps {
  return {
    step: makeStep(),
    currentIndex: 0,
    totalSteps: 3,
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    onSkip: vi.fn(),
    onClose: vi.fn(),
    theme: lightTheme,
    ...overrides,
  }
}

describe('TooltipContent', () => {
  it('renders title and content', () => {
    render(<TooltipContent {...defaultProps()} />)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test content body')).toBeInTheDocument()
  })

  it('shows progress bar when showProgress is true', () => {
    const { container } = render(<TooltipContent {...defaultProps({ showProgress: true })} />)

    expect(container.querySelector('.spotlight-progress')).toBeInTheDocument()
  })

  it('shows skip button when showSkip is true and not last step', () => {
    render(
      <TooltipContent
        {...defaultProps({
          showSkip: true,
          currentIndex: 0,
          totalSteps: 3,
        })}
      />,
    )

    expect(screen.getByText('Skip')).toBeInTheDocument()
  })

  it('hides skip button on last step', () => {
    render(
      <TooltipContent
        {...defaultProps({
          showSkip: true,
          currentIndex: 2,
          totalSteps: 3,
        })}
      />,
    )

    expect(screen.queryByText('Skip')).not.toBeInTheDocument()
  })

  it('shows previous button when not first step', () => {
    render(
      <TooltipContent
        {...defaultProps({
          currentIndex: 1,
          totalSteps: 3,
        })}
      />,
    )

    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('hides previous button on first step', () => {
    render(
      <TooltipContent
        {...defaultProps({
          currentIndex: 0,
          totalSteps: 3,
        })}
      />,
    )

    expect(screen.queryByText('Back')).not.toBeInTheDocument()
  })

  it('shows "Done" text on last step', () => {
    render(
      <TooltipContent
        {...defaultProps({
          currentIndex: 2,
          totalSteps: 3,
        })}
      />,
    )

    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('shows "Next" text on non-last steps', () => {
    render(
      <TooltipContent
        {...defaultProps({
          currentIndex: 0,
          totalSteps: 3,
        })}
      />,
    )

    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('calls onNext when Next button is clicked', () => {
    const onNext = vi.fn()
    render(
      <TooltipContent
        {...defaultProps({
          onNext,
          currentIndex: 0,
          totalSteps: 3,
        })}
      />,
    )

    fireEvent.click(screen.getByText('Next'))
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('calls onPrevious when Back button is clicked', () => {
    const onPrevious = vi.fn()
    render(
      <TooltipContent
        {...defaultProps({
          onPrevious,
          currentIndex: 1,
          totalSteps: 3,
        })}
      />,
    )

    fireEvent.click(screen.getByText('Back'))
    expect(onPrevious).toHaveBeenCalledOnce()
  })

  it('calls onSkip when Skip button is clicked', () => {
    const onSkip = vi.fn()
    render(
      <TooltipContent
        {...defaultProps({
          onSkip,
          showSkip: true,
          currentIndex: 0,
          totalSteps: 3,
        })}
      />,
    )

    fireEvent.click(screen.getByText('Skip'))
    expect(onSkip).toHaveBeenCalledOnce()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<TooltipContent {...defaultProps({ onClose })} />)

    fireEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders action button from step.action', () => {
    const onClick = vi.fn()
    const step = makeStep({
      action: { label: 'Try it', onClick },
    })

    render(<TooltipContent {...defaultProps({ step })} />)

    const actionBtn = screen.getByText('Try it')
    expect(actionBtn).toBeInTheDocument()

    fireEvent.click(actionBtn)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('uses custom labels when provided', () => {
    render(
      <TooltipContent
        {...defaultProps({
          currentIndex: 1,
          totalSteps: 3,
          labels: {
            next: 'Siguiente',
            previous: 'Anterior',
            skip: 'Saltar',
            done: 'Hecho',
            close: 'Cerrar',
            stepOf: (current, total) => `${current} de ${total}`,
          },
        })}
      />,
    )

    expect(screen.getByText('Siguiente')).toBeInTheDocument()
    expect(screen.getByText('Anterior')).toBeInTheDocument()
    expect(screen.getByLabelText('Cerrar')).toBeInTheDocument()
    expect(screen.getByText('2 de 3')).toBeInTheDocument()
  })
})
