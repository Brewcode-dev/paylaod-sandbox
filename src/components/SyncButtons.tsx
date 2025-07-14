"use client"

import React, { useState } from "react"
import { SyncLogger } from "./SyncLogger"
import { useSyncLoggerContext } from "../contexts/SyncLoggerContext"

const BookIcon = () => (
  <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:40,height:40,borderRadius:20,background:'#eff6ff',marginRight:12}}>
    <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 18.75v-12z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75v10.5" />
    </svg>
  </span>
)
const ImageIcon = () => (
  <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:40,height:40,borderRadius:20,background:'#ecfdf5',marginRight:12}}>
    <svg width="22" height="22" fill="none" stroke="#059669" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10.5" r="1.5" />
      <path d="M21 19l-5.5-7-4.5 6-2.5-3L3 19" />
    </svg>
  </span>
)
const StatusIcon = () => (
  <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:40,height:40,borderRadius:50,background:'#f0fdf4',marginRight:12}}>
    <svg width="22" height="22" fill="none" stroke="#059669" strokeWidth="1.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  </span>
)
const LogIcon = () => (
  <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h4" />
  </svg>
)
const Spinner = () => (
  <svg style={{animation:'spin 1s linear infinite',height:20,width:20,marginRight:8}} viewBox="0 0 24 24">
    <circle style={{opacity:0.25}} cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" fill="none" />
    <path style={{opacity:0.75}} fill="#fff" d="M4 12a8 8 0 018-8v8z" />
    <style>{'@keyframes spin{to{transform:rotate(360deg);}}'}</style>
  </svg>
)

