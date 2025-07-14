import React, { useState } from 'react'
import { Button } from '@payloadcms/ui'

interface SyncButtonProps {
  endpoint: string
  label: string
  className?: string
}

export const SyncButton: React.FC<SyncButtonProps> = ({ endpoint, label, className }) => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSync = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        // Refresh the page to show updated data
        window.location.reload()
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <Button
        onClick={handleSync}
        disabled={loading}
        buttonStyle="secondary"
      >
        {loading ? 'Synchronizing...' : label}
      </Button>
      
      {result && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: result.success ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
          <strong>{result.success ? 'Success:' : 'Error:'}</strong> {result.message || result.error}
        </div>
      )}
    </div>
  )
} 