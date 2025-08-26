import fetch from 'node-fetch'

async function testBothEndpoints() {
  const baseUrl = 'http://localhost:3000'

  console.log('🧪 Testing both sync endpoints...')

  // Test 1: Check if server is running
  try {
    const healthResponse = await fetch(`${baseUrl}/api/next/api-sync/status`)
    console.log('✅ Server is running')
  } catch (error) {
    console.log('❌ Server not running')
    console.log('Please start the server with: npm run dev')
    return
  }

  // Test 2: Test /api/next/api-sync/sync endpoint
  try {
    console.log('\n🔄 Testing /api/next/api-sync/sync endpoint...')
    const syncResponse = await fetch(`${baseUrl}/api/next/api-sync/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Sync response status:', syncResponse.status)

    if (syncResponse.ok) {
      const result = await syncResponse.json()
      console.log('✅ Sync response:', JSON.stringify(result, null, 2))
    } else {
      const errorText = await syncResponse.text()
      console.log('❌ Sync failed:', errorText)
    }
  } catch (error) {
    console.log('❌ Sync request failed:', error.message)
  }

  // Test 3: Test /sync/bookings endpoint
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
      console.log('✅ Sync response:', JSON.stringify(result, null, 2))
    } else {
      const errorText = await syncResponse.text()
      console.log('❌ Sync failed:', errorText)
    }
  } catch (error) {
    console.log('❌ Sync request failed:', error.message)
  }

  // Test 4: Test direct API call to external API
  try {
    console.log('\n🌐 Testing direct external API call...')
    const externalResponse = await fetch(
      'https://ep4.gabos.pl/api/v1/Bookings/GetBookingsByContractor',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTQ0ODQ4NDQsInVzZXJuYW1lIjoiICIsImxvZ2luIjoiYWRtaW5AZXVyb2tsaW5pa2EucGwiLCJ1c2VyaWQiOiIyMTM1MSIsInJvbGVzIjpbIkNvbnRyYWN0b3IiXSwiaXNzIjoiR2Fib3NBUEkiLCJhdWQiOiJhY2Nlc3MifQ.c6BrEdDbQjUPBjtOf91CRxM-lbeM-D5UBcsvt4Q1oY4`,
          'Content-Type': 'application/json',
        },
      },
    )

    console.log('External API response status:', externalResponse.status)

    if (externalResponse.ok) {
      const data = await externalResponse.json()
      console.log('✅ External API working, found', data.results?.length || 0, 'bookings')
    } else {
      const errorText = await externalResponse.text()
      console.log('❌ External API failed:', errorText)
    }
  } catch (error) {
    console.log('❌ External API request failed:', error.message)
  }
}

testBothEndpoints()
