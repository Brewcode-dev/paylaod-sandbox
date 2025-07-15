# API Sync Plugin dla Payload CMS

Plugin do synchronizacji danych z zewnętrznego JSON API z obsługą JWT Bearer token i **dynamiczną konfiguracją z admina**.

## 🚀 Funkcjonalności

- **Synchronizacja rezerwacji** z zewnętrznego API
- **Obsługa JWT Bearer token** dla autoryzacji
- **Automatyczna synchronizacja** z konfigurowalnym interwałem
- **Mapowanie pól** między API a kolekcją Payload
- **Transformacja danych** z możliwością customizacji
- **Obsługa błędów** i retry logic
- **API endpoints** do ręcznej synchronizacji
- **🆕 Dynamiczna konfiguracja z admina** - wszystkie ustawienia można zmieniać przez panel administracyjny

## 📋 Wymagania

- Payload CMS 3.x
- Node.js 18+
- Kolekcja `bookings` w Payload
- Global `api-sync-config` (tworzony automatycznie)

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
      apiUrl: process.env.API_BASE_URL || 'https://api.example.com', // Fallback URL
      endpoint: 'api/v1/Bookings/GetBookingsByContractor', // Fallback endpoint
      collectionName: 'bookings',
      autoSync: false, // Będzie ładowane z admina
      syncInterval: 300000, // Będzie ładowane z admina
      retryAttempts: 3, // Będzie ładowane z admina
      retryDelay: 1000, // Będzie ładowane z admina
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

## ⚙️ Konfiguracja przez Admin

**🆕 Nowość:** Wszystkie ustawienia można teraz konfigurować przez panel administracyjny!

### Dostęp do konfiguracji:

1. **Zaloguj się do admina** (`/admin`)
2. **Przejdź do "API Sync"** w menu bocznym
3. **Skonfiguruj ustawienia:**
   - **API URL** - URL bazowy API
   - **Endpoint** - Endpoint do synchronizacji
   - **JWT Token** - Token autoryzacji
   - **Auto Sync** - Włącz/wyłącz automatyczną synchronizację
   - **Sync Interval** - Interwał synchronizacji (w milisekundach)
   - **Retry Attempts** - Liczba prób retry
   - **Retry Delay** - Opóźnienie między próbami

### Automatyczne ładowanie konfiguracji:

Plugin automatycznie:

- ✅ Ładuje konfigurację z admina przy starcie
- ✅ Aktualizuje konfigurację przed każdą synchronizacją
- ✅ Synchronizuje zmiany z admina z serwisami synchronizacji
- ✅ Zachowuje statystyki synchronizacji w adminie

## 🔌 API Endpoints

Plugin udostępnia następujące endpointy:

### 1. Synchronizacja wszystkich rezerwacji

```
POST /api/next/api-sync/sync
```

**Uwaga:** Endpoint automatycznie ładuje najnowszą konfigurację z admina.

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

**Uwaga:** Token jest aktualizowany zarówno w serwisie synchronizacji jak i w adminie.

### 4. Sprawdzenie statusu synchronizacji

```
GET /api/next/api-sync/status
```

**Zwraca:**

- Status serwisów synchronizacji
- Konfigurację z admina (bez JWT tokena)
- Statystyki synchronizacji

### 5. Aktualizacja konfiguracji

```
POST /api/next/api-sync/update-config
Content-Type: application/json

{
  "apiUrl": "https://api.example.com",
  "endpoint": "api/v1/Bookings/GetBookingsByContractor",
  "jwtToken": "your-jwt-token",
  "autoSync": true,
  "syncInterval": 300000,
  "retryAttempts": 3,
  "retryDelay": 1000
}
```

**Uwaga:** Konfiguracja jest aktualizowana zarówno w adminie jak i w serwisach synchronizacji.

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

### Global ApiSyncConfig:

```typescript
{
  apiUrl: string,          // URL bazowy API
  endpoint: string,        // Endpoint API
  jwtToken: string,        // JWT Bearer token
  autoSync: boolean,       // Automatyczna synchronizacja
  syncInterval: number,    // Interwał synchronizacji
  retryAttempts: number,   // Liczba prób retry
  retryDelay: number,      // Opóźnienie między próbami
  lastSync: Date,          // Ostatnia synchronizacja
  lastSyncStatus: string,  // Status ostatniej synchronizacji
  lastSyncError: string,   // Ostatni błąd synchronizacji
  syncStats: object,       // Statystyki synchronizacji
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
- Błędy ładowania konfiguracji z admina

Błędy są logowane i można je obsłużyć przez callback `onError`.

## 🔄 Automatyczna synchronizacja

Jeśli `autoSync` jest włączone w adminie, plugin będzie automatycznie synchronizować dane co `syncInterval` milisekund.

**Uwaga:** Konfiguracja jest automatycznie ładowana z admina przed każdą synchronizacją.

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

**Uwaga:** Te zmienne są używane tylko jako fallback. Główna konfiguracja pochodzi z admina.

## 🔍 Debugowanie

Włącz logi debugowania:

```bash
# Sprawdź logi aplikacji
npm run dev 2>&1 | grep "API Sync"

# Sprawdź status
curl -X GET http://localhost:3000/api/next/api-sync/status \
  -H "Authorization: Bearer your-payload-token"
```

## 🚀 Szybki start

1. **Uruchom aplikację:**

   ```bash
   npm run dev
   ```

2. **Przejdź do admina:**

   ```
   http://localhost:3000/admin
   ```

3. **Skonfiguruj API Sync:**
   - Przejdź do "API Sync" w menu
   - Wprowadź URL API i endpoint
   - Dodaj JWT token
   - Włącz auto-sync jeśli potrzebne

4. **Przetestuj synchronizację:**
   ```bash
   curl -X POST http://localhost:3000/api/next/api-sync/sync \
     -H "Authorization: Bearer your-payload-token"
   ```

## 📞 Wsparcie

W przypadku problemów:

1. Sprawdź logi aplikacji
2. Sprawdź status endpoint `/api/next/api-sync/status`
3. Sprawdź konfigurację w adminie
4. Sprawdź strukturę danych w kolekcji Bookings
5. Sprawdź czy wszystkie pliki są poprawnie utworzone

---

**🆕 Nowość:** Plugin teraz automatycznie ładuje konfigurację z admina, co oznacza, że możesz zmieniać wszystkie ustawienia bez restartowania aplikacji!
