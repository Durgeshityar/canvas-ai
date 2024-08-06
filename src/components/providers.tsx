'use client'

import { QueryProvider } from '@/components/query-provider'

interface ProviderProps {
  children: React.ReactNode
}

// injectting server component -> children into client component

export const Providers = ({ children }: ProviderProps) => {
  return <QueryProvider>{children}</QueryProvider>
}
