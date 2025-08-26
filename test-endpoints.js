import fetch from 'node-fetch'

async function testEndpoints() {
  const apiUrl = 'https://ep4.gabos.pl'
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTQ0ODgyNDQsInVzZXJuYW1lIjoiICIsImxvZ2luIjoiYWRtaW5AZXVyb2tsaW5pa2EucGwiLCJ1c2VyaWQiOiIyMTM1MSIsInJvbGVzIjpbIkNvbnRyYWN0b3IiXSwiaXNzIjoiR2Fib3NBUEkiLCJhdWQiOiJhY2Nlc3MifQ.kAvr3lfUD9kIOfwDquqI2Xi_s5WK4ny7aPslmFiT5UQ'

  console.log('🧪 Testing different endpoints with new token...')

  const endpoints = [
    'api/v1/Bookings',
    'api/v1/Bookings/GetBookingsByContractor',
    'api/v1/Bookings/GetAllBookings',
    'api/v1/Bookings/GetBookings',
  ]

  for (const endpoint of endpoints) {
    const url = `${apiUrl}/${endpoint}`
    console.log(`\n--- Testing endpoint: ${endpoint} ---`)
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
        console.log('✅ Success!')
        console.log('- Type:', typeof data)
        console.log('- Is Array:', Array.isArray(data))
        console.log('- Has results:', data && typeof data === 'object' && 'results' in data)

        if (data && typeof data === 'object' && 'results' in data) {
          console.log('- Results length:', data.results?.length || 0)
        }

        // Test if it's iterable
        let bookings = []
        if (Array.isArray(data)) {
          bookings = data
        } else if (data && typeof data === 'object' && 'results' in data) {
          bookings = Array.isArray(data.results) ? data.results : []
        }

        console.log('- Final bookings length:', bookings.length)
        console.log('- Is iterable:', bookings && typeof bookings[Symbol.iterator] === 'function')

        // Show first booking structure if available
        if (bookings.length > 0) {
          console.log('- First booking keys:', Object.keys(bookings[0]))
          console.log('- First booking ID:', bookings[0].id)
        }

        break // Found working endpoint
      } else {
        const errorText = await response.text()
        console.log('❌ Failed:', errorText)
      }
    } catch (error) {
      console.log('❌ Error:', error.message)
    }
  }
}

testEndpoints()
