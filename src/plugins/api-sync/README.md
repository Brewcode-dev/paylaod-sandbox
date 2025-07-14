# API Sync Plugin dla Payload CMS

Plugin do synchronizacji danych z zewnętrznego JSON API z obsługą JWT Bearer token.

## 🚀 Funkcjonalności

- **Synchronizacja rezerwacji** z zewnętrznego API
- **Obsługa JWT Bearer token** dla autoryzacji
- **Automatyczna synchronizacja** z konfigurowalnym interwałem
- **Mapowanie pól** między API a kolekcją Payload
- **Transformacja danych** z możliwością customizacji
- **Obsługa błędów** i retry logic
- **API endpoints** do ręcznej synchronizacji

## 📋 Wymagania

- Payload CMS 3.x
- Node.js 18+
- Kolekcja `bookings` w Payload

## 🔧 Instalacja

1. **Dodaj plugin do konfiguracji Payload:**

```typescript
// payload.config.ts
import { apiSyncPlugin } from './plugins/api-sync'

export default buildConfig({
  // ... inne konfiguracje
  plugins: [
    // ... inne pluginy
    apiSyncPlugin({
      apiUrl: process.env.API_BASE_URL || 'https://api.example.com',
      endpoint: 'api/v1/Bookings/GetBookingsByContractor',
      collectionName: 'bookings',
      autoSync: false,
      syncInterval: 300000, // 5 minut
      retryAttempts: 3,
      retryDelay: 1000,
      onError: (error: Error) => {
        console.error('API Sync Error:', error)
      },
    }),
  ],
})
```

2. **Dodaj kolekcję Bookings:**

```typescript
// collections/Bookings.ts
import { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  // ... konfiguracja kolekcji
}
```

3. **Dodaj kolekcję do konfiguracji:**

```typescript
// payload.config.ts
import { Bookings } from './collections/Bookings'

export default buildConfig({
  collections: [Pages, Posts, Media, Categories, Users, Bookings],
  // ...
})
```

## ⚙️ Konfiguracja

### Parametry pluginu:

- **`apiUrl`** (string, wymagane): URL bazowy API
- **`endpoint`** (string, wymagane): Endpoint API (np. `api/v1/Bookings/GetBookingsByContractor`)
- **`collectionName`** (string, wymagane): Nazwa kolekcji w Payload
- **`jwtToken`** (string, opcjonalne): JWT Bearer token
- **`headers`** (object, opcjonalne): Dodatkowe nagłówki HTTP
- **`autoSync`** (boolean, opcjonalne): Włącz automatyczną synchronizację
- **`syncInterval`** (number, opcjonalne): Interwał synchronizacji w ms
- **`fieldMapping`** (object, opcjonalne): Mapowanie pól API → Payload
- **`transformData`** (function, opcjonalne): Funkcja transformacji danych
- **`onError`** (function, opcjonalne): Callback dla błędów
- **`retryAttempts`** (number, opcjonalne): Liczba prób retry
- **`retryDelay`** (number, opcjonalne): Opóźnienie między próbami w ms

### Przykład konfiguracji:

```typescript
apiSyncPlugin({
  apiUrl: 'https://api.example.com',
  endpoint: 'api/v1/Bookings/GetBookingsByContractor',
  collectionName: 'bookings',
  jwtToken: process.env.API_JWT_TOKEN,
  autoSync: true,
  syncInterval: 300000, // 5 minut
  fieldMapping: {
    id: 'externalId',
    contractor_id: 'contractorId',
    booking_date: 'bookingDate',
    booking_status: 'status',
  },
  transformData: (data) => ({
    ...data,
    bookingDate: new Date(data.booking_date),
    status: data.booking_status.toLowerCase(),
  }),
  onError: (error) => {
    console.error('Sync error:', error)
    // Wyślij powiadomienie email/Slack
  },
})
```

## 🔌 API Endpoints

Plugin udostępnia następujące endpointy:

### 1. Synchronizacja wszystkich rezerwacji

```
POST /api/next/api-sync/sync
```

### 2. Synchronizacja rezerwacji dla konkretnego kontrahenta

```
POST /api/next/api-sync/sync-contractor/{contractorId}
```

### 3. Aktualizacja JWT tokena

```
POST /api/next/api-sync/update-token
Content-Type: application/json

{
  "token": "your-jwt-token-here"
}
```

### 4. Sprawdzenie statusu synchronizacji

```
GET /api/next/api-sync/status
```

## 📊 Struktura danych

### Kolekcja Bookings:

```typescript
{
  externalId: string,      // ID z zewnętrznego API
  contractorId: string,    // ID kontrahenta
  bookingDate: Date,       // Data rezerwacji
  status: string,          // Status rezerwacji
  lastSynced: Date,        // Ostatnia synchronizacja
  rawData: object,         // Surowe dane z API
}
```

### Odpowiedź API:

```typescript
{
  success: boolean,
  data: {
    recordsProcessed: number,
    recordsCreated: number,
    recordsUpdated: number,
    errors: string[],
    timestamp: Date,
  }
}
```

## 🔐 Autoryzacja

Wszystkie endpointy wymagają autoryzacji użytkownika Payload. Dodaj odpowiednie nagłówki:

```bash
curl -X POST /api/next/api-sync/sync \
  -H "Authorization: Bearer your-payload-token" \
  -H "Content-Type: application/json"
```

## 🚨 Obsługa błędów

Plugin automatycznie obsługuje:

- Błędy sieciowe
- Błędy autoryzacji API
- Błędy parsowania danych
- Błędy zapisu do bazy danych

Błędy są logowane i można je obsłużyć przez callback `onError`.

## 🔄 Automatyczna synchronizacja

Jeśli `autoSync` jest włączone, plugin będzie automatycznie synchronizować dane co `syncInterval` milisekund.

```typescript
apiSyncPlugin({
  // ...
  autoSync: true,
  syncInterval: 300000, // 5 minut
})
```

## 🛠️ Rozszerzanie

### Custom transformacja danych:

```typescript
transformData: (data) => {
  return {
    ...data,
    bookingDate: new Date(data.booking_date),
    status: data.booking_status.toLowerCase(),
    // Dodaj custom logikę
  }
}
```

### Custom mapowanie pól:

```typescript
fieldMapping: {
  'api_field_name': 'payload_field_name',
  'contractor_id': 'contractorId',
  'booking_date': 'bookingDate',
}
```

## 📝 Zmienne środowiskowe

Dodaj do `.env`:

```env
API_BASE_URL=https://api.example.com
API_JWT_TOKEN=your-jwt-token-here
```

## 🔍 Debugowanie

Włącz logi debugowania:

```typescript
onError: (error: Error) => {
  console.error('API Sync Error:', error)
  // Dodaj własną logikę debugowania
}
```

## 📞 Wsparcie

W przypadku problemów:

1. Sprawdź logi serwera
2. Sprawdź status endpoint `/api/next/api-sync/status`
3. Sprawdź konfigurację API i JWT token
4. Sprawdź strukturę danych w kolekcji Bookings
