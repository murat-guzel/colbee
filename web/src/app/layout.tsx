import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BellIcon } from '@heroicons/react/24/outline'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Colbee Projects',
  description: 'Project management and collaboration platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Colbee</h1>
                <div className="flex items-center space-x-6">
                  <button className="text-gray-600 hover:text-gray-900">
                    <BellIcon className="h-6 w-6" />
                  </button>
                  <div className="h-9 w-9 rounded-full bg-gray-200 ring-2 ring-primary-500"></div>
                </div>
              </div>
            </div>
          </nav>
          <main className="container mx-auto py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
} 