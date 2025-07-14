# Instrukcje inicjalizacji API Sync Plugin

## 🚀 Krok po kroku

### 1. Sprawdź strukturę plików

Upewnij się, że masz następującą strukturę:

```
src/
├── plugins/
│   └── api-sync/
│       ├── index.ts
│       ├── plugin.ts
│       ├── types.ts
│       ├── api-client.ts
│       ├── sync-service.ts
│       ├── example.ts
│       ├── README.md
│       ├── usage-examples.md
│       └── INITIALIZATION.md
├── collections/
│   └── Bookings.ts
├── app/(frontend)/next/api-sync/
│   ├── sync/
│   │   └── route.ts
│   ├── sync-contractor/[contractorId]/
│   │   └── route.ts
│   ├── update-token/
│   │   └── route.ts
│   └── status/
│       └── route.ts
└── payload.config.ts
```

### 2. Dodaj zmienne środowiskowe

Utwórz lub zaktualizuj plik `.env`:

```env
# API Configuration
API_BASE_URL=https://api.example.com
API_JWT_TOKEN=your-jwt-token-here

# Payload Configuration
PAYLOAD_SECRET=your-payload-secret
DATABASE_URI=your-database-uri
```

### 3. Sprawdź konfigurację Payload

Upewnij się, że w `payload.config.ts` masz:

```typescript
import { Bookings } from './collections/Bookings'
import { apiSyncPlugin } from './plugins/api-sync'

export default buildConfig({
  collections: [Pages, Posts, Media, Categories, Users, Bookings],
  plugins: [
    // ... inne pluginy
    apiSyncPlugin({
      apiUrl: process.env.API_BASE_URL || 'https://api.example.com',
      endpoint: 'api/v1/Bookings/GetBookingsByContractor',
      collectionName: 'bookings',
      autoSync: false, // Wyłącz na początku
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

### 4. Uruchom aplikację

```bash
# Zainstaluj zależności (jeśli potrzebne)
npm install

# Uruchom serwer deweloperski
npm run dev
```

### 5. Sprawdź status pluginu

```bash
# Sprawdź status (wymaga autoryzacji)
curl -X GET http://localhost:3000/api/next/api-sync/status \
  -H "Authorization: Bearer your-payload-token"
```

### 6. Zaktualizuj JWT token

```bash
# Zaktualizuj token (podaj swój JWT token)
curl -X POST http://localhost:3000/api/next/api-sync/update-token \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-payload-token" \
  -d '{"token": "your-actual-jwt-token-here"}'
```

### 7. Przetestuj synchronizację

```bash
# Synchronizacja wszystkich rezerwacji
curl -X POST http://localhost:3000/api/next/api-sync/sync \
  -H "Authorization: Bearer your-payload-token"

# Synchronizacja dla konkretnego kontrahenta
curl -X POST http://localhost:3000/api/next/api-sync/sync-contractor/12345 \
  -H "Authorization: Bearer your-payload-token"
```

## 🔧 Konfiguracja zaawansowana

### Włącz automatyczną synchronizację

```typescript
apiSyncPlugin({
  // ... podstawowa konfiguracja
  autoSync: true,
  syncInterval: 300000, // 5 minut
})
```

### Dodaj mapowanie pól

```typescript
apiSyncPlugin({
  // ... podstawowa konfiguracja
  fieldMapping: {
    id: 'externalId',
    contractor_id: 'contractorId',
    booking_date: 'bookingDate',
    booking_status: 'status',
  },
})
```

### Dodaj transformację danych

```typescript
apiSyncPlugin({
  // ... podstawowa konfiguracja
  transformData: (data) => ({
    externalId: data.id,
    contractorId: data.contractor_id,
    bookingDate: new Date(data.booking_date),
    status: data.booking_status.toLowerCase(),
    rawData: data,
  }),
})
```

## 🚨 Rozwiązywanie problemów

### Problem: "Sync service not initialized"

**Rozwiązanie:** Sprawdź czy plugin jest poprawnie załadowany w `payload.config.ts`

### Problem: "Action forbidden" (403)

**Rozwiązanie:** Upewnij się, że używasz poprawnego tokena autoryzacji Payload

### Problem: "API request failed" (401)

**Rozwiązanie:** Sprawdź czy JWT token jest poprawny i aktualny

### Problem: "Collection not found"

**Rozwiązanie:** Upewnij się, że kolekcja `Bookings` jest dodana do konfiguracji

### Problem: Błędy TypeScript

**Rozwiązanie:** Sprawdź czy wszystkie importy są poprawne

## 📊 Monitoring

### Sprawdź logi

```bash
# Sprawdź logi aplikacji
npm run dev 2>&1 | grep "API Sync"
```

### Sprawdź bazę danych

```sql
-- Sprawdź czy dane są synchronizowane
SELECT * FROM bookings ORDER BY lastSynced DESC LIMIT 10;
```

### Sprawdź status API

```bash
# Sprawdź status pluginu
curl -X GET http://localhost:3000/api/next/api-sync/status \
  -H "Authorization: Bearer your-payload-token"
```

## 🔄 Następne kroki

1. **Przetestuj synchronizację** z rzeczywistym API
2. **Dostosuj mapowanie pól** do struktury Twojego API
3. **Włącz automatyczną synchronizację** jeśli potrzebna
4. **Skonfiguruj monitoring** i powiadomienia o błędach
5. **Dodaj testy** dla swojego przypadku użycia

## 📞 Wsparcie

W przypadku problemów:

1. Sprawdź logi aplikacji
2. Sprawdź status endpoint `/api/next/api-sync/status`
3. Sprawdź konfigurację API i JWT token
4. Sprawdź strukturę danych w kolekcji Bookings
5. Sprawdź czy wszystkie pliki są poprawnie utworzone
