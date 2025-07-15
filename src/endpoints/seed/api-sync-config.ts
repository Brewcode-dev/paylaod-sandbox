import { Payload } from 'payload'

export const seedApiSyncConfig = async (payload: Payload): Promise<void> => {
  try {
    // Check if global already exists
    const existingConfig = await payload.findGlobal({
      slug: 'api-sync-config',
    })

    if (existingConfig) {
      console.log('API Sync Config already exists, skipping seed')
      return
    }

    // Create initial API Sync Config
    await payload.updateGlobal({
      slug: 'api-sync-config',
      data: {
        apiUrl: process.env.API_BASE_URL || 'https://api.example.com',
        endpoint: 'api/v1/Bookings/GetBookingsByContractor',
        jwtToken: process.env.API_JWT_TOKEN || '',
        autoSync: false,
        syncInterval: 300000, // 5 minutes
        retryAttempts: 3,
        retryDelay: 1000,
        lastSync: null,
        lastSyncStatus: 'never',
        lastSyncError: null,
        syncStats: {
          totalRecords: 0,
          lastRecordsProcessed: 0,
          lastRecordsCreated: 0,
          lastRecordsUpdated: 0,
        },
      },
    })

    console.log('✅ API Sync Config seeded successfully')
  } catch (error) {
    console.error('❌ Failed to seed API Sync Config:', error)
  }
} 