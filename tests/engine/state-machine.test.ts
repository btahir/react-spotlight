import { createTourStateMachine } from '../../src/engine/state-machine.ts'
import type { SpotlightStep } from '../../src/types.ts'

function makeStep(overrides: Partial<SpotlightStep> = {}): SpotlightStep {
  return {
    target: '#el',
    title: 'Step',
    content: 'content',
    ...overrides,
  }
}

describe('createTourStateMachine', () => {
  describe('start()', () => {
    it('transitions from idle to active', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep()],
      })

      expect(machine.getState().status).toBe('idle')
      await machine.start()
      expect(machine.getState().status).toBe('active')
    })

    it('does nothing if already active', async () => {
      const onStateChange = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep()],
        onStateChange,
      })

      await machine.start()
      onStateChange.mockClear()

      await machine.start()
      expect(onStateChange).not.toHaveBeenCalled()
    })

    it('completes immediately when no steps pass the when predicate', async () => {
      const onComplete = vi.fn()
      const machine = createTourStateMachine({
        steps: [
          makeStep({ when: () => false }),
          makeStep({ when: () => false }),
        ],
        onComplete,
      })

      await machine.start()

      expect(machine.getState().status).toBe('completed')
      expect(machine.getState().completedAt).toBeTypeOf('number')
      expect(onComplete).toHaveBeenCalledOnce()
    })

    it('completes immediately with no valid steps (empty steps array)', async () => {
      const onComplete = vi.fn()
      const machine = createTourStateMachine({
        steps: [],
        onComplete,
      })

      await machine.start()

      expect(machine.getState().status).toBe('completed')
      expect(onComplete).toHaveBeenCalledOnce()
    })

    it('skips initial steps whose when predicate returns false', async () => {
      const machine = createTourStateMachine({
        steps: [
          makeStep({ when: () => false, title: 'skipped' }),
          makeStep({ title: 'shown' }),
        ],
      })

      await machine.start()

      expect(machine.getState().currentStepIndex).toBe(1)
    })
  })

  describe('next()', () => {
    it('advances to the next step', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep(), makeStep()],
      })

      await machine.start()
      expect(machine.getState().currentStepIndex).toBe(0)

      await machine.next()
      expect(machine.getState().currentStepIndex).toBe(1)

      await machine.next()
      expect(machine.getState().currentStepIndex).toBe(2)
    })

    it('completes the tour when there are no more steps', async () => {
      const onComplete = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep()],
        onComplete,
      })

      await machine.start()
      await machine.next()

      expect(machine.getState().status).toBe('completed')
      expect(machine.getState().completedAt).toBeTypeOf('number')
      expect(onComplete).toHaveBeenCalledOnce()
    })

    it('does nothing when not active', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep()],
      })

      await machine.next()
      expect(machine.getState().currentStepIndex).toBe(0)
      expect(machine.getState().status).toBe('idle')
    })

    it('skips steps whose when predicate returns false', async () => {
      const machine = createTourStateMachine({
        steps: [
          makeStep({ title: 'first' }),
          makeStep({ when: () => false, title: 'hidden' }),
          makeStep({ title: 'third' }),
        ],
      })

      await machine.start()
      await machine.next()

      expect(machine.getState().currentStepIndex).toBe(2)
    })
  })

  describe('previous()', () => {
    it('goes back to the previous step', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep(), makeStep()],
      })

      await machine.start()
      await machine.next()
      await machine.next()
      expect(machine.getState().currentStepIndex).toBe(2)

      await machine.previous()
      expect(machine.getState().currentStepIndex).toBe(1)
    })

    it('does nothing when already at the first step', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep()],
      })

      await machine.start()
      expect(machine.getState().currentStepIndex).toBe(0)

      await machine.previous()
      expect(machine.getState().currentStepIndex).toBe(0)
    })

    it('does nothing when not active', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep()],
      })

      await machine.previous()
      expect(machine.getState().status).toBe('idle')
    })

    it('skips steps whose when predicate returns false going backward', async () => {
      const machine = createTourStateMachine({
        steps: [
          makeStep({ title: 'first' }),
          makeStep({ when: () => false, title: 'hidden' }),
          makeStep({ title: 'third' }),
        ],
      })

      await machine.start()
      await machine.next()
      expect(machine.getState().currentStepIndex).toBe(2)

      await machine.previous()
      expect(machine.getState().currentStepIndex).toBe(0)
    })
  })

  describe('skip()', () => {
    it('completes the tour with skippedAt', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep(), makeStep()],
      })

      await machine.start()
      await machine.next()
      machine.skip()

      const state = machine.getState()
      expect(state.status).toBe('completed')
      expect(state.skippedAt).toBeDefined()
      expect(state.skippedAt!.stepIndex).toBe(1)
      expect(state.skippedAt!.timestamp).toBeTypeOf('number')
    })

    it('calls the onSkip callback with the current step index', async () => {
      const onSkip = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep()],
        onSkip,
      })

      await machine.start()
      await machine.next()
      machine.skip()

      expect(onSkip).toHaveBeenCalledWith(1)
    })

    it('does nothing when not active', () => {
      const onSkip = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep()],
        onSkip,
      })

      machine.skip()
      expect(onSkip).not.toHaveBeenCalled()
      expect(machine.getState().status).toBe('idle')
    })
  })

  describe('goToStep()', () => {
    it('jumps to a specific step', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep(), makeStep()],
      })

      await machine.start()
      await machine.goToStep(2)

      expect(machine.getState().currentStepIndex).toBe(2)
    })

    it('does nothing for out-of-bounds index', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep()],
      })

      await machine.start()
      await machine.goToStep(5)
      expect(machine.getState().currentStepIndex).toBe(0)

      await machine.goToStep(-1)
      expect(machine.getState().currentStepIndex).toBe(0)
    })

    it('does nothing if the target step when predicate returns false', async () => {
      const machine = createTourStateMachine({
        steps: [
          makeStep(),
          makeStep({ when: () => false }),
        ],
      })

      await machine.start()
      await machine.goToStep(1)

      expect(machine.getState().currentStepIndex).toBe(0)
    })

    it('does nothing when not active', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep()],
      })

      await machine.goToStep(1)
      expect(machine.getState().status).toBe('idle')
      expect(machine.getState().currentStepIndex).toBe(0)
    })
  })

  describe('stop()', () => {
    it('returns to idle from active', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep()],
      })

      await machine.start()
      expect(machine.getState().status).toBe('active')

      machine.stop()
      expect(machine.getState().status).toBe('idle')
    })

    it('does nothing when not active', () => {
      const onStateChange = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep()],
        onStateChange,
      })

      machine.stop()
      expect(onStateChange).not.toHaveBeenCalled()
    })
  })

  describe('seenSteps tracking', () => {
    it('tracks seen steps as the user navigates', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep(), makeStep()],
      })

      await machine.start()
      expect(machine.getState().seenSteps).toEqual([0])

      await machine.next()
      expect(machine.getState().seenSteps).toEqual([0, 1])

      await machine.next()
      expect(machine.getState().seenSteps).toEqual([0, 1, 2])
    })

    it('does not duplicate entries when revisiting a step', async () => {
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep()],
      })

      await machine.start()
      await machine.next()
      await machine.previous()

      expect(machine.getState().seenSteps).toEqual([0, 1])
    })
  })

  describe('callbacks', () => {
    it('calls onComplete when reaching the end', async () => {
      const onComplete = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep()],
        onComplete,
      })

      await machine.start()
      await machine.next()

      expect(onComplete).toHaveBeenCalledOnce()
    })

    it('calls onSkip when skipping', async () => {
      const onSkip = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep()],
        onSkip,
      })

      await machine.start()
      machine.skip()

      expect(onSkip).toHaveBeenCalledWith(0)
    })

    it('calls onStateChange on every transition', async () => {
      const onStateChange = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep()],
        onStateChange,
      })

      await machine.start()
      const callCountAfterStart = onStateChange.mock.calls.length
      expect(callCountAfterStart).toBeGreaterThan(0)

      await machine.next()
      expect(onStateChange.mock.calls.length).toBeGreaterThan(callCountAfterStart)
    })
  })

  describe('async when predicates', () => {
    it('handles async when predicates', async () => {
      const machine = createTourStateMachine({
        steps: [
          makeStep({ when: () => Promise.resolve(false), title: 'skipped' }),
          makeStep({ when: () => Promise.resolve(true), title: 'shown' }),
        ],
      })

      await machine.start()
      expect(machine.getState().currentStepIndex).toBe(1)
    })

    it('handles a mix of sync and async when predicates', async () => {
      const machine = createTourStateMachine({
        steps: [
          makeStep({ when: () => false }),
          makeStep({ when: async () => false }),
          makeStep({ title: 'no predicate' }),
        ],
      })

      await machine.start()
      expect(machine.getState().currentStepIndex).toBe(2)
    })
  })

  describe('lifecycle callbacks', () => {
    it('calls onBeforeShow before entering a step', async () => {
      const order: string[] = []
      const onBeforeShow = vi.fn(() => { order.push('onBeforeShow') })
      const onStateChange = vi.fn(() => { order.push('onStateChange') })

      const machine = createTourStateMachine({
        steps: [makeStep({ onBeforeShow })],
        onStateChange,
      })

      await machine.start()

      expect(onBeforeShow).toHaveBeenCalledOnce()
      // onBeforeShow should fire before the state change that records the step
      const beforeShowIndex = order.indexOf('onBeforeShow')
      // The first onStateChange is from setStatus('active'), the second is from enterStep
      const stateChanges = order
        .map((v, i) => ({ v, i }))
        .filter(({ v }) => v === 'onStateChange')
      // onBeforeShow should appear before the second onStateChange (the enterStep one)
      expect(beforeShowIndex).toBeLessThan(stateChanges[1].i)
    })

    it('calls onAfterShow after entering a step', async () => {
      const onAfterShow = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep({ onAfterShow })],
      })

      await machine.start()
      expect(onAfterShow).toHaveBeenCalledOnce()
    })

    it('calls onHide when leaving a step', async () => {
      const onHide = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep({ onHide }), makeStep()],
      })

      await machine.start()
      expect(onHide).not.toHaveBeenCalled()

      await machine.next()
      expect(onHide).toHaveBeenCalledOnce()
    })

    it('calls onHide when stopping the tour', async () => {
      const onHide = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep({ onHide })],
      })

      await machine.start()
      machine.stop()
      expect(onHide).toHaveBeenCalledOnce()
    })

    it('calls onHide when skipping the tour', async () => {
      const onHide = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep({ onHide })],
      })

      await machine.start()
      machine.skip()
      expect(onHide).toHaveBeenCalledOnce()
    })

    it('calls async onBeforeShow and waits for it', async () => {
      let resolved = false
      const onBeforeShow = vi.fn(async () => {
        await new Promise((r) => setTimeout(r, 10))
        resolved = true
      })
      const onAfterShow = vi.fn()

      const machine = createTourStateMachine({
        steps: [makeStep({ onBeforeShow, onAfterShow })],
      })

      await machine.start()
      expect(resolved).toBe(true)
      expect(onAfterShow).toHaveBeenCalledOnce()
    })
  })

  describe('subscribe/unsubscribe', () => {
    it('subscribe receives state changes', async () => {
      const listener = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep()],
      })

      machine.subscribe(listener)
      await machine.start()

      expect(listener).toHaveBeenCalled()
      const lastCall = listener.mock.calls[listener.mock.calls.length - 1][0]
      expect(lastCall.status).toBe('active')
    })

    it('unsubscribe stops receiving state changes', async () => {
      const listener = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep(), makeStep()],
      })

      const unsub = machine.subscribe(listener)
      await machine.start()
      const callCount = listener.mock.calls.length

      unsub()
      await machine.next()

      expect(listener.mock.calls.length).toBe(callCount)
    })

    it('multiple subscribers all receive updates', async () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      const machine = createTourStateMachine({
        steps: [makeStep()],
      })

      machine.subscribe(listener1)
      machine.subscribe(listener2)
      await machine.start()

      expect(listener1).toHaveBeenCalled()
      expect(listener2).toHaveBeenCalled()
    })
  })
})
