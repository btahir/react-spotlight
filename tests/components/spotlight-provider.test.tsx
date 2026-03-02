import { act, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { SpotlightProvider } from '../../src/components/spotlight-provider.tsx'
import { SpotlightTour } from '../../src/components/spotlight-tour.tsx'
import * as elementObserver from '../../src/engine/element-observer.ts'
import { useSpotlight } from '../../src/hooks/use-spotlight.ts'
import type { SpotlightContextValue, SpotlightStep } from '../../src/types.ts'

/**
 * Test helper that exposes the context value via a ref-like callback.
 */
function ContextReader({ onContext }: { onContext: (ctx: SpotlightContextValue) => void }) {
  const ctx = useSpotlight()
  // Use a ref to avoid triggering onContext on every render
  const callbackRef = React.useRef(onContext)
  callbackRef.current = onContext
  React.useEffect(() => {
    callbackRef.current(ctx)
  })
  return null
}

/**
 * Helper component that renders a button to start a tour
 * and displays whether the tour is active.
 */
function TourController({ tourId }: { tourId: string }) {
  const { start, stop, isActive } = useSpotlight()
  return (
    <div>
      <span data-testid="status">{isActive ? 'active' : 'inactive'}</span>
      <button type="button" onClick={() => start(tourId)}>
        Start
      </button>
      <button type="button" onClick={() => stop()}>
        Stop
      </button>
    </div>
  )
}

const testSteps: SpotlightStep[] = [
  {
    target: '#step-target',
    title: 'Step 1',
    content: 'First step content',
  },
  {
    target: '#step-target-2',
    title: 'Step 2',
    content: 'Second step content',
  },
]

describe('SpotlightProvider', () => {
  it('renders children', () => {
    render(
      <SpotlightProvider>
        <div data-testid="child">Hello</div>
      </SpotlightProvider>,
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('provides context to children', () => {
    let capturedContext: SpotlightContextValue | null = null

    render(
      <SpotlightProvider>
        <ContextReader
          onContext={(ctx) => {
            capturedContext = ctx
          }}
        />
      </SpotlightProvider>,
    )

    expect(capturedContext).not.toBeNull()
    expect(capturedContext?.isActive).toBe(false)
    expect(capturedContext?.start).toBeTypeOf('function')
    expect(capturedContext?.stop).toBeTypeOf('function')
    expect(capturedContext?.next).toBeTypeOf('function')
    expect(capturedContext?.previous).toBeTypeOf('function')
    expect(capturedContext?.skip).toBeTypeOf('function')
    expect(capturedContext?.goToStep).toBeTypeOf('function')
    expect(capturedContext?.registerTour).toBeTypeOf('function')
    expect(capturedContext?.unregisterTour).toBeTypeOf('function')
    expect(capturedContext?.highlight).toBeTypeOf('function')
    expect(capturedContext?.dismissHighlight).toBeTypeOf('function')
  })

  it('start() activates the tour overlay', async () => {
    // Create the target element in the DOM so resolveTarget can find it
    const targetEl = document.createElement('div')
    targetEl.id = 'step-target'
    document.body.appendChild(targetEl)

    render(
      <SpotlightProvider>
        <SpotlightTour id="test-tour" steps={testSteps} />
        <TourController tourId="test-tour" />
      </SpotlightProvider>,
    )

    expect(screen.getByTestId('status').textContent).toBe('inactive')

    await act(async () => {
      screen.getByText('Start').click()
    })

    expect(screen.getByTestId('status').textContent).toBe('active')

    document.body.removeChild(targetEl)
  })

  it('stop() deactivates the tour', async () => {
    const targetEl = document.createElement('div')
    targetEl.id = 'step-target'
    document.body.appendChild(targetEl)

    render(
      <SpotlightProvider>
        <SpotlightTour id="test-tour" steps={testSteps} />
        <TourController tourId="test-tour" />
      </SpotlightProvider>,
    )

    // Start the tour
    await act(async () => {
      screen.getByText('Start').click()
    })
    expect(screen.getByTestId('status').textContent).toBe('active')

    // Stop the tour
    await act(async () => {
      screen.getByText('Stop').click()
    })
    expect(screen.getByTestId('status').textContent).toBe('inactive')

    document.body.removeChild(targetEl)
  })

  it('calls onStateChange with the active tour ID', async () => {
    const targetEl = document.createElement('div')
    targetEl.id = 'step-target'
    document.body.appendChild(targetEl)

    const onStateChange = vi.fn()

    render(
      <SpotlightProvider onStateChange={onStateChange}>
        <SpotlightTour id="test-tour" steps={testSteps} />
        <TourController tourId="test-tour" />
      </SpotlightProvider>,
    )

    await act(async () => {
      screen.getByText('Start').click()
      await Promise.resolve()
    })

    expect(onStateChange).toHaveBeenCalled()
    expect(onStateChange).toHaveBeenCalledWith(
      'test-tour',
      expect.objectContaining({
        status: 'active',
      }),
    )

    document.body.removeChild(targetEl)
  })

  it('skips a step when its target never appears and advances to the next step', async () => {
    const waitForElementSpy = vi
      .spyOn(elementObserver, 'waitForElement')
      .mockResolvedValueOnce(null as never)

    const targetEl = document.createElement('div')
    targetEl.id = 'step-target-2'
    document.body.appendChild(targetEl)

    const stepsWithMissingFirstTarget: SpotlightStep[] = [
      {
        target: '#missing-target',
        title: 'Missing Step',
        content: 'This target does not exist',
      },
      {
        target: '#step-target-2',
        title: 'Step 2',
        content: 'Second step content',
      },
    ]

    render(
      <SpotlightProvider>
        <SpotlightTour id="missing-target-tour" steps={stepsWithMissingFirstTarget} />
        <TourController tourId="missing-target-tour" />
      </SpotlightProvider>,
    )

    await act(async () => {
      screen.getByText('Start').click()
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(screen.getByText('Step 2')).toBeInTheDocument()
    })

    expect(waitForElementSpy).toHaveBeenCalledWith('#missing-target')

    waitForElementSpy.mockRestore()
    document.body.removeChild(targetEl)
  })

  it('dismissHighlight calls the step onHide callback', async () => {
    let capturedContext: SpotlightContextValue | null = null
    const targetEl = document.createElement('div')
    targetEl.id = 'highlight-target'
    document.body.appendChild(targetEl)

    const onHide = vi.fn()

    render(
      <SpotlightProvider>
        <ContextReader
          onContext={(ctx) => {
            capturedContext = ctx
          }}
        />
      </SpotlightProvider>,
    )

    await act(async () => {
      capturedContext?.highlight({
        target: '#highlight-target',
        title: 'Highlight',
        content: 'Highlight content',
        onHide,
      })
      await Promise.resolve()
    })

    await act(async () => {
      capturedContext?.dismissHighlight()
      await Promise.resolve()
    })

    expect(onHide).toHaveBeenCalledOnce()

    document.body.removeChild(targetEl)
  })
})
