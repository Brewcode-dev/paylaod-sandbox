# Globalne Ustawienia - Payload CMS

## Opis

System globalnych ustawień pozwala na zarządzanie podstawowymi informacjami o stronie, takimi jak logo, favicon, Google Analytics, informacje kontaktowe i teksty w stopce.

## Funkcjonalności

### 1. Podstawowe informacje

- **Nazwa strony** - główna nazwa wyświetlana w przeglądarce i SEO
- **Opis strony** - krótki opis używany w meta tagach
- **Logo** - główne logo strony (PNG, SVG)
- **Favicon** - ikona strony wyświetlana w zakładce przeglądarki

### 2. Google Analytics

- **ID śledzenia** - ID Google Analytics 4 (format: G-XXXXXXXXXX)
- **Włącz/Wyłącz** - kontrola czy Google Analytics jest aktywne

### 3. Informacje kontaktowe

- **Email** - adres email kontaktowy
- **Telefon** - numer telefonu kontaktowy
- **Adres** - adres fizyczny

### 4. Social Media

- **Facebook URL** - link do profilu Facebook
- **Twitter/X URL** - link do profilu Twitter/X
- **Instagram URL** - link do profilu Instagram
- **LinkedIn URL** - link do profilu LinkedIn
- **YouTube URL** - link do kanału YouTube
- **GitHub URL** - link do profilu GitHub

### 5. Stopka

- **Tekst copyright** - tekst praw autorskich
- **Dodatkowy tekst** - dodatkowy tekst w stopce
- **Pokaż social media** - kontrola czy wyświetlać ikony social media w stopce

## Instalacja i konfiguracja

### 1. Uruchom seed danych

```bash
# Przejdź do panelu administracyjnego i uruchom seed
# Lub użyj endpointu API
curl -X POST http://localhost:3000/next/seed
```

### 2. Edytuj ustawienia

1. Przejdź do panelu administracyjnego: `/admin`
2. Zaloguj się na konto administratora
3. Przejdź do sekcji "Settings" → "Global Settings"
4. Edytuj ustawienia i zapisz zmiany

## Komponenty

### GlobalLogo

Komponent wyświetlający logo z globalnych ustawień z fallbackiem do domyślnego logo.

```tsx
import { GlobalLogo } from '@/components/GlobalLogo'
;<GlobalLogo loading="eager" priority="high" />
```

### GoogleAnalytics

Komponent automatycznie dodający Google Analytics do strony.

```tsx
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
;<GoogleAnalytics />
```

### MetaTags

Komponent generujący meta tagi SEO z globalnych ustawień.

```tsx
import { MetaTags } from '@/components/MetaTags'
;<MetaTags title="Tytuł strony" description="Opis strony" />
```

### Favicon

Komponent dynamicznie ustawiający favicon z globalnych ustawień.

```tsx
import { Favicon } from '@/components/Favicon'
;<Favicon />
```

### GlobalFooter

Komponent stopki z globalnymi ustawieniami.

```tsx
import { GlobalFooter } from '@/components/GlobalFooter'
;<GlobalFooter navItems={navItems} />
```

### SocialMediaIcons

Komponent wyświetlający ikony social media.

```tsx
import { SocialMediaIcons } from '@/components/SocialMediaIcons'
;<SocialMediaIcons socialMedia={settings.socialMedia} iconSize="md" className="text-gray-400" />
```

## Hook useGlobalSettings

Hook do pobierania globalnych ustawień z cache'owaniem.

```tsx
import { useGlobalSettings } from '@/hooks/useGlobalSettings'

const { settings, loading, error } = useGlobalSettings()

if (loading) return <div>Ładowanie...</div>
if (error) return <div>Błąd: {error}</div>

console.log(settings.siteName)
```

## API Endpoint

### GET /api/globalSettings

Pobiera globalne ustawienia z populacją mediów.

**Response:**

```json
{
  "id": 1,
  "siteName": "Moja Strona",
  "siteDescription": "Opis strony",
  "logo": {
    "id": 1,
    "url": "/media/logo.png",
    "filename": "logo.png"
  },
  "favicon": {
    "id": 2,
    "url": "/media/favicon.ico",
    "filename": "favicon.ico"
  },
  "googleAnalytics": {
    "trackingId": "G-XXXXXXXXXX",
    "enabled": true
  },
  "contact": {
    "email": "kontakt@example.com",
    "phone": "+48 123 456 789",
    "address": "ul. Przykładowa 1, 00-000 Warszawa"
  },
  "socialMedia": {
    "facebook": "https://facebook.com/mojastrona",
    "twitter": "https://twitter.com/mojastrona",
    "instagram": "https://instagram.com/mojastrona",
    "linkedin": "https://linkedin.com/company/mojastrona",
    "youtube": "https://youtube.com/@mojastrona",
    "github": "https://github.com/mojastrona"
  },
  "footer": {
    "copyrightText": "© 2024 Moja Strona",
    "footerText": "Dodatkowy tekst w stopce",
    "showSocialMedia": true
  }
}
```

## Demo

Strona demo dostępna pod adresem: `/global-settings-demo`

## Struktura plików

```
src/
├── collections/
│   └── GlobalSettings.ts          # Kolekcja globalnych ustawień
├── components/
│   ├── GlobalLogo.tsx            # Komponent logo z globalnych ustawień
│   ├── GoogleAnalytics.tsx       # Komponent Google Analytics
│   ├── MetaTags.tsx              # Komponent meta tagów
│   ├── Favicon.tsx               # Komponent favicon z globalnych ustawień
│   ├── GlobalFooter.tsx          # Komponent stopki z globalnymi ustawieniami
│   └── SocialMediaIcons.tsx      # Komponent ikon social media
├── hooks/
│   └── useGlobalSettings.ts      # Hook do pobierania ustawień
├── endpoints/
│   └── seed/
│       └── global-settings.ts    # Dane seed dla globalnych ustawień
└── app/(frontend)/
    ├── api/globalSettings/
    │   └── route.ts              # API endpoint
    └── global-settings-demo/
        └── page.tsx              # Strona demo
```

## Cache'owanie

Globalne ustawienia są cache'owane na 5 minut po stronie klienta, aby zminimalizować liczbę zapytań do API.

## Obsługa błędów

- Jeśli nie ma ustawień globalnych, komponenty używają fallbacków
- Błędy są logowane do konsoli
- Komponenty wyświetlają loading state podczas ładowania

## Rozszerzanie

Aby dodać nowe pola do globalnych ustawień:

1. Edytuj `src/collections/GlobalSettings.ts`
2. Dodaj nowe pola do schematu
3. Zaktualizuj typy w `payload-types.ts` (automatycznie)
4. Zaktualizuj komponenty, które mają używać nowych pól
5. Dodaj nowe pola do danych seed w `src/endpoints/seed/global-settings.ts`
