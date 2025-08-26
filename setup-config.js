import fetch from 'node-fetch'

async function setupConfig() {
  const baseUrl = 'http://localhost:3000'
  const currentToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTQ0ODgyNDQsInVzZXJuYW1lIjoiICIsImxvZ2luIjoiYWRtaW5AZXVyb2tsaW5pa2EucGwiLCJ1c2VyaWQiOiIyMTM1MSIsInJvbGVzIjpbIkNvbnRyYWN0b3IiXSwiaXNzIjoiR2Fib3NBUEkiLCJhdWQiOiJhY2Nlc3MifQ.kAvr3lfUD9kIOfwDquqI2Xi_s5WK4ny7aPslmFiT5UQ'

  console.log('🔧 Setting up API Sync configuration...')

  // Step 1: Check current config
  try {
    console.log('\n📋 Checking current config...')
    const statusResponse = await fetch(`${baseUrl}/api/next/api-sync/status`)

    if (statusResponse.ok) {
      const status = await statusResponse.json()
      console.log('✅ Current config:', status.data?.adminConfig)
    } else {
      console.log('❌ Could not check current config')
    }
  } catch (error) {
    console.log('❌ Status check error:', error.message)
  }

  // Step 2: Update config with current token
  try {
    console.log('\n🔧 Updating config with current token...')
    const updateResponse = await fetch(`${baseUrl}/api/next/api-sync/update-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: 'https://ep4.gabos.pl',
        endpoint: 'api/v1/Bookings/GetBookingsByContractor',
        jwtToken: currentToken,
        autoSync: false,
        syncInterval: 300000, // 5 minutes
        retryAttempts: 3,
        retryDelay: 1000,
      }),
    })

    if (updateResponse.ok) {
      const result = await updateResponse.json()
      console.log('✅ Config updated successfully:', result)
    } else {
      const errorText = await updateResponse.text()
      console.log('❌ Config update failed:', errorText)
    }
  } catch (error) {
    console.log('❌ Config update error:', error.message)
  }

  // Step 3: Test sync with updated config
  try {
    console.log('\n🔄 Testing sync with updated config...')
    const syncResponse = await fetch(`${baseUrl}/api/next/api-sync/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Sync response status:', syncResponse.status)

    if (syncResponse.ok) {
      const result = await syncResponse.json()
      console.log('✅ Sync test result:', JSON.stringify(result, null, 2))

      if (result.success) {
        console.log('🎉 Sync successful!')
        console.log('- Records processed:', result.data.recordsProcessed)
        console.log('- Records created:', result.data.recordsCreated)
        console.log('- Records updated:', result.data.recordsUpdated)
      } else {
        console.log('❌ Sync failed:', result.error)
      }
    } else {
      const errorText = await syncResponse.text()
      console.log('❌ Sync test failed:', errorText)
    }
  } catch (error) {
    console.log('❌ Sync test error:', error.message)
  }

  // Step 4: Instructions for token refresh
  console.log('\n📝 Instructions for token refresh:')
  console.log('1. Token expires every 10 minutes')
  console.log('2. When sync fails with 401 error, get new token from API')
  console.log('3. Update config using: POST /api/next/api-sync/update-token')
  console.log('4. Or update full config using: POST /api/next/api-sync/update-config')
  console.log('5. Run sync again: POST /api/next/api-sync/sync')
}

setupConfig()
