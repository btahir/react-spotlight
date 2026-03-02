/**
 * Smooth-scrolls an element into the viewport center if it is not already visible.
 *
 * Uses IntersectionObserver both to detect initial visibility and to know when
 * the element has arrived in the viewport after scrolling. The returned promise
 * resolves once the element is at least 95% visible (or after a safety timeout).
 */
export function scrollIntoView(element: HTMLElement): Promise<void> {
  return new Promise<void>((resolve) => {
    let resolved = false

    const done = () => {
      if (resolved) return
      resolved = true
      observer.disconnect()
      resolve()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && entry.intersectionRatio >= 0.95) {
          done()
        }
      },
      { threshold: [0.95] },
    )

    observer.observe(element)

    // Kick off the scroll — no-ops if the element is already in view
    // (in which case the observer's initial callback already resolved above).
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })

    // Safety net for elements taller than the viewport or other edge cases
    // where the 95% threshold can never be reached.
    setTimeout(done, 1500)
  })
}
