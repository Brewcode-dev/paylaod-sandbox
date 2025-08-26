import fetch from 'node-fetch'

async function updateConfig() {
  const baseUrl = 'http://localhost:3000'
  const payloadToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTQ0ODgyNDQsInVzZXJuYW1lIjoiICIsImxvZ2luIjoiYWRtaW5AZXVyb2tsaW5pa2EucGwiLCJ1c2VyaWQiOiIyMTM1MSIsInJvbGVzIjpbIkNvbnRyYWN0b3IiXSwiaXNzIjoiR2Fib3NBUEkiLCJhdWQiOiJhY2Nlc3MifQ.kAvr3lfUD9kIOfwDquqI2Xi_s5WK4ny7aPslmFiT5UQ'

  console.log('🔧 Updating API Sync configuration...')

  // Update config with new token
  try {
    console.log('\n🔧 Updating config with new token...')
    const updateResponse = await fetch(`${baseUrl}/api/next/api-sync/update-config`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${payloadToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: 'https://ep4.gabos.pl',
        endpoint: 'api/v1/Bookings/GetBookingsByContractor',
        jwtToken:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTQ0ODgyNDQsInVzZXJuYW1lIjoiICIsImxvZ2luIjoiYWRtaW5AZXVyb2tsaW5pa2EucGwiLCJ1c2VyaWQiOiIyMTM1MSIsInJvbGVzIjpbIkNvbnRyYWN0b3IiXSwiaXNzIjoiR2Fib3NBUEkiLCJhdWQiOiJhY2Nlc3MifQ.kAvr3lfUD9kIOfwDquqI2Xi_s5WK4ny7aPslmFiT5UQ',
        autoSync: false,
        syncInterval: 300000,
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

  // Test sync after config update
  try {
    console.log('\n🔄 Testing sync after config update...')
    const syncResponse = await fetch(`${baseUrl}/api/next/api-sync/sync`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${payloadToken}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Sync response status:', syncResponse.status)

    if (syncResponse.ok) {
      const result = await syncResponse.json()
      console.log('✅ Sync test result:', JSON.stringify(result, null, 2))
    } else {
      const errorText = await syncResponse.text()
      console.log('❌ Sync test failed:', errorText)
    }
  } catch (error) {
    console.log('❌ Sync test error:', error.message)
  }

  // Also test the /sync/bookings endpoint
  try {
    console.log('\n🔄 Testing /sync/bookings endpoint...')
    const syncResponse = await fetch(`${baseUrl}/sync/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Sync response status:', syncResponse.status)

    if (syncResponse.ok) {
      const result = await syncResponse.json()
      console.log('✅ Sync test result:', JSON.stringify(result, null, 2))
    } else {
      const errorText = await syncResponse.text()
      console.log('❌ Sync test failed:', errorText)
    }
  } catch (error) {
    console.log('❌ Sync test error:', error.message)
  }
}

updateConfig()
