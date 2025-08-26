import fetch from 'node-fetch'

async function testSyncSimple() {
  const baseUrl = 'http://localhost:3000'

  console.log('🧪 Testing sync endpoint without authentication...')

  // Test 1: Check if server is running
  try {
    const healthResponse = await fetch(`${baseUrl}/api/next/api-sync/status`)
    console.log('✅ Server is running')
  } catch (error) {
    console.log('❌ Server not running')
    console.log('Please start the server with: npm run dev')
    return
  }

  // Test 2: Test sync endpoint without auth
  try {
    console.log('\n🔄 Testing sync endpoint without auth...')
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

  // Test 3: Test with basic auth header
  try {
    console.log('\n🔐 Testing sync endpoint with basic auth...')
    const syncResponse = await fetch(`${baseUrl}/api/next/api-sync/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic YWRtaW46YWRtaW4=', // admin:admin
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
}

testSyncSimple()
