import { Payload } from 'payload'
import { ApiClient } from './api-client'
import { ApiSyncConfig, SyncResult, BookingData, PhotoData } from './types'

export class SyncService {
  private payload: Payload
  private apiClient: ApiClient
  private config: ApiSyncConfig

  constructor(payload: Payload, config: ApiSyncConfig) {
    this.payload = payload
    this.config = config
    this.apiClient = new ApiClient(config)
  }

  async syncBookings(): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      errors: [],
      timestamp: new Date(),
    }

    try {
      console.log('🔄 Starting syncBookings...')

      // Fetch data from external API
      const apiResponse = await this.apiClient.getBookings()

      if (!apiResponse.success || !apiResponse.data) {
        result.errors.push(`API request failed: ${apiResponse.error}`)
        return result
      }

      const responseData = apiResponse.data as any

      console.log('📡 API Response structure:', {
        hasData: !!responseData,
        dataType: typeof responseData,
        hasResults: responseData && typeof responseData === 'object' && 'results' in responseData,
        resultsType: responseData?.results ? typeof responseData.results : 'undefined',
        resultsLength: Array.isArray(responseData?.results)
          ? responseData.results.length
          : 'not array',
      })

      // Handle different API response structures
      let bookings: BookingData[] = []

      if (Array.isArray(responseData)) {
        // Direct array response
        bookings = responseData as BookingData[]
        console.log('📋 Direct array response, found', bookings.length, 'bookings')
      } else if (responseData && typeof responseData === 'object' && 'results' in responseData) {
        // Response with results property
        bookings = Array.isArray(responseData.results) ? responseData.results : []
        console.log('📋 Results property response, found', bookings.length, 'bookings')
      } else {
        // Unknown structure
        console.error('❌ Unknown API response structure:', responseData)
        result.errors.push('Unknown API response structure')
        return result
      }

      result.recordsProcessed = bookings.length
      console.log('📊 Processing', bookings.length, 'bookings')

      // Process each booking
      for (const booking of bookings) {
        try {
          console.log('🔄 Processing booking:', booking.id)
          const transformedData = this.transformBookingData(booking)
          await this.upsertBooking(transformedData, result)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          result.errors.push(`Error processing booking ${booking.id}: ${errorMessage}`)
        }
      }

      result.success = result.errors.length === 0
      console.log('✅ Sync completed:', {
        success: result.success,
        recordsProcessed: result.recordsProcessed,
        recordsCreated: result.recordsCreated,
        recordsUpdated: result.recordsUpdated,
        errors: result.errors,
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Sync failed:', errorMessage)
      result.errors.push(`Sync failed: ${errorMessage}`)
      return result
    }
  }

  private transformBookingData(booking: BookingData): any {
    console.log('🔄 Transforming booking data:', booking)

    // Apply custom transformation if provided
    if (this.config.transformData) {
      return this.config.transformData(booking)
    }

    // Extract patient name from API response
    let fullName = 'Nieznany pacjent'
    if (booking.patient) {
      const firstName = booking.patient.firstname || booking.patient.firstName || ''
      const lastName = booking.patient.lastname || booking.patient.lastName || ''
      fullName = `${firstName} ${lastName}`.trim()
      if (!fullName) {
        fullName = 'Nieznany pacjent'
      }
    }

    // Default transformation based on actual API response structure
    const transformed: any = {
      externalId: booking.id?.toString(),
      contractorId: booking.patient?.id?.toString() || booking.contractorId?.toString(),
      fullName: fullName,
      bookingDate: booking.startTime ? new Date(booking.startTime) : new Date(),
      status: this.mapBookingStatus(booking.bookingStatus || booking.status),
      rawData: booking, // Store complete raw data
    }

    console.log('✅ Transformed booking data:', transformed)
    return transformed
  }

  private transformPhotoData(photo: PhotoData): any {
    // Apply custom transformation if provided
    if (this.config.transformData) {
      return this.config.transformData(photo)
    }

    // Default transformation with field mapping
    const transformed: any = {
      externalId: photo.id,
      albumId: photo.albumId,
      title: photo.title,
      url: photo.url,
      thumbnailUrl: photo.thumbnailUrl,
      // Map other fields based on fieldMapping config
      ...this.mapFields(photo),
    }

    return transformed
  }

  private mapFields(data: any): Record<string, any> {
    if (!this.config.fieldMapping) {
      return {}
    }

    const mapped: Record<string, any> = {}

    for (const [apiField, payloadField] of Object.entries(this.config.fieldMapping)) {
      if (data[apiField] !== undefined) {
        mapped[payloadField] = data[apiField]
      }
    }

    return mapped
  }

  private async upsertBooking(data: any, result: SyncResult): Promise<void> {
    try {
      // Check if booking already exists by externalId
      const existingBooking = await this.payload.find({
        collection: this.config.collectionName as any,
        where: {
          externalId: {
            equals: data.externalId,
          },
        },
        limit: 1,
      })

      if (existingBooking.docs.length > 0) {
        // Update existing booking
        await this.payload.update({
          collection: this.config.collectionName as any,
          id: existingBooking.docs[0].id,
          data: {
            ...data,
            lastSynced: new Date(),
          },
        })
        result.recordsUpdated++
      } else {
        // Create new booking
        await this.payload.create({
          collection: this.config.collectionName as any,
          data: {
            ...data,
            lastSynced: new Date(),
          },
        })
        result.recordsCreated++
      }
    } catch (error) {
      throw new Error(
        `Failed to upsert booking: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  private async upsertPhoto(data: any, result: SyncResult): Promise<void> {
    try {
      // Check if photo already exists by externalId
      const existingPhoto = await this.payload.find({
        collection: 'photos' as any,
        where: {
          externalId: {
            equals: data.externalId,
          },
        },
        limit: 1,
      })

      if (existingPhoto.docs.length > 0) {
        // Update existing photo
        await this.payload.update({
          collection: 'photos' as any,
          id: existingPhoto.docs[0].id,
          data: {
            ...data,
            lastSynced: new Date(),
          },
        })
        result.recordsUpdated++
      } else {
        // Create new photo
        await this.payload.create({
          collection: 'photos' as any,
          data: {
            ...data,
            lastSynced: new Date(),
          },
        })
        result.recordsCreated++
      }
    } catch (error) {
      throw new Error(
        `Failed to upsert photo: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  // Method to sync photos
  async syncPhotos(): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      errors: [],
      timestamp: new Date(),
    }

    try {
      // Fetch data from external API
      const apiResponse = await this.apiClient.getPhotos()

      if (!apiResponse.success || !apiResponse.data) {
        result.errors.push(`API request failed: ${apiResponse.error}`)
        return result
      }

      const photos = apiResponse.data as PhotoData[]
      result.recordsProcessed = photos.length

      // Process each photo
      for (const photo of photos) {
        try {
          const transformedData = this.transformPhotoData(photo)
          await this.upsertPhoto(transformedData, result)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          result.errors.push(`Error processing photo ${photo.id}: ${errorMessage}`)
        }
      }

      result.success = result.errors.length === 0
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      result.errors.push(`Sync failed: ${errorMessage}`)
      return result
    }
  }

  // Method to sync photos by album
  async syncPhotosByAlbum(albumId: number): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      errors: [],
      timestamp: new Date(),
    }

    try {
      const apiResponse = await this.apiClient.getPhotosByAlbum(albumId)

      if (!apiResponse.success || !apiResponse.data) {
        result.errors.push(`API request failed: ${apiResponse.error}`)
        return result
      }

      const photos = apiResponse.data as PhotoData[]
      result.recordsProcessed = photos.length

      for (const photo of photos) {
        try {
          const transformedData = this.transformPhotoData(photo)
          await this.upsertPhoto(transformedData, result)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          result.errors.push(`Error processing photo ${photo.id}: ${errorMessage}`)
        }
      }

      result.success = result.errors.length === 0
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      result.errors.push(`Sync failed: ${errorMessage}`)
      return result
    }
  }

  // Method to sync specific contractor bookings
  async syncBookingsByContractor(contractorId: string): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      errors: [],
      timestamp: new Date(),
    }

    try {
      const apiResponse = await this.apiClient.getBookingsByContractor(contractorId)

      if (!apiResponse.success || !apiResponse.data) {
        result.errors.push(`API request failed: ${apiResponse.error}`)
        return result
      }

      const bookings = apiResponse.data as BookingData[]
      result.recordsProcessed = bookings.length

      for (const booking of bookings) {
        try {
          const transformedData = this.transformBookingData(booking)
          await this.upsertBooking(transformedData, result)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          result.errors.push(`Error processing booking ${booking.id}: ${errorMessage}`)
        }
      }

      result.success = result.errors.length === 0
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      result.errors.push(`Sync failed: ${errorMessage}`)
      return result
    }
  }

  private mapBookingStatus(apiStatus: string): string {
    // Map API status to Payload status
    const statusMap: Record<string, string> = {
      Planned: 'pending',
      Confirmed: 'confirmed',
      ToBeConfirmed: 'pending',
      NoContact: 'cancelled',
      Cancelled: 'cancelled',
      Completed: 'completed',
    }

    return statusMap[apiStatus] || 'pending'
  }

  // Update JWT token
  updateJwtToken(token: string): void {
    this.config.jwtToken = token
    this.apiClient.updateJwtToken(token)
  }

  // Update configuration dynamically
  updateConfig(newConfig: ApiSyncConfig): void {
    this.config = { ...this.config, ...newConfig }
    this.apiClient.updateJwtToken(newConfig.jwtToken || '')
  }
}
