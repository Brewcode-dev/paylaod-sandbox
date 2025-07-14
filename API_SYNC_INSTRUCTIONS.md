# 🚀 Instrukcje uruchomienia API Sync Plugin

## 📋 Co zostało zaimplementowane:

### 1. **Kolekcje (read-only)**

- ✅ Kolekcja `Bookings` jest teraz **read-only**
- ✅ Kolekcja `Photos` jest teraz **read-only**
- ✅ Użytkownicy mogą tylko przeglądać dane, nie mogą edytować
- ✅ Dane są synchronizowane tylko z zewnętrznego API

### 2. **Panel konfiguracyjny w Payload**

- ✅ Global `ApiSyncConfig` w panelu admin
- ✅ Możliwość edycji URL API, endpoint, JWT token
- ✅ Ustawienia automatycznej synchronizacji
- ✅ Statystyki synchronizacji

### 3. **API Endpoints**

- ✅ `POST /api/next/api-sync/sync` - synchronizacja wszystkich rezerwacji
- ✅ `POST /api/next/api-sync/sync-contractor/{id}` - synchronizacja dla kontrahenta
- ✅ `POST /api/next/api-sync/sync-photos` - synchronizacja wszystkich zdjęć
- ✅ `POST /api/next/api-sync/sync-photos-album/{albumId}` - synchronizacja zdjęć dla albumu
- ✅ `POST /api/next/api-sync/update-token` - aktualizacja JWT tokena
- ✅ `GET /api/next/api-sync/status` - status synchronizacji
- ✅ `POST /api/next/api-sync/update-config` - aktualizacja konfiguracji

## 🔧 Jak uruchomić:

### Krok 1: Uruchom aplikację

```bash
cd payload-sandbox
npm run dev
```

### Krok 2: Zaloguj się do panelu admin

- Otwórz `http://localhost:3000/admin`
- Zaloguj się jako admin

### Krok 3: Skonfiguruj API Sync

- W panelu admin przejdź do **"API Sync"** → **"API Sync Config"**
- Wypełnij:
  - **API URL**: `https://api.example.com` (podaj swój URL)
  - **Endpoint**: `api/v1/Bookings/GetBookingsByContractor`
  - **JWT Token**: (podaj swój token)
  - **Auto Sync**: `false` (na początku)
  - **Sync Interval**: `300000` (5 minut)

### Krok 4: Przetestuj synchronizację

```bash
# Synchronizacja wszystkich rezerwacji
curl -X POST http://localhost:3000/api/next/api-sync/sync \
  -H "Authorization: Bearer your-payload-token"

# Synchronizacja dla konkretnego kontrahenta
curl -X POST http://localhost:3000/api/next/api-sync/sync-contractor/12345 \
  -H "Authorization: Bearer your-payload-token"

# Synchronizacja wszystkich zdjęć
curl -X POST http://localhost:3000/api/next/api-sync/sync-photos \
  -H "Authorization: Bearer your-payload-token"

# Synchronizacja zdjęć dla konkretnego albumu
curl -X POST http://localhost:3000/api/next/api-sync/sync-photos-album/1 \
  -H "Authorization: Bearer your-payload-token"
```

## 📊 Jak to działa:

### 1. **Synchronizacja danych**

- Plugin pobiera dane z zewnętrznego API
- Mapuje pola z API do kolekcji Payload
- Tworzy/aktualizuje rekordy w kolekcji `Bookings`
- Aktualizuje statystyki w konfiguracji

### 2. **Panel konfiguracyjny**

- **API URL**: URL bazowy API
- **Endpoint**: Endpoint do synchronizacji
- **JWT Token**: Token do autoryzacji
- **Auto Sync**: Włącz/wyłącz automatyczną synchronizację
- **Sync Interval**: Interwał synchronizacji w ms
- **Last Sync**: Ostatnia synchronizacja
- **Sync Stats**: Statystyki synchronizacji

### 3. **Kolekcja Bookings**

- **Read-only**: Użytkownicy nie mogą edytować
- **Pola**:
  - `externalId`: ID z zewnętrznego API
  - `contractorId`: ID kontrahenta
  - `bookingDate`: Data rezerwacji
  - `status`: Status rezerwacji
  - `lastSynced`: Ostatnia synchronizacja
  - `rawData`: Surowe dane z API

## 🔄 Automatyczna synchronizacja:

### Włącz automatyczną synchronizację:

1. W panelu admin przejdź do **"API Sync Config"**
2. Zaznacz **"Auto Sync"**
3. Ustaw **"Sync Interval"** (np. 300000 = 5 minut)
4. Zapisz konfigurację

### Lub użyj crona:

```bash
# Dodaj do crontab (Linux/Mac)
0 * * * * curl -X POST http://localhost:3000/api/next/api-sync/sync \
  -H "Authorization: Bearer your-payload-token"
```

## 🚨 Rozwiązywanie problemów:

### Problem: "Action forbidden" (403)

**Rozwiązanie:** Upewnij się, że używasz poprawnego tokena autoryzacji Payload

### Problem: "API request failed" (401)

**Rozwiązanie:** Sprawdź czy JWT token jest poprawny i aktualny

### Problem: "Sync service not initialized"

**Rozwiązanie:** Sprawdź czy plugin jest poprawnie załadowany w `payload.config.ts`

### Problem: Dane nie synchronizują się

**Rozwiązanie:**

1. Sprawdź logi aplikacji
2. Sprawdź status endpoint `/api/next/api-sync/status`
3. Sprawdź konfigurację API w panelu admin

## 📝 Następne kroki:

1. **Podaj JWT token** - zaktualizuj w panelu admin
2. **Przetestuj synchronizację** - użyj endpointów API
3. **Sprawdź dane** - przejdź do kolekcji Bookings w panelu admin
4. **Włącz auto-sync** - jeśli potrzebna automatyczna synchronizacja

## 🎯 Podsumowanie:

✅ **Kolekcja Bookings** - read-only, synchronizowana z API  
✅ **Panel konfiguracyjny** - edycja ustawień w Payload admin  
✅ **API Endpoints** - ręczna synchronizacja przez API  
✅ **Automatyczna synchronizacja** - opcjonalna  
✅ **Statystyki** - monitoring synchronizacji

**Plugin jest gotowy do użycia!** 🚀
