import type { Metadata } from 'next'
import '../styles.css'

export const metadata: Metadata = {
  title: 'Joel Thomas — Software Engineer',
  description: 'Joel Thomas — software engineer building thoughtful web experiences.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
