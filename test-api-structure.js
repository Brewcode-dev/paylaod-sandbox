import fetch from 'node-fetch'

async function testApiStructure() {
  const apiUrl = 'https://ep4.gabos.pl'
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTQ0ODQ4NDQsInVzZXJuYW1lIjoiICIsImxvZ2luIjoiYWRtaW5AZXVyb2tsaW5pa2EucGwiLCJ1c2VyaWQiOiIyMTM1MSIsInJvbGVzIjpbIkNvbnRyYWN0b3IiXSwiaXNzIjoiR2Fib3NBUEkiLCJhdWQiOiJhY2Nlc3MifQ.c6BrEdDbQjUPBjtOf91CRxM-lbeM-D5UBcsvt4Q1oY4'

  console.log('🧪 Testing API response structure...')

  // Test the exact endpoint that the sync service uses
  const endpoint = 'api/v1/Bookings/GetBookingsByContractor'
  const url = `${apiUrl}/${endpoint}`

  console.log('URL:', url)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Response status:', response.status)

    if (response.ok) {
      const data = await response.json()

      console.log('✅ API Response structure:')
      console.log('- Type:', typeof data)
      console.log('- Is Array:', Array.isArray(data))
      console.log('- Has results property:', data && typeof data === 'object' && 'results' in data)

      if (data && typeof data === 'object' && 'results' in data) {
        console.log('- Results type:', typeof data.results)
        console.log('- Results is array:', Array.isArray(data.results))
        console.log('- Results length:', data.results?.length || 0)

        if (Array.isArray(data.results) && data.results.length > 0) {
          console.log('- First booking structure:', Object.keys(data.results[0]))
          console.log('- First booking ID:', data.results[0].id)
          console.log('- First booking patient:', data.results[0].patient)
        }
      }

      console.log('\n📋 Full response structure:')
      console.log(JSON.stringify(data, null, 2))

      // Test the logic that the sync service uses
      console.log('\n🧪 Testing sync service logic:')

      let bookings = []

      if (Array.isArray(data)) {
        bookings = data
        console.log('✅ Direct array response')
      } else if (data && typeof data === 'object' && 'results' in data) {
        bookings = Array.isArray(data.results) ? data.results : []
        console.log('✅ Results property response')
      } else {
        console.log('❌ Unknown structure')
      }

      console.log('- Final bookings array length:', bookings.length)
      console.log('- Is iterable:', bookings && typeof bookings[Symbol.iterator] === 'function')
    } else {
      const errorText = await response.text()
      console.log('❌ API failed:', errorText)
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message)
  }
}

testApiStructure()
