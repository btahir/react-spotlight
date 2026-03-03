import { source } from '@/lib/source'

const BASE_URL = 'https://react-tourlight.vercel.app'

export const revalidate = false

export function GET() {
  const pages = source.getPages()

  const lines = [
    '# react-tourlight',
    '',
    '> Beautiful onboarding tours & feature highlights for React. Zero dependencies, fully accessible, ~5KB gzipped.',
    '',
    'react-tourlight is the modern React tour library. It uses CSS clip-path for GPU-accelerated spotlight transitions, ships with WCAG 2.1 AA accessibility out of the box (focus trap, keyboard nav, ARIA, screen reader support), and works with React 18 and 19. MIT licensed, no paid tiers.',
    '',
    '## Docs',
    '',
  ]

  for (const page of pages) {
    const url = `${BASE_URL}${page.url}`
    const title = page.data.title
    const desc = page.data.description || ''
    lines.push(`- [${title}](${url}): ${desc}`)
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
