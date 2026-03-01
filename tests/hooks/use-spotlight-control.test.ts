import { act, renderHook } from '@testing-library/react'
import React from 'react'
import { SpotlightProvider } from '../../src/components/spotlight-provider.tsx'
import { useSpotlight } from '../../src/hooks/use-spotlight.ts'
import { useSpotlightControl } from '../../src/hooks/use-spotlight-control.ts'
import type { SpotlightStep } from '../../src/types.ts'

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(SpotlightProvider, null, children)

describe('useSpotlightControl', () => {
  it('returns control methods', () => {
    const { result } = renderHook(() => useSpotlightControl(), { wrapper })

    expect(result.current.start).toBeTypeOf('function')
    expect(result.current.stop).toBeTypeOf('function')
    expect(result.current.next).toBeTypeOf('function')
    expect(result.current.previous).toBeTypeOf('function')
    expect(result.current.skip).toBeTypeOf('function')
    expect(result.current.goToStep).toBeTypeOf('function')
    expect(result.current.highlight).toBeTypeOf('function')
    expect(result.current.dismissHighlight).toBeTypeOf('function')
    expect(result.current.isActive).toBe(false)
  })

  it('isActive reflects tour state', () => {
    const steps: SpotlightStep[] = [{ target: '#target', title: 'Test', content: 'Content' }]

    // Create target element
    const targetEl = document.createElement('div')
    targetEl.id = 'target'
    document.body.appendChild(targetEl)

    const { result } = renderHook(
      () => {
        const control = useSpotlightControl()
        const ctx = useSpotlight()
        return { control, ctx }
      },
      { wrapper },
    )

    // Initially inactive
    expect(result.current.control.isActive).toBe(false)

    // Register a tour and start it
    act(() => {
      result.current.ctx.registerTour('test-tour', steps)
    })

    act(() => {
      result.current.control.start('test-tour')
    })

    expect(result.current.control.isActive).toBe(true)

    // Stop should deactivate
    act(() => {
      result.current.control.stop()
    })

    expect(result.current.control.isActive).toBe(false)

    document.body.removeChild(targetEl)
  })
})
