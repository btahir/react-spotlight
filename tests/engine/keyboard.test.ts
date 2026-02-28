import { createKeyboardHandler } from '../../src/engine/keyboard.ts'

describe('createKeyboardHandler', () => {
  let onNext: ReturnType<typeof vi.fn>
  let onPrevious: ReturnType<typeof vi.fn>
  let onDismiss: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onNext = vi.fn()
    onPrevious = vi.fn()
    onDismiss = vi.fn()
  })

  function dispatch(key: string) {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(event)
    return event
  }

  it('ArrowRight calls onNext', () => {
    const handler = createKeyboardHandler({ onNext, onPrevious, onDismiss })
    handler.attach()

    dispatch('ArrowRight')
    expect(onNext).toHaveBeenCalledOnce()

    handler.detach()
  })

  it('ArrowLeft calls onPrevious', () => {
    const handler = createKeyboardHandler({ onNext, onPrevious, onDismiss })
    handler.attach()

    dispatch('ArrowLeft')
    expect(onPrevious).toHaveBeenCalledOnce()

    handler.detach()
  })

  it('Escape calls onDismiss when escToDismiss is true (default)', () => {
    const handler = createKeyboardHandler({ onNext, onPrevious, onDismiss })
    handler.attach()

    dispatch('Escape')
    expect(onDismiss).toHaveBeenCalledOnce()

    handler.detach()
  })

  it('Escape calls onDismiss when escToDismiss is explicitly true', () => {
    const handler = createKeyboardHandler({
      onNext,
      onPrevious,
      onDismiss,
      escToDismiss: true,
    })
    handler.attach()

    dispatch('Escape')
    expect(onDismiss).toHaveBeenCalledOnce()

    handler.detach()
  })

  it('Escape does NOT call onDismiss when escToDismiss is false', () => {
    const handler = createKeyboardHandler({
      onNext,
      onPrevious,
      onDismiss,
      escToDismiss: false,
    })
    handler.attach()

    dispatch('Escape')
    expect(onDismiss).not.toHaveBeenCalled()

    handler.detach()
  })

  it('does not respond to unrelated keys', () => {
    const handler = createKeyboardHandler({ onNext, onPrevious, onDismiss })
    handler.attach()

    dispatch('Enter')
    dispatch('Space')
    dispatch('Tab')
    dispatch('a')

    expect(onNext).not.toHaveBeenCalled()
    expect(onPrevious).not.toHaveBeenCalled()
    expect(onDismiss).not.toHaveBeenCalled()

    handler.detach()
  })

  describe('attach/detach lifecycle', () => {
    it('does not respond to keys before attach()', () => {
      createKeyboardHandler({ onNext, onPrevious, onDismiss })

      dispatch('ArrowRight')
      expect(onNext).not.toHaveBeenCalled()
    })

    it('stops responding to keys after detach()', () => {
      const handler = createKeyboardHandler({ onNext, onPrevious, onDismiss })
      handler.attach()

      dispatch('ArrowRight')
      expect(onNext).toHaveBeenCalledOnce()

      handler.detach()
      dispatch('ArrowRight')
      expect(onNext).toHaveBeenCalledOnce()
    })

    it('can re-attach after detach', () => {
      const handler = createKeyboardHandler({ onNext, onPrevious, onDismiss })

      handler.attach()
      handler.detach()
      handler.attach()

      dispatch('ArrowLeft')
      expect(onPrevious).toHaveBeenCalledOnce()

      handler.detach()
    })
  })

  it('prevents default on recognized keys', () => {
    const handler = createKeyboardHandler({ onNext, onPrevious, onDismiss })
    handler.attach()

    const rightEvent = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    })
    const preventSpy = vi.spyOn(rightEvent, 'preventDefault')
    document.dispatchEvent(rightEvent)
    expect(preventSpy).toHaveBeenCalledOnce()

    const leftEvent = new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
      bubbles: true,
      cancelable: true,
    })
    const preventSpyLeft = vi.spyOn(leftEvent, 'preventDefault')
    document.dispatchEvent(leftEvent)
    expect(preventSpyLeft).toHaveBeenCalledOnce()

    const escEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    })
    const preventSpyEsc = vi.spyOn(escEvent, 'preventDefault')
    document.dispatchEvent(escEvent)
    expect(preventSpyEsc).toHaveBeenCalledOnce()

    handler.detach()
  })

  it('does not prevent default on Escape when escToDismiss is false', () => {
    const handler = createKeyboardHandler({
      onNext,
      onPrevious,
      onDismiss,
      escToDismiss: false,
    })
    handler.attach()

    const escEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    })
    const preventSpy = vi.spyOn(escEvent, 'preventDefault')
    document.dispatchEvent(escEvent)
    expect(preventSpy).not.toHaveBeenCalled()

    handler.detach()
  })
})
