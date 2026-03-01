import Link from 'next/link'
import { AnimateOnScroll } from '@/components/animate-on-scroll'
import { InteractiveTour } from '@/components/demo/interactive-tour'

const features = [
  {
    title: 'Beautiful',
    description:
      'Smooth CSS clip-path animations with customizable themes. Light and dark mode out of the box.',
    icon: (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
    color: 'from-purple-500/20 to-purple-500/5',
    iconBg: 'bg-purple-500/15 text-purple-400',
  },
  {
    title: 'Accessible',
    description:
      'Full keyboard navigation, focus trapping, screen reader announcements, and ARIA attributes built in.',
    icon: (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="16" cy="4" r="1" />
        <path d="m18 19 1-7-6 1" />
        <path d="m5 8 3-3 5.5 3-2.36 3.5" />
        <path d="m4.24 14.5 5-6.5" />
        <path d="m9 19 2-8" />
      </svg>
    ),
    color: 'from-blue-500/20 to-blue-500/5',
    iconBg: 'bg-blue-500/15 text-blue-400',
  },
  {
    title: 'Tiny',
    description:
      'Zero runtime dependencies. The core library is under 5 kB gzipped. Only pay for what you use.',
    icon: (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" x2="2" y1="8" y2="22" />
        <line x1="17.5" x2="9" y1="15" y2="15" />
      </svg>
    ),
    color: 'from-emerald-500/20 to-emerald-500/5',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
  },
  {
    title: 'MIT License',
    description:
      'Free and open-source forever. Use it in personal and commercial projects without restrictions.',
    icon: (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    color: 'from-amber-500/20 to-amber-500/5',
    iconBg: 'bg-amber-500/15 text-amber-400',
  },
]

const installCommand = 'npm install react-spotlight @floating-ui/react-dom'

const stats = [
  { label: '~5KB gzipped', detail: 'Core bundle' },
  { label: '0 dependencies', detail: 'Zero runtime deps' },
  { label: 'WCAG 2.1 AA', detail: 'Fully accessible' },
]

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section
        data-tour="hero"
        className="relative flex flex-col items-center justify-center gap-6 overflow-hidden px-6 pb-20 pt-32 text-center"
      >
        {/* Gradient mesh background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />
          <div className="animate-float absolute left-1/4 top-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="animate-float animation-delay-200 absolute right-1/4 top-40 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        {/* Version badge */}
        <div className="animate-fade-in-up rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
          v0.1.0 — Now available
        </div>

        {/* Heading with animated gradient */}
        <h1 className="animate-fade-in-up animation-delay-100 max-w-3xl text-5xl font-extrabold tracking-tight sm:text-7xl">
          <span className="animate-gradient-shift bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">
            react-spotlight
          </span>
        </h1>

        <p className="animate-fade-in-up animation-delay-200 max-w-xl text-lg text-fd-muted-foreground sm:text-xl">
          Beautiful onboarding tours &amp; feature highlights for React. Zero dependencies, fully
          accessible, tiny bundle.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up animation-delay-300 flex gap-4">
          <Link
            href="/docs"
            className="animate-pulse-glow inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/bilaltahir/react-spotlight"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-fd-border bg-fd-background px-6 py-3 text-sm font-medium transition-colors hover:bg-fd-accent"
          >
            GitHub
          </a>
        </div>

        {/* Interactive tour button */}
        <div className="animate-fade-in-up animation-delay-400 mt-4">
          <InteractiveTour />
        </div>

        {/* Stats row */}
        <div className="animate-fade-in-up animation-delay-500 mt-6 flex flex-wrap items-center justify-center gap-8 text-sm">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-2">
              {i > 0 && <span className="mr-6 hidden h-4 w-px bg-fd-border sm:block" />}
              <span className="font-semibold text-fd-foreground">{stat.label}</span>
              <span className="text-fd-muted-foreground">{stat.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        data-tour="features"
        className="mx-auto grid w-full max-w-5xl gap-6 px-6 pb-20 sm:grid-cols-2"
      >
        {features.map((feature, i) => (
          <AnimateOnScroll key={feature.title} delay={i * 100}>
            <div className="group relative overflow-hidden rounded-xl border border-fd-border/50 bg-fd-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5">
              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${feature.iconBg}`}
              >
                {feature.icon}
              </div>
              <h3 className="mb-1 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-fd-muted-foreground">{feature.description}</p>
            </div>
          </AnimateOnScroll>
        ))}
      </section>

      {/* Install */}
      <AnimateOnScroll>
        <section
          data-tour="install"
          className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 pb-20"
        >
          <h2 className="text-3xl font-bold tracking-tight">Get started in seconds</h2>
          <div className="group relative w-full max-w-2xl overflow-hidden rounded-xl border border-fd-border bg-fd-card transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2 text-xs text-fd-muted-foreground">
              <span className="h-3 w-3 rounded-full bg-red-500/60" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <span className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-2">Terminal</span>
            </div>
            <pre className="overflow-x-auto p-4 text-sm">
              <code>
                <span className="text-fd-muted-foreground">$ </span>
                {installCommand}
              </code>
            </pre>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Code Example */}
      <AnimateOnScroll>
        <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 pb-20">
          <h2 className="text-3xl font-bold tracking-tight">Simple, declarative API</h2>
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-fd-border bg-fd-card">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2 text-xs text-fd-muted-foreground">
              <span className="h-3 w-3 rounded-full bg-red-500/60" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <span className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-2">App.tsx</span>
            </div>
            <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
              <code>
                <span className="text-purple-400">import</span>
                {' { '}
                <span className="text-blue-300">SpotlightProvider</span>
                {', '}
                <span className="text-blue-300">SpotlightTour</span>
                {', '}
                <span className="text-blue-300">useSpotlight</span>
                {' } '}
                <span className="text-purple-400">from</span>{' '}
                <span className="text-emerald-400">{"'react-spotlight'"}</span>
                {'\n'}
                <span className="text-purple-400">import</span>{' '}
                <span className="text-emerald-400">{"'react-spotlight/styles.css'"}</span>
                {'\n\n'}
                <span className="text-purple-400">const</span>
                {' steps = [\n  { '}
                <span className="text-blue-300">target</span>
                {': '}
                <span className="text-emerald-400">{"'#step-1'"}</span>
                {', '}
                <span className="text-blue-300">title</span>
                {': '}
                <span className="text-emerald-400">{"'Welcome!'"}</span>
                {', '}
                <span className="text-blue-300">content</span>
                {': '}
                <span className="text-emerald-400">{"'Let us show you around.'"}</span>
                {' },\n  { '}
                <span className="text-blue-300">target</span>
                {': '}
                <span className="text-emerald-400">{"'#step-2'"}</span>
                {', '}
                <span className="text-blue-300">title</span>
                {': '}
                <span className="text-emerald-400">{"'Features'"}</span>
                {', '}
                <span className="text-blue-300">content</span>
                {': '}
                <span className="text-emerald-400">{"'Check out what we offer.'"}</span>
                {' },\n]\n\n'}
                <span className="text-purple-400">function</span>{' '}
                <span className="text-yellow-300">App</span>
                {'() {\n  '}
                <span className="text-purple-400">return</span>
                {' (\n    '}
                <span className="text-blue-300">{'<SpotlightProvider>'}</span>
                {'\n      '}
                <span className="text-blue-300">{'<SpotlightTour'}</span>{' '}
                <span className="text-blue-300">id</span>
                {'='}
                <span className="text-emerald-400">{'"onboarding"'}</span>{' '}
                <span className="text-blue-300">steps</span>
                {'={steps} '}
                <span className="text-blue-300">{'/>'}</span>
                {'\n      '}
                <span className="text-blue-300">{'<YourApp />'}</span>
                {'\n    '}
                <span className="text-blue-300">{'</SpotlightProvider>'}</span>
                {'\n  )\n}'}
              </code>
            </pre>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Comparison */}
      <AnimateOnScroll>
        <section
          data-tour="comparison"
          className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 pb-24"
        >
          <h2 className="text-3xl font-bold tracking-tight">Why react-spotlight?</h2>
          <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-fd-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-fd-border bg-fd-card">
                  <th className="px-4 py-3 font-medium">Feature</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-indigo-400">react-spotlight</span>
                      <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                        Recommended
                      </span>
                    </span>
                  </th>
                  <th className="px-4 py-3 font-medium text-fd-muted-foreground">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fd-border">
                {[
                  ['Bundle size', '< 5 kB', '15–50 kB'],
                  ['Dependencies', '0', '5–15+'],
                  ['Accessibility', 'Full ARIA + keyboard', 'Partial'],
                  ['Animation', 'CSS clip-path (GPU)', 'mix-blend-mode / DOM'],
                  ['React 19', 'Fully compatible', 'Broken / wrappers'],
                ].map(([feature, ours, theirs]) => (
                  <tr key={feature}>
                    <td className="px-4 py-3">{feature}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-indigo-400">
                        <svg
                          aria-hidden="true"
                          className="h-4 w-4 text-emerald-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {ours}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-fd-muted-foreground">{theirs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </AnimateOnScroll>

      {/* CTA Footer */}
      <AnimateOnScroll>
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 pb-24">
          <div className="w-full rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-fd-card to-fd-card p-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to ship better onboarding?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-fd-muted-foreground">
              Get up and running in under 5 minutes. Beautiful tours, zero dependencies, fully
              accessible.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/docs"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
              >
                Read the Docs
              </Link>
              <code className="rounded-lg border border-fd-border bg-fd-background px-4 py-3 text-sm text-fd-muted-foreground">
                npm install react-spotlight
              </code>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Footer */}
      <footer className="mt-auto border-t border-fd-border py-8 text-center text-sm text-fd-muted-foreground">
        <p>
          MIT License &middot;{' '}
          <a
            href="https://github.com/bilaltahir/react-spotlight"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-fd-foreground"
          >
            GitHub
          </a>{' '}
          &middot; Built with{' '}
          <a
            href="https://fumadocs.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-fd-foreground"
          >
            Fumadocs
          </a>
        </p>
      </footer>
    </main>
  )
}
