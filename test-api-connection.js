import fetch from 'node-fetch'

async function testApiConnection() {
  const apiUrl = 'https://ep4.gabos.pl'
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTQ0ODQ4NDQsInVzZXJuYW1lIjoiICIsImxvZ2luIjoiYWRtaW5AZXVyb2tsaW5pa2EucGwiLCJ1c2VyaWQiOiIyMTM1MSIsInJvbGVzIjpbIkNvbnRyYWN0b3IiXSwiaXNzIjoiR2Fib3NBUEkiLCJhdWQiOiJhY2Nlc3MifQ.c6BrEdDbQjUPBjtOf91CRxM-lbeM-D5UBcsvt4Q1oY4'

  console.log('Testing Patients API endpoint with new token...')
  console.log('Token:', token.substring(0, 50) + '...')

  // Test Patients endpoint
  const patientsUrl = `${apiUrl}/api/v1/Patients`
  console.log('\n--- Testing Patients endpoint ---')
  console.log('URL:', patientsUrl)

  try {
    const response = await fetch(patientsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Response status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Patients API connection successful!')
      console.log('Response data:', JSON.stringify(data, null, 2))

      // Show summary if there are many patients
      if (data.results && Array.isArray(data.results)) {
        console.log(`\n📊 Found ${data.results.length} patients`)
        if (data.results.length > 0) {
          console.log('First few patients:')
          data.results.slice(0, 50).forEach((patient, index) => {
            console.log(
              `${index + 1}. ID: ${patient.id}, Name: ${patient.firstname || patient.firstName} ${patient.lastname || patient.lastName}`,
            )
          })
        }
      }
    } else {
      const errorText = await response.text()
      console.log('❌ Patients API connection failed!')
      console.log('Error response:', errorText)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }

  // Also test the Bookings endpoint for comparison
  console.log('\n--- Testing Bookings endpoint (for comparison) ---')
  const bookingsUrl = `${apiUrl}/api/v1/Bookings/GetBookingsByContractor`
  console.log('URL:', bookingsUrl)

  try {
    const response = await fetch(bookingsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Response status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Bookings API connection successful!')
      console.log(`📊 Found ${data.results ? data.results.length : 0} bookings`)
    } else {
      const errorText = await response.text()
      console.log('❌ Bookings API connection failed!')
      console.log('Error response:', errorText)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }
}

testApiConnection()
