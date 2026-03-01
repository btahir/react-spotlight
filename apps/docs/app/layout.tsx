import 'fumadocs-ui/style.css'
import './global.css'
import { RootProvider } from 'fumadocs-ui/provider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'react-spotlight — Beautiful onboarding tours for React',
    template: '%s | react-spotlight',
  },
  description:
    'Beautiful onboarding tours & feature highlights for React. Zero dependencies, fully accessible, ~5KB gzipped. MIT licensed.',
  keywords: [
    'react',
    'spotlight',
    'tour',
    'onboarding',
    'product-tour',
    'walkthrough',
    'tooltip',
    'highlight',
    'react 19',
    'accessible',
  ],
  authors: [{ name: 'Bilal Tahir', url: 'https://github.com/bilaltahir' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://react-spotlight.dev',
    siteName: 'react-spotlight',
    title: 'react-spotlight — Beautiful onboarding tours for React',
    description:
      'Zero dependencies, fully accessible, ~5KB gzipped. The modern alternative to React Joyride.',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'react-spotlight — Beautiful onboarding tours for React',
    description:
      'Zero dependencies, fully accessible, ~5KB gzipped. The modern alternative to React Joyride.',
    images: ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body style={{ colorScheme: 'dark' }} className="flex min-h-screen flex-col">
        <RootProvider
          theme={{
            defaultTheme: 'dark',
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
