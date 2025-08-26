import { ApiSyncConfig, ApiResponse, BookingData, PhotoData } from './types'

export class ApiClient {
  private config: ApiSyncConfig
  private baseUrl: string

  constructor(config: ApiSyncConfig) {
    this.config = config
    this.baseUrl = config.apiUrl.replace(/\/$/, '') // Remove trailing slash
    console.log('🔧 ApiClient initialized with config:', {
      baseUrl: this.baseUrl,
      endpoint: config.endpoint,
      hasToken: !!config.jwtToken,
    })
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
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

    console.log('🌐 Making API request:', {
      url,
      method: options.method || 'GET',
      hasAuth: !!this.config.jwtToken,
      headers: Object.keys(headers),
    })

    try {
      // Check if fetch is available
      if (typeof fetch === 'undefined') {
        throw new Error(
          'fetch is not available in this environment. Please install node-fetch or use a polyfill.',
        )
      }

      const response = await fetch(url, requestOptions)

      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()

      console.log('✅ API request successful, data received:', {
        dataType: typeof data,
        hasResults: data && typeof data === 'object' && 'results' in data,
        resultsCount: data?.results?.length || 0,
      })

      return {
        data,
        success: true,
      }
    } catch (error) {
      console.error('❌ API request failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        url,
      })

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

    console.log('📋 Getting bookings by contractor:', { contractorId, fullEndpoint })
    return this.makeRequest<BookingData[]>(fullEndpoint)
  }

  async getBookings(): Promise<ApiResponse<BookingData[]>> {
    console.log('📋 Getting all bookings from endpoint:', this.config.endpoint)
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
    console.log('🔑 Updating JWT token')
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
