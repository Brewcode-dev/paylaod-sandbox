# Przykłady użycia API Sync Plugin

## 🔧 Podstawowa konfiguracja

```typescript
// payload.config.ts
import { apiSyncPlugin } from './plugins/api-sync'

export default buildConfig({
  plugins: [
    apiSyncPlugin({
      apiUrl: 'https://api.example.com',
      endpoint: 'api/v1/Bookings/GetBookingsByContractor',
      collectionName: 'bookings',
      jwtToken: process.env.API_JWT_TOKEN,
    }),
  ],
})
```

## 🔐 Aktualizacja JWT Tokena

```bash
# Aktualizacja tokena przez API
curl -X POST http://localhost:3000/api/next/api-sync/update-token \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-payload-token" \
  -d '{"token": "your-jwt-token-here"}'
```

```javascript
// Aktualizacja tokena przez JavaScript
const response = await fetch('/api/next/api-sync/update-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer your-payload-token',
  },
  body: JSON.stringify({
    token: 'your-jwt-token-here',
  }),
})

const result = await response.json()
console.log(result)
```

## 🔄 Synchronizacja danych

### Synchronizacja wszystkich rezerwacji

```bash
curl -X POST http://localhost:3000/api/next/api-sync/sync \
  -H "Authorization: Bearer your-payload-token"
```

```javascript
// Synchronizacja przez JavaScript
const response = await fetch('/api/next/api-sync/sync', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer your-payload-token',
  },
})

const result = await response.json()
console.log('Synchronizacja zakończona:', result)
```

### Synchronizacja dla konkretnego kontrahenta

```bash
curl -X POST http://localhost:3000/api/next/api-sync/sync-contractor/12345 \
  -H "Authorization: Bearer your-payload-token"
```

```javascript
// Synchronizacja dla kontrahenta przez JavaScript
const contractorId = '12345'
const response = await fetch(`/api/next/api-sync/sync-contractor/${contractorId}`, {
  method: 'POST',
  headers: {
    Authorization: 'Bearer your-payload-token',
  },
})

const result = await response.json()
console.log('Synchronizacja kontrahenta:', result)
```

## 📊 Sprawdzenie statusu

```bash
curl -X GET http://localhost:3000/api/next/api-sync/status \
  -H "Authorization: Bearer your-payload-token"
```

```javascript
// Sprawdzenie statusu przez JavaScript
const response = await fetch('/api/next/api-sync/status', {
  headers: {
    Authorization: 'Bearer your-payload-token',
  },
})

const status = await response.json()
console.log('Status synchronizacji:', status)
```

## 🛠️ Zaawansowana konfiguracja

### Z mapowaniem pól

```typescript
apiSyncPlugin({
  apiUrl: 'https://api.example.com',
  endpoint: 'api/v1/Bookings/GetBookingsByContractor',
  collectionName: 'bookings',
  fieldMapping: {
    id: 'externalId',
    contractor_id: 'contractorId',
    booking_date: 'bookingDate',
    booking_status: 'status',
    customer_name: 'customerName',
    total_amount: 'totalAmount',
  },
})
```

### Z transformacją danych

```typescript
apiSyncPlugin({
  apiUrl: 'https://api.example.com',
  endpoint: 'api/v1/Bookings/GetBookingsByContractor',
  collectionName: 'bookings',
  transformData: (data) => ({
    externalId: data.id,
    contractorId: data.contractor_id,
    bookingDate: new Date(data.booking_date),
    status: data.booking_status.toLowerCase(),
    customerName: data.customer_name,
    totalAmount: parseFloat(data.total_amount) || 0,
    rawData: data,
  }),
})
```

### Z automatyczną synchronizacją

```typescript
apiSyncPlugin({
  apiUrl: 'https://api.example.com',
  endpoint: 'api/v1/Bookings/GetBookingsByContractor',
  collectionName: 'bookings',
  autoSync: true,
  syncInterval: 300000, // 5 minut
  onError: (error) => {
    console.error('Błąd synchronizacji:', error)
    // Wyślij powiadomienie email/Slack
  },
})
```

## 🔍 Przykłady odpowiedzi API

### Sukces synchronizacji

```json
{
  "success": true,
  "data": {
    "recordsProcessed": 150,
    "recordsCreated": 25,
    "recordsUpdated": 125,
    "errors": [],
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Błąd synchronizacji

```json
{
  "success": false,
  "error": "API request failed: HTTP error! status: 401"
}
```

### Status serwisu

```json
{
  "success": true,
  "data": {
    "initialized": true,
    "serviceAvailable": true
  }
}
```

## 🚨 Obsługa błędów

```typescript
// Przykład obsługi błędów w aplikacji
try {
  const response = await fetch('/api/next/api-sync/sync', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer your-payload-token',
    },
  })

  const result = await response.json()

  if (result.success) {
    console.log('Synchronizacja udana:', result.data)
  } else {
    console.error('Błąd synchronizacji:', result.error)
  }
} catch (error) {
  console.error('Błąd sieci:', error)
}
```

## 🔄 Cron job dla automatycznej synchronizacji

```bash
# Dodaj do crontab (Linux/Mac)
# Synchronizacja co godzinę
0 * * * * curl -X POST http://localhost:3000/api/next/api-sync/sync \
  -H "Authorization: Bearer your-payload-token"
```

```javascript
// Przykład cron job w Node.js
const cron = require('node-cron')

// Synchronizacja co godzinę
cron.schedule('0 * * * *', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/next/api-sync/sync', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer your-payload-token',
      },
    })

    const result = await response.json()
    console.log('Automatyczna synchronizacja:', result)
  } catch (error) {
    console.error('Błąd automatycznej synchronizacji:', error)
  }
})
```

## 📝 Zmienne środowiskowe

```env
# .env
API_BASE_URL=https://api.example.com
API_JWT_TOKEN=your-jwt-token-here
PAYLOAD_SECRET=your-payload-secret
DATABASE_URI=your-database-uri
```

## 🔧 Debugowanie

```typescript
// Włącz szczegółowe logi
apiSyncPlugin({
  // ... konfiguracja
  onError: (error) => {
    console.error('Szczegóły błędu:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  },
})
```
