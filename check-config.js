import fetch from 'node-fetch'

async function checkAndSetConfig() {
  const baseUrl = 'http://localhost:3000'
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTQ0ODQ4NDQsInVzZXJuYW1lIjoiICIsImxvZ2luIjoiYWRtaW5AZXVyb2tsaW5pa2EucGwiLCJ1c2VyaWQiOiIyMTM1MSIsInJvbGVzIjpbIkNvbnRyYWN0b3IiXSwiaXNzIjoiR2Fib3NBUEkiLCJhdWQiOiJhY2Nlc3MifQ.c6BrEdDbQjUPBjtOf91CRxM-lbeM-D5UBcsvt4Q1oY4'

  console.log('🔍 Checking API Sync configuration...')

  // Check current config
  try {
    console.log('\n📋 Checking current config...')
    const statusResponse = await fetch(`${baseUrl}/api/next/api-sync/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (statusResponse.ok) {
      const status = await statusResponse.json()
      console.log('✅ Status response:', JSON.stringify(status, null, 2))

      if (status.data?.adminConfig) {
        console.log('📊 Current admin config:')
        console.log('- API URL:', status.data.adminConfig.apiUrl)
        console.log('- Endpoint:', status.data.adminConfig.endpoint)
        console.log('- Has Token:', !!status.data.adminConfig.jwtToken)
        console.log('- Auto Sync:', status.data.adminConfig.autoSync)
      } else {
        console.log('❌ No admin config found')
      }
    } else {
      console.log('❌ Status check failed:', statusResponse.status)
    }
  } catch (error) {
    console.log('❌ Status check error:', error.message)
  }

  // Update config with correct values
  try {
    console.log('\n🔧 Updating config with correct values...')
    const updateResponse = await fetch(`${baseUrl}/api/next/api-sync/update-config`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: 'https://ep4.gabos.pl',
        endpoint: 'api/v1/Bookings/GetBookingsByContractor',
        jwtToken:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTQ0ODQ4NDQsInVzZXJuYW1lIjoiICIsImxvZ2luIjoiYWRtaW5AZXVyb2tsaW5pa2EucGwiLCJ1c2VyaWQiOiIyMTM1MSIsInJvbGVzIjpbIkNvbnRyYWN0b3IiXSwiaXNzIjoiR2Fib3NBUEkiLCJhdWQiOiJhY2Nlc3MifQ.c6BrEdDbQjUPBjtOf91CRxM-lbeM-D5UBcsvt4Q1oY4',
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
        Authorization: `Bearer ${token}`,
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

checkAndSetConfig()
