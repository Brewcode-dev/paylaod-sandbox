import fetch from 'node-fetch'

async function testAutoSync() {
  const baseUrl = 'http://localhost:3000'

  console.log('🧪 Testing auto sync functionality...')

  // Test 1: Check if server is running
  try {
    const healthResponse = await fetch(`${baseUrl}/api/next/api-sync/status`)
    console.log('✅ Server is running')
  } catch (error) {
    console.log('❌ Server not running')
    console.log('Please start the server with: npm run dev')
    return
  }

  // Test 2: Check current API Sync Config
  try {
    console.log('\n📋 Checking current API Sync Config...')
    const configResponse = await fetch(`${baseUrl}/api/globals/api-sync-config`)

    if (configResponse.ok) {
      const config = await configResponse.json()
      console.log('✅ Current config:')
      console.log('- API URL:', config.apiUrl)
      console.log('- Endpoint:', config.endpoint)
      console.log('- Auto Sync:', config.autoSync)
      console.log('- Sync Interval:', config.syncInterval, 'ms')
      console.log('- Has JWT Token:', !!config.jwtToken)
      console.log('- Last Sync:', config.lastSync)
      console.log('- Last Sync Status:', config.lastSyncStatus)

      if (config.autoSync) {
        console.log('✅ Auto sync is ENABLED')
        console.log(`⏰ Will sync every ${config.syncInterval / 1000} seconds`)
      } else {
        console.log('❌ Auto sync is DISABLED')
      }
    } else {
      console.log('❌ Could not fetch API Sync Config')
    }
  } catch (error) {
    console.log('❌ Config check failed:', error.message)
  }

  // Test 3: Update config to enable auto sync
  try {
    console.log('\n🔧 Updating config to enable auto sync...')
    const updateResponse = await fetch(`${baseUrl}/api/globals/api-sync-config`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: 'https://ep4.gabos.pl',
        endpoint: 'api/v1/Bookings/GetBookingsByContractor',
        jwtToken:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTQ0ODgyNDQsInVzZXJuYW1lIjoiICIsImxvZ2luIjoiYWRtaW5AZXVyb2tsaW5pa2EucGwiLCJ1c2VyaWQiOiIyMTM1MSIsInJvbGVzIjpbIkNvbnRyYWN0b3IiXSwiaXNzIjoiR2Fib3NBUEkiLCJhdWQiOiJhY2Nlc3MifQ.kAvr3lfUD9kIOfwDquqI2Xi_s5WK4ny7aPslmFiT5UQ',
        autoSync: true,
        syncInterval: 60000, // 1 minute for testing
        retryAttempts: 3,
        retryDelay: 1000,
      }),
    })

    if (updateResponse.ok) {
      console.log('✅ Config updated successfully')
    } else {
      const errorText = await updateResponse.text()
      console.log('❌ Failed to update config:', errorText)
    }
  } catch (error) {
    console.log('❌ Config update failed:', error.message)
  }

  // Test 4: Check if auto sync is now enabled
  try {
    console.log('\n📋 Checking updated config...')
    const configResponse = await fetch(`${baseUrl}/api/globals/api-sync-config`)

    if (configResponse.ok) {
      const config = await configResponse.json()
      console.log('✅ Updated config:')
      console.log('- Auto Sync:', config.autoSync)
      console.log('- Sync Interval:', config.syncInterval, 'ms')

      if (config.autoSync) {
        console.log('✅ Auto sync is now ENABLED')
        console.log(`⏰ Will sync every ${config.syncInterval / 1000} seconds`)
        console.log('🔄 Auto sync should start automatically...')
      } else {
        console.log('❌ Auto sync is still DISABLED')
      }
    } else {
      console.log('❌ Could not fetch updated config')
    }
  } catch (error) {
    console.log('❌ Updated config check failed:', error.message)
  }

  // Test 5: Wait and check if sync happened
  console.log('\n⏳ Waiting 70 seconds to see if auto sync triggers...')
  console.log('(Auto sync interval is set to 60 seconds)')

  for (let i = 0; i < 7; i++) {
    await new Promise((resolve) => setTimeout(resolve, 10000)) // Wait 10 seconds
    console.log(`⏰ ${(i + 1) * 10} seconds passed...`)

    // Check last sync time
    try {
      const configResponse = await fetch(`${baseUrl}/api/globals/api-sync-config`)
      if (configResponse.ok) {
        const config = await configResponse.json()
        if (config.lastSync) {
          const lastSync = new Date(config.lastSync)
          const now = new Date()
          const diffSeconds = Math.floor((now - lastSync) / 1000)
          console.log(`📅 Last sync: ${diffSeconds} seconds ago`)
          console.log(`📊 Status: ${config.lastSyncStatus}`)
          if (config.lastSyncError) {
            console.log(`❌ Error: ${config.lastSyncError}`)
          }
        }
      }
    } catch (error) {
      console.log('❌ Could not check sync status')
    }
  }

  console.log('\n✅ Auto sync test completed')
  console.log('💡 Check the server console for auto sync logs')
}

testAutoSync()
