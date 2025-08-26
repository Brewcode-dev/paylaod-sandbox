// Decode JWT token to check expiration
const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTQ0ODI0ODUsInVzZXJuYW1lIjoiICIsImxvZ2luIjoiYWRtaW5AZXVyb2tsaW5pa2EucGwiLCJ1c2VyaWQiOiIyMTM1MSIsInJvbGVzIjpbIkNvbnRyYWN0b3IiXSwiaXNzIjoiR2Fib3NBUEkiLCJhdWQiOiJhY2Nlc3MifQ.7-Gwv9iFhCcUHKjUMjBZBB6lYxVD_yNCI-4UV3ddKU8'

function decodeJWT(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format')
    }

    const payload = parts[1]
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())

    return decoded
  } catch (error) {
    console.error('Error decoding JWT:', error.message)
    return null
  }
}

const decoded = decodeJWT(token)
if (decoded) {
  console.log('JWT Token Payload:')
  console.log(JSON.stringify(decoded, null, 2))

  if (decoded.exp) {
    const expirationDate = new Date(decoded.exp * 1000)
    const now = new Date()
    const isExpired = now > expirationDate

    console.log('\nToken Expiration:')
    console.log('Expiration timestamp:', decoded.exp)
    console.log('Expiration date:', expirationDate.toISOString())
    console.log('Current date:', now.toISOString())
    console.log('Is expired:', isExpired)

    if (isExpired) {
      console.log('❌ Token has expired!')
      console.log('You need to get a new token from the API.')
    } else {
      console.log('✅ Token is still valid')
    }
  }

  if (decoded.userid) {
    console.log('\nUser ID:', decoded.userid)
  }

  if (decoded.roles) {
    console.log('User roles:', decoded.roles)
  }
}
