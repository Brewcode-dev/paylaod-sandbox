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
      // Fetch data from external API
      const apiResponse = await this.apiClient.getBookings()
      
      if (!apiResponse.success || !apiResponse.data) {
        result.errors.push(`API request failed: ${apiResponse.error}`)
        return result
      }

      const bookings = apiResponse.data as BookingData[]
      result.recordsProcessed = bookings.length

      // Process each booking
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

  private transformBookingData(booking: BookingData): any {
    // Apply custom transformation if provided
    if (this.config.transformData) {
      return this.config.transformData(booking)
    }

    // Default transformation with field mapping
    const transformed: any = {
      externalId: booking.id,
      contractorId: booking.contractorId,
      bookingDate: new Date(booking.bookingDate),
      status: booking.status,
      // Map other fields based on fieldMapping config
      ...this.mapFields(booking),
    }

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
      throw new Error(`Failed to upsert booking: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
      throw new Error(`Failed to upsert photo: ${error instanceof Error ? error.message : 'Unknown error'}`)
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