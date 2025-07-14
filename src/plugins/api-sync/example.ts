// Przykład konfiguracji pluginu API Sync
import { apiSyncPlugin } from './plugin'

// Konfiguracja pluginu
export const apiSyncConfig = {
  apiUrl: process.env.API_BASE_URL || 'https://api.example.com',
  endpoint: 'api/v1/Bookings/GetBookingsByContractor',
  collectionName: 'bookings',
  jwtToken: process.env.API_JWT_TOKEN, // JWT token do podania później
  autoSync: false, // Wyłącz auto-sync na początku
  syncInterval: 300000, // 5 minut
  retryAttempts: 3,
  retryDelay: 1000,
  
  // Mapowanie pól z API do Payload
  fieldMapping: {
    'id': 'externalId',
    'contractor_id': 'contractorId',
    'booking_date': 'bookingDate',
    'booking_status': 'status',
    'customer_name': 'customerName',
    'total_amount': 'totalAmount',
  },
  
  // Transformacja danych
  transformData: (data: any) => ({
    externalId: data.id,
    contractorId: data.contractor_id,
    bookingDate: new Date(data.booking_date),
    status: data.booking_status.toLowerCase(),
    customerName: data.customer_name,
    totalAmount: parseFloat(data.total_amount) || 0,
    rawData: data, // Zachowaj surowe dane
  }),
  
  // Obsługa błędów
  onError: (error: Error) => {
    console.error('API Sync Error:', error)
    // Tutaj możesz dodać powiadomienia email/Slack
  },
}

// Eksport pluginu z konfiguracją
export const configuredApiSyncPlugin = apiSyncPlugin(apiSyncConfig)

// Przykład użycia w payload.config.ts:
/*
import { configuredApiSyncPlugin } from './plugins/api-sync/example'

export default buildConfig({
  // ...
  plugins: [
    // ... inne pluginy
    configuredApiSyncPlugin,
  ],
})
*/

// Przykład aktualizacji JWT tokena:
/*
// POST /api/next/api-sync/update-token
{
  "token": "your-jwt-token-here"
}
*/

// Przykład synchronizacji:
/*
// Synchronizacja wszystkich rezerwacji
POST /api/next/api-sync/sync

// Synchronizacja dla konkretnego kontrahenta
POST /api/next/api-sync/sync-contractor/12345

// Sprawdzenie statusu
GET /api/next/api-sync/status
*/ 