export const SyncButtons: React.FC = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [showLogger, setShowLogger] = useState(false)
  const [lastSync, setLastSync] = useState<{ [key: string]: Date }>({})
  const [syncStats, setSyncStats] = useState<{ [key: string]: { success: number, error: number, lastSuccess?: Date } }>({})
  const { addLog } = useSyncLoggerContext()

  const handleSync = async (type: "bookings" | "photos") => {
    setIsLoading(type)
    const startTime = Date.now()
    addLog("info", `Starting ${type} synchronization...`, { type }, type)
    try {
      const endpoint = type === "bookings" ? "/api/sync/bookings" : "/api/sync/photos"
      addLog("info", `Making request to ${endpoint}`, { endpoint }, type)
      
      if (type === "photos") {
        // Handle streaming response for photos
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error("No response body")
        }
        
        const decoder = new TextDecoder()
        let buffer = ""
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ""
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                
                // Add log based on progress type
                switch (data.type) {
                  case 'start':
                    addLog("info", data.message, { step: "start" }, type)
                    break
                  case 'fetch':
                    addLog("info", data.message, { step: "fetch" }, type)
                    break
                  case 'fetched':
                    addLog("success", data.message, { 
                      totalRecords: data.totalRecords,
                      step: "fetched"
                    }, type)
                    break
                  case 'processing':
                    addLog("info", data.message, { 
                      totalRecords: data.totalRecords,
                      batchSize: data.batchSize,
                      step: "processing"
                    }, type)
                    break
                  case 'batch_start':
                    addLog("info", data.message, { 
                      batch: data.batch,
                      totalBatches: data.totalBatches,
                      recordsInBatch: data.recordsInBatch,
                      totalProcessed: data.totalProcessed,
                      totalRecords: data.totalRecords
                    }, type)
                    break
                  case 'batch_complete':
                    addLog("success", data.message, { 
                      batch: data.batch,
                      totalBatches: data.totalBatches,
                      recordsInBatch: data.recordsInBatch,
                      totalProcessed: data.totalProcessed,
                      totalRecords: data.totalRecords,
                      createdCount: data.createdCount,
                      updatedCount: data.updatedCount
                    }, type)
                    break
                  case 'complete':
                    const endTime = Date.now()
                    const duration = endTime - startTime
                    
                    setLastSync((prev) => ({ ...prev, [type]: new Date() }))
                    setSyncStats((prev) => ({
                      ...prev,
                      [type]: { ...prev[type], success: (prev[type]?.success || 0) + 1, lastSuccess: new Date() },
                    }))
                    
                    addLog("success", `${data.message} in ${duration}ms`, {
                      createdCount: data.createdCount,
                      updatedCount: data.updatedCount,
                      totalProcessed: data.totalProcessed,
                      duration: duration,
                      processingTime: data.processingTime
                    }, type)
                    showNotification(`${type} sync successful!`, "success")
                    break
                  case 'error':
                    setSyncStats((prev) => ({
                      ...prev,
                      [type]: { ...prev[type], error: (prev[type]?.error || 0) + 1 },
                    }))
                    addLog("error", data.message, { error: data.error }, type)
                    showNotification(`${type} sync failed: ${data.error}`, "error")
                    break
                }
              } catch (parseError) {
                console.error('Error parsing SSE data:', parseError)
              }
            }
          }
        }
      } else {
        // Handle regular JSON response for bookings
        addLog("info", `Fetching data from external API...`, { step: "fetch_start" }, type)
        
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        
        addLog("info", `Response received: ${response.status} ${response.statusText}`, { status: response.status }, type)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        addLog("info", `Parsing response data...`, { step: "parsing" }, type)
        const result = await response.json()
        addLog("info", `Response parsed successfully`, { step: "parsed" }, type)
        
        if (result.success) {
          // Log detailed progress
          addLog("info", `Processing ${result.data?.recordsProcessed || 0} records...`, { 
            recordsProcessed: result.data?.recordsProcessed || 0 
          }, type)
          
          if (result.data?.recordsCreated > 0) {
            addLog("success", `Created ${result.data.recordsCreated} new records`, { 
              recordsCreated: result.data.recordsCreated 
            }, type)
          }
          
          if (result.data?.recordsUpdated > 0) {
            addLog("success", `Updated ${result.data.recordsUpdated} existing records`, { 
              recordsUpdated: result.data.recordsUpdated 
            }, type)
          }
          
          const endTime = Date.now()
          const duration = endTime - startTime
          
          setLastSync((prev) => ({ ...prev, [type]: new Date() }))
          setSyncStats((prev) => ({
            ...prev,
            [type]: { ...prev[type], success: (prev[type]?.success || 0) + 1, lastSuccess: new Date() },
          }))
          addLog(
            "success",
            `${type} sync completed successfully in ${duration}ms`,
            {
              recordsCreated: result.data?.recordsCreated || 0,
              recordsUpdated: result.data?.recordsUpdated || 0,
              recordsProcessed: result.data?.recordsProcessed || 0,
              duration: duration,
              processingTime: new Date().toISOString()
            },
            type
          )
          showNotification(`${type} sync successful!`, "success")
        } else {
          // Handle case where sync completed but with errors
          const errorMessage = result.error || (result.data?.errors && result.data.errors.length > 0 ? result.data.errors.join(', ') : 'Unknown error')
          const hasProcessedRecords = (result.data?.recordsCreated || 0) + (result.data?.recordsUpdated || 0) > 0
          
          if (hasProcessedRecords) {
            // Some records were processed successfully
            setLastSync((prev) => ({ ...prev, [type]: new Date() }))
            setSyncStats((prev) => ({
              ...prev,
              [type]: { ...prev[type], success: (prev[type]?.success || 0) + 1, lastSuccess: new Date() },
            }))
            
            if (result.data?.recordsCreated > 0) {
              addLog("success", `Created ${result.data.recordsCreated} new records`, { 
                recordsCreated: result.data.recordsCreated 
              }, type)
            }
            
            if (result.data?.recordsUpdated > 0) {
              addLog("success", `Updated ${result.data.recordsUpdated} existing records`, { 
                recordsUpdated: result.data.recordsUpdated 
              }, type)
            }
            
            addLog("error", `${type} sync completed with errors: ${errorMessage}`, { 
              error: errorMessage,
              recordsCreated: result.data?.recordsCreated || 0,
              recordsUpdated: result.data?.recordsUpdated || 0
            }, type)
            showNotification(`${type} sync completed with errors: ${errorMessage}`, "error")
          } else {
            // No records were processed
            setSyncStats((prev) => ({
              ...prev,
              [type]: { ...prev[type], error: (prev[type]?.error || 0) + 1 },
            }))
            addLog("error", `${type} sync failed: ${errorMessage}`, { error: errorMessage }, type)
            showNotification(`${type} sync failed: ${errorMessage}`, "error")
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setSyncStats((prev) => ({
        ...prev,
        [type]: { ...prev[type], error: (prev[type]?.error || 0) + 1 },
      }))
      addLog("error", `${type} sync error: ${errorMessage}`, { error: errorMessage }, type)
      showNotification(`${type} sync error: ${errorMessage}`, "error")
    } finally {
      setIsLoading(null)
    }
  }

  const showNotification = (message: string, type: "success" | "error") => {
    const notification = document.createElement("div")
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
      type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
    }`
    notification.textContent = message
    document.body.appendChild(notification)
    setTimeout(() => {
      notification.remove()
    }, 4000)
  }

  const getButtonText = (type: "bookings" | "photos") =>
    isLoading === type ? (
      <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
        <Spinner />
        Syncing...
      </span>
    ) : type === "bookings" ? (
      <>
        <BookIcon /> Sync Bookings
      </>
    ) : (
      <>
        <ImageIcon /> Sync Photos
      </>
    )

  const getLastSyncText = (type: "bookings" | "photos") => {
    const lastSyncTime = lastSync[type]
    if (!lastSyncTime) return "Never synced"
    const now = new Date()
    const diffMs = now.getTime() - lastSyncTime.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }
  const getSyncStats = (type: "bookings" | "photos") => syncStats[type] || { success: 0, error: 0 }

  return (
    <div style={{borderRadius: '4px',display:'flex',flexDirection:'column',alignItems:'center',fontFamily:'Inter,Arial,sans-serif'}}>
      <main style={{width:'100%',maxWidth:'100%',margin:'48px auto 48px auto'}}>
        <div style={{marginBottom:32,textAlign:'center'}}>
          <h1 style={{fontSize:32,fontWeight:700,color:'#fff',marginBottom:8}}>Data Synchronization</h1>
          <p style={{color:'#6b7280',fontSize:18}}>Keep your data in sync with external APIs</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}}>
          {/* Bookings Card */}
          <div style={{background:'#fff',borderRadius:20,boxShadow:'0 2px 16px rgba(0,0,0,0.06)',border:'1px solid #e5e7eb',padding:28,display:'flex',flexDirection:'column',minHeight:260}}>
            <div style={{display:'flex',alignItems:'center',marginBottom:12}}>
              <BookIcon />
              <div>
                <div style={{fontWeight:600,fontSize:20,color:'#111827'}}>Bookings</div>
                <div style={{color:'#6b7280',fontSize:13}}>External API</div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:8}}>
              <span style={{color:'#6b7280'}}>Last sync</span>
              <span style={{color:'#111827',fontWeight:500}}>{getLastSyncText("bookings")}</span>
            </div>
            <button
              onClick={() => handleSync("bookings")}
              disabled={isLoading !== null}
              style={{
                width:'100%',margin:'12px 0 0 0',padding:'12px 0',borderRadius:10,
                background:'#2563eb',color:'#fff',fontWeight:700,fontSize:16,border:0,boxShadow:'0 1px 4px rgba(37,99,235,0.08)',
                cursor:isLoading?"not-allowed":"pointer",opacity:isLoading?0.6:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'background 0.2s'
              }}
            >
              {getButtonText("bookings")}
            </button>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:18}}>
              <span style={{background:'#dcfce7',color:'#059669',fontWeight:700,borderRadius:16,padding:'4px 14px',fontSize:14,display:'inline-flex',alignItems:'center',gap:6}}>Success: {getSyncStats("bookings").success}</span>
              <span style={{background:'#fee2e2',color:'#dc2626',fontWeight:700,borderRadius:16,padding:'4px 14px',fontSize:14,display:'inline-flex',alignItems:'center',gap:6}}>Errors: {getSyncStats("bookings").error}</span>
            </div>
          </div>
          {/* Photos Card */}
          <div style={{background:'#fff',borderRadius:20,boxShadow:'0 2px 16px rgba(0,0,0,0.06)',border:'1px solid #e5e7eb',padding:28,display:'flex',flexDirection:'column',minHeight:260}}>
            <div style={{display:'flex',alignItems:'center',marginBottom:12}}>
              <ImageIcon />
              <div>
                <div style={{fontWeight:600,fontSize:20,color:'#111827'}}>Photos</div>
                <div style={{color:'#6b7280',fontSize:13}}>Fake API</div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:8}}>
              <span style={{color:'#6b7280'}}>Last sync</span>
              <span style={{color:'#111827',fontWeight:500}}>{getLastSyncText("photos")}</span>
            </div>
            <button
              onClick={() => handleSync("photos")}
              disabled={isLoading !== null}
              style={{
                width:'100%',margin:'12px 0 0 0',padding:'12px 0',borderRadius:10,
                background:'#059669',color:'#fff',fontWeight:700,fontSize:16,border:0,boxShadow:'0 1px 4px rgba(16,185,129,0.08)',
                cursor:isLoading?"not-allowed":"pointer",opacity:isLoading?0.6:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'background 0.2s'
              }}
            >
              {getButtonText("photos")}
            </button>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:18}}>
              <span style={{background:'#dcfce7',color:'#059669',fontWeight:700,borderRadius:16,padding:'4px 14px',fontSize:14,display:'inline-flex',alignItems:'center',gap:6}}>Success: {getSyncStats("photos").success}</span>
              <span style={{background:'#fee2e2',color:'#dc2626',fontWeight:700,borderRadius:16,padding:'4px 14px',fontSize:14,display:'inline-flex',alignItems:'center',gap:6}}>Errors: {getSyncStats("photos").error}</span>
            </div>
          </div>
          
        </div>
        {/* Status Card */}
        <div style={{marginTop:40,display:'flex',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:20,boxShadow:'0 2px 8px rgba(0,0,0,0.04)',border:'1px solid #e5e7eb',display:'flex',alignItems:'center',gap:16,padding:'24px 32px',maxWidth:420}}>
            <StatusIcon />
            <div>
              <div style={{fontWeight:600,fontSize:18,color:'#111827'}}>Sync Services Active</div>
              <div style={{color:'#6b7280',fontSize:13,marginTop:2}}>All synchronization services are running and ready to sync your data</div>
            </div>
          </div>
        </div>
        {/* Logger Modal */}
        <SyncLogger isVisible={showLogger} onClose={() => setShowLogger(false)} />
        {/* Logger Button */}
        <div style={{display:'flex',justifyContent:'center',marginTop:40}}>
          <button
            onClick={() => setShowLogger(true)}
            style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 22px',border:'1px solid #cbd5e1',borderRadius:10,background:'#fff',color:'#334155',fontWeight:600,fontSize:15,boxShadow:'0 1px 4px rgba(0,0,0,0.04)',cursor:'pointer',transition:'background 0.2s'}}
          >
            <LogIcon />
            Show Logger
          </button>
        </div>
      </main>
    </div>
  )
}

export default SyncButtons 