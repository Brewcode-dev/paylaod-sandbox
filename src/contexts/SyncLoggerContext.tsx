"use client"

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react'

export interface LogEntry {
  id: string
  timestamp: Date
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
  details?: any
  source?: 'bookings' | 'photos'
}

interface SyncLoggerContextType {
  logs: LogEntry[]
  addLog: (type: LogEntry['type'], message: string, details?: any, source?: LogEntry['source']) => void
  clearLogs: () => void
  getLogsBySource: (source: 'bookings' | 'photos') => LogEntry[]
  getLogsByType: (type: LogEntry['type']) => LogEntry[]
}

const SyncLoggerContext = createContext<SyncLoggerContextType | undefined>(undefined)

export const useSyncLoggerContext = () => {
  const context = useContext(SyncLoggerContext)
  if (context === undefined) {
    throw new Error('useSyncLoggerContext must be used within a SyncLoggerProvider')
  }
  return context
}

interface SyncLoggerProviderProps {
  children: ReactNode
}

export const SyncLoggerProvider: React.FC<SyncLoggerProviderProps> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const addLog = useCallback((type: LogEntry['type'], message: string, details?: any, source?: LogEntry['source']) => {
    const newLog: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      message,
      details,
      source
    }
    
    setLogs((prev: LogEntry[]) => [...prev, newLog])
    
    // Also log to console for debugging
    console.log(`[${source?.toUpperCase() || 'SYNC'}] ${message}`, details)
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  const getLogsBySource = useCallback((source: 'bookings' | 'photos') => {
    return logs.filter(log => log.source === source)
  }, [logs])

  const getLogsByType = useCallback((type: LogEntry['type']) => {
    return logs.filter(log => log.type === type)
  }, [logs])

  const value = {
    logs,
    addLog,
    clearLogs,
    getLogsBySource,
    getLogsByType
  }

  return (
    <SyncLoggerContext.Provider value={value}>
      {children}
    </SyncLoggerContext.Provider>
  )
} 