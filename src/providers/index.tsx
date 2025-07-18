import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SyncLoggerProvider } from '../contexts/SyncLoggerContext'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <SyncLoggerProvider>
          {children}
        </SyncLoggerProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
