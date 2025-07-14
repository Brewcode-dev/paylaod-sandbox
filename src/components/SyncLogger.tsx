"use client"

import React, { useEffect, useRef, useState } from "react"
import { useSyncLoggerContext } from "../contexts/SyncLoggerContext"

const CloseIcon = () => (
  <svg width="20" height="20" fill="none" stroke="#6b7280" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const InfoIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4M12 8h.01" />
  </svg>
)

const SuccessIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#059669" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
)

const ErrorIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#dc2626" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
  </svg>
)

interface SyncLoggerProps {
  isVisible: boolean
  onClose: () => void
}

export const SyncLogger: React.FC<SyncLoggerProps> = ({ isVisible, onClose }) => {
  const { logs } = useSyncLoggerContext()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [forceUpdate, setForceUpdate] = useState(0)

  // Debug: log when logs change
  useEffect(() => {
    console.log('SyncLogger: logs updated, count:', logs.length)
    // Force re-render
    setForceUpdate(prev => prev + 1)
  }, [logs])

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
      console.log('SyncLogger: auto-scrolled to bottom')
    }
  }, [logs, forceUpdate])

  if (!isVisible) return null

  const getLevelIcon = (type: string) => {
    switch (type) {
      case "info":
        return <InfoIcon />
      case "success":
        return <SuccessIcon />
      case "error":
        return <ErrorIcon />
      default:
        return <InfoIcon />
    }
  }

  const getLevelStyle = (type: string) => {
    switch (type) {
      case "info":
        return { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #dbeafe" }
      case "success":
        return { background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0" }
      case "error":
        return { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }
      default:
        return { background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" }
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        width: "100%",
        maxWidth: 800,
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 32px",
          borderBottom: "1px solid #e5e7eb"
        }}>
          <div>
            <h2 style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#111827",
              margin: 0
            }}>
              Sync Logger
            </h2>
            <p style={{
              color: "#6b7280",
              fontSize: 14,
              margin: "4px 0 0 0"
            }}>
              Real-time synchronization logs and status ({logs.length} entries)
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s"
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Log Content */}
        <div style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}>
          {logs.length === 0 ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 32px",
              color: "#9ca3af",
              fontSize: 16
            }}>
              No logs yet. Start a sync to see activity here.
            </div>
          ) : (
            <div 
              ref={scrollContainerRef}
              style={{
                flex: 1,
                overflow: "auto",
                padding: "0 32px 32px 32px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {logs.map((log, index) => (
                  <div
                    key={log.id}
                    style={{
                      background: "#f9fafb",
                      borderRadius: 12,
                      padding: "16px 20px",
                      border: "1px solid #f3f4f6"
                    }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        flexShrink: 0,
                        marginTop: 2
                      }}>
                        {getLevelIcon(log.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 8
                        }}>
                          <span style={{
                            ...getLevelStyle(log.type),
                            padding: "4px 12px",
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                          }}>
                            {log.type}
                          </span>
                          <span style={{
                            color: "#6b7280",
                            fontSize: 13,
                            fontWeight: 500
                          }}>
                            {formatTimestamp(log.timestamp)}
                          </span>
                          {log.source && (
                            <span style={{
                              background: "#f3f4f6",
                              color: "#374151",
                              padding: "2px 8px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 500
                            }}>
                              {log.source}
                            </span>
                          )}
                        </div>
                        <div style={{
                          color: "#111827",
                          fontSize: 14,
                          lineHeight: 1.5,
                          wordBreak: "break-word"
                        }}>
                          {log.message}
                        </div>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div style={{
                            marginTop: 8,
                            padding: "8px 12px",
                            background: "#f8fafc",
                            borderRadius: 8,
                            border: "1px solid #e2e8f0"
                          }}>
                            <div style={{
                              fontSize: 12,
                              color: "#64748b",
                              marginBottom: 4,
                              fontWeight: 600
                            }}>
                              Details:
                            </div>
                            <pre style={{
                              fontSize: 11,
                              color: "#475569",
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              fontFamily: "monospace"
                            }}>
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SyncLogger 