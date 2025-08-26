import fetch from 'node-fetch'

async function testFullName() {
  const baseUrl = 'http://localhost:3000'

  console.log('🧪 Testing fullName field extraction...')

  // Test 1: Check if server is running
  try {
    const healthResponse = await fetch(`${baseUrl}/api/next/api-sync/status`)
    console.log('✅ Server is running')
  } catch (error) {
    console.log('❌ Server not running')
    console.log('Please start the server with: npm run dev')
    return
  }

  // Test 2: Run sync to create/update bookings with fullName
  try {
    console.log('\n🔄 Running sync to test fullName field...')
    const syncResponse = await fetch(`${baseUrl}/api/next/api-sync/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Sync response status:', syncResponse.status)

    if (syncResponse.ok) {
      const result = await syncResponse.json()
      console.log('✅ Sync completed')
      console.log('- Success:', result.success)
      console.log('- Records processed:', result.data.recordsProcessed)
      console.log('- Records created:', result.data.recordsCreated)
      console.log('- Records updated:', result.data.recordsUpdated)

      if (result.data.errors && result.data.errors.length > 0) {
        console.log('- Errors:', result.data.errors)
      }
    } else {
      const errorText = await syncResponse.text()
      console.log('❌ Sync failed:', errorText)
      return
    }
  } catch (error) {
    console.log('❌ Sync request failed:', error.message)
    return
  }

  // Test 3: Check bookings in database and verify fullName field
  try {
    console.log('\n📋 Checking bookings with fullName field...')
    const bookingsResponse = await fetch(`${baseUrl}/api/bookings`)

    if (bookingsResponse.ok) {
      const bookings = await bookingsResponse.json()
      console.log('✅ Found', bookings.docs?.length || 0, 'bookings in database')

      if (bookings.docs && bookings.docs.length > 0) {
        console.log('\n📊 Bookings with fullName:')
        bookings.docs.forEach((booking, index) => {
          console.log(`${index + 1}. ID: ${booking.externalId}`)
          console.log(`   - Full Name: "${booking.fullName}"`)
          console.log(`   - Contractor ID: ${booking.contractorId}`)
          console.log(`   - Status: ${booking.status}`)
          console.log(`   - Date: ${booking.bookingDate}`)

          // Show raw patient data for verification
          if (booking.rawData && booking.rawData.patient) {
            const patient = booking.rawData.patient
            console.log(
              `   - Raw patient: ${patient.firstname || patient.firstName} ${patient.lastname || patient.lastName}`,
            )
          }
          console.log('')
        })

        // Check if all bookings have fullName
        const bookingsWithoutName = bookings.docs.filter(
          (b) => !b.fullName || b.fullName === 'Nieznany pacjent',
        )
        if (bookingsWithoutName.length > 0) {
          console.log('⚠️  Bookings without proper fullName:', bookingsWithoutName.length)
        } else {
          console.log('✅ All bookings have proper fullName field')
        }
      } else {
        console.log('❌ No bookings found in database')
      }
    } else {
      console.log('❌ Could not fetch bookings from database')
    }
  } catch (error) {
    console.log('❌ Database check failed:', error.message)
  }
}

testFullName()
