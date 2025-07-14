import { getPayload } from 'payload'
import config from '../payload.config'

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const syncPhotosEndpoint = {
  path: '/sync/photos',
  method: 'post' as const,
  handler: async (req: any) => {
    try {
      // Create a local Payload instance
      const payload = await getPayload({ config })
      
      // Set up streaming response
      const stream = new ReadableStream({
        async start(controller) {
          const sendProgress = (data: any) => {
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`))
          }
          
          try {
            // Send initial progress
            sendProgress({ type: 'start', message: 'Starting photos sync...' })
            
            // Fetch photos from jsonplaceholder API
            sendProgress({ type: 'fetch', message: 'Fetching data from external API...' })
            const response = await fetch('https://jsonplaceholder.typicode.com/photos')
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            const photos = await response.json()
            console.log(`Fetched ${photos.length} photos from API`)
            sendProgress({ 
              type: 'fetched', 
              message: `Fetched ${photos.length} photos from API`,
              totalRecords: photos.length 
            })
            
            // Process all photos from the API (no limit)
            const photosToProcess = photos
            console.log(`Will process ${photosToProcess.length} photos in batches of 10`)
            
            let createdCount = 0
            let updatedCount = 0
            const errors: string[] = []
            
            // Process photos in batches with delays
            const batchSize = 100 // Process 10 photos at a time
            const delayBetweenBatches = 50 // 50ms delay between batches
            
            sendProgress({ 
              type: 'processing', 
              message: `Processing ${photosToProcess.length} records in batches of ${batchSize}...`,
              totalRecords: photosToProcess.length,
              batchSize: batchSize
            })
            
            for (let i = 0; i < photosToProcess.length; i += batchSize) {
              const batch = photosToProcess.slice(i, i + batchSize)
              const batchNumber = Math.floor(i / batchSize) + 1
              const totalBatches = Math.ceil(photosToProcess.length / batchSize)
              
              // Send batch start progress
              sendProgress({ 
                type: 'batch_start', 
                message: `Processing batch ${batchNumber}/${totalBatches}`,
                batch: batchNumber,
                totalBatches: totalBatches,
                recordsInBatch: batch.length,
                totalProcessed: i,
                totalRecords: photosToProcess.length
              })
              
              // Process each photo in the current batch
              for (const photo of batch) {
                try {
                  // Check if photo already exists
                  const existingPhoto = await payload.find({
                    collection: 'photos',
                    where: {
                      externalId: { equals: photo.id }
                    }
                  })
                  
                  if (existingPhoto.docs.length === 0) {
                    // Create new photo
                    await payload.create({
                      collection: 'photos',
                      data: {
                        title: photo.title,
                        url: photo.url,
                        thumbnailUrl: photo.thumbnailUrl,
                        externalId: photo.id,
                        albumId: photo.albumId,
                        rawData: photo
                      }
                    })
                    createdCount++
                  } else {
                    // Update existing photo
                    await payload.update({
                      collection: 'photos',
                      id: existingPhoto.docs[0].id,
                      data: {
                        title: photo.title,
                        url: photo.url,
                        thumbnailUrl: photo.thumbnailUrl,
                        albumId: photo.albumId,
                        rawData: photo
                      }
                    })
                    updatedCount++
                  }
                } catch (error) {
                  const errorMsg = error instanceof Error ? error.message : 'Unknown error'
                  errors.push(`Failed to process photo ${photo.id}: ${errorMsg}`)
                  console.error(`Photo sync error for ID ${photo.id}:`, error)
                }
              }
              
              // Send batch complete progress
              sendProgress({ 
                type: 'batch_complete', 
                message: `Completed batch ${batchNumber}/${totalBatches}`,
                batch: batchNumber,
                totalBatches: totalBatches,
                recordsInBatch: batch.length,
                totalProcessed: i + batch.length,
                totalRecords: photosToProcess.length,
                createdCount: createdCount,
                updatedCount: updatedCount
              })
              
              // Add delay between batches to allow UI to update
              if (i + batchSize < photosToProcess.length) {
                await delay(delayBetweenBatches)
              }
            }
            
            const success = errors.length === 0
            
            // Send final progress
            sendProgress({ 
              type: 'complete', 
              message: `Sync completed: ${createdCount} created, ${updatedCount} updated`,
              success: success,
              createdCount: createdCount,
              updatedCount: updatedCount,
              totalProcessed: createdCount + updatedCount,
              errors: errors,
              processingTime: new Date().toISOString()
            })
            
            controller.close()
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error'
            console.error('Photos sync endpoint error:', error)
            
            sendProgress({ 
              type: 'error', 
              message: `Sync failed: ${errorMsg}`,
              error: errorMsg
            })
            
            controller.close()
          }
        }
      })
      
      return new Response(stream, {
        status: 200,
        headers: { 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error('Photos sync endpoint error:', error)
      
      return new Response(JSON.stringify({
        success: false,
        error: errorMsg,
        data: {
          recordsProcessed: 0,
          recordsCreated: 0,
          recordsUpdated: 0,
          errors: [errorMsg]
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
} 