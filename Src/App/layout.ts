import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Marketplace Analytics',
  description: 'Analyseur de tendances Facebook Marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/fr_FR/sdk.js"
        />
      </head>
      <body className={inter.className}>
        {/* Initialisation Facebook SDK */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.fbAsyncInit = function() {
                FB.init({
                  appId: '340928848880301',
                  cookie: true,
                  xfbml: true,
                  version: 'v19.0'
                });
              };
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
