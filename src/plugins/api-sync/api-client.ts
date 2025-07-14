import { ApiSyncConfig, ApiResponse, BookingData, PhotoData } from './types'

export class ApiClient {
  private config: ApiSyncConfig
  private baseUrl: string

  constructor(config: ApiSyncConfig) {
    this.config = config
    this.baseUrl = config.apiUrl.replace(/\/$/, '') // Remove trailing slash
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint.replace(/^\//, '')}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers,
    }

    // Add JWT token if provided
    if (this.config.jwtToken) {
      headers['Authorization'] = `Bearer ${this.config.jwtToken}`
    }

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, requestOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        data,
        success: true,
      }
    } catch (error) {
      return {
        data: undefined as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async getBookingsByContractor(contractorId?: string): Promise<ApiResponse<BookingData[]>> {
    const endpoint = this.config.endpoint
    
    // Add query parameters if contractorId is provided
    const queryParams = contractorId ? `?contractorId=${contractorId}` : ''
    const fullEndpoint = `${endpoint}${queryParams}`
    
    return this.makeRequest<BookingData[]>(fullEndpoint)
  }

  async getBookings(): Promise<ApiResponse<BookingData[]>> {
    return this.makeRequest<BookingData[]>(this.config.endpoint)
  }

  async getPhotos(): Promise<ApiResponse<PhotoData[]>> {
    return this.makeRequest<PhotoData[]>('photos')
  }

  async getPhotosByAlbum(albumId: number): Promise<ApiResponse<PhotoData[]>> {
    return this.makeRequest<PhotoData[]>(`photos?albumId=${albumId}`)
  }

  // Generic method for any endpoint
  async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, options)
  }

  // Update JWT token
  updateJwtToken(token: string): void {
    this.config.jwtToken = token
  }

  // Update headers
  updateHeaders(headers: Record<string, string>): void {
    this.config.headers = {
      ...this.config.headers,
      ...headers,
    }
  }
} 