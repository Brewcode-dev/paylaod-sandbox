export interface ApiSyncConfig {
  // API Configuration
  apiUrl: string
  endpoint: string
  jwtToken?: string
  headers?: Record<string, string>

  // Sync Configuration
  collectionName: string
  syncInterval?: number // in milliseconds
  autoSync?: boolean

  // Data Mapping
  fieldMapping?: Record<string, string>
  transformData?: (data: any) => any

  // Error Handling
  onError?: (error: Error) => void
  retryAttempts?: number
  retryDelay?: number
}

export interface BookingData {
  id: string
  contractorId: string
  bookingDate: string
  status: string
  // Add more fields as needed based on your API response
  [key: string]: any
}

export interface PhotoData {
  id: number
  albumId: number
  title: string
  url: string
  thumbnailUrl: string
  // Add more fields as needed based on your API response
  [key: string]: any
}

export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface SyncResult {
  success: boolean
  recordsProcessed: number
  recordsCreated: number
  recordsUpdated: number
  errors: string[]
  timestamp: Date
}

export interface SyncJob {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: SyncResult
  startedAt?: Date
  completedAt?: Date
  error?: string
}
