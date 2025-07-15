import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mapa strony',
  description: 'Mapa strony dla aplikacji Payload Sandbox',
}

export default function SitemapPage() {
  const pages = [
    { title: 'Strona główna', href: '/', description: 'Strona główna aplikacji' },
    { title: 'Deklaracja dostępności', href: '/accessibility-declaration', description: 'Informacje o dostępności strony' },
    { title: 'Mapa strony', href: '/sitemap', description: 'Mapa strony' },
    { title: 'Admin', href: '/admin', description: 'Panel administracyjny' },
    { title: 'API GraphQL', href: '/api/graphql', description: 'GraphQL API' },
    { title: 'API GraphQL Playground', href: '/api/graphql-playground', description: 'GraphQL Playground' },
  ]

  const collections = [
    { title: 'Strony', href: '/admin/collections/pages', description: 'Zarządzanie stronami' },
    { title: 'Posty', href: '/admin/collections/posts', description: 'Zarządzanie postami' },
    { title: 'Media', href: '/admin/collections/media', description: 'Zarządzanie mediami' },
    { title: 'Kategorie', href: '/admin/collections/categories', description: 'Zarządzanie kategoriami' },
    { title: 'Użytkownicy', href: '/admin/collections/users', description: 'Zarządzanie użytkownikami' },
    { title: 'Rezerwacje', href: '/admin/collections/bookings', description: 'Zarządzanie rezerwacjami' },
    { title: 'Zdjęcia', href: '/admin/collections/photos', description: 'Zarządzanie zdjęciami' },
  ]

  const globals = [
    { title: 'Ustawienia globalne', href: '/admin/globals/global-settings', description: 'Ustawienia globalne aplikacji' },
    { title: 'Header', href: '/admin/globals/header', description: 'Konfiguracja nagłówka' },
    { title: 'Footer', href: '/admin/globals/footer', description: 'Konfiguracja stopki' },
    { title: 'API Sync Config', href: '/admin/globals/api-sync-config', description: 'Konfiguracja synchronizacji API' },
  ]

  const apiEndpoints = [
    { title: 'API Sync Status', href: '/next/api-sync/status', description: 'Status synchronizacji API' },
    { title: 'API Sync', href: '/next/api-sync/sync', description: 'Synchronizacja danych' },
    { title: 'API Photos', href: '/next/api-photos', description: 'API zdjęć' },
    { title: 'Global Settings API', href: '/api/globalSettings', description: 'API ustawień globalnych' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Mapa strony</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Główne strony */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Główne strony</h2>
          <div className="space-y-3">
            {pages.map((page) => (
              <div key={page.href} className="border-l-4 border-blue-200 pl-4">
                <Link 
                  href={page.href}
                  className="text-blue-600 hover:text-blue-800 font-medium block"
                >
                  {page.title}
                </Link>
                <p className="text-sm text-gray-600 mt-1">{page.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Kolekcje */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Kolekcje</h2>
          <div className="space-y-3">
            {collections.map((collection) => (
              <div key={collection.href} className="border-l-4 border-green-200 pl-4">
                <Link 
                  href={collection.href}
                  className="text-green-600 hover:text-green-800 font-medium block"
                >
                  {collection.title}
                </Link>
                <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Globalne ustawienia */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">Ustawienia globalne</h2>
          <div className="space-y-3">
            {globals.map((global) => (
              <div key={global.href} className="border-l-4 border-purple-200 pl-4">
                <Link 
                  href={global.href}
                  className="text-purple-600 hover:text-purple-800 font-medium block"
                >
                  {global.title}
                </Link>
                <p className="text-sm text-gray-600 mt-1">{global.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* API Endpoints */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-orange-600">API Endpoints</h2>
          <div className="space-y-3">
            {apiEndpoints.map((endpoint) => (
              <div key={endpoint.href} className="border-l-4 border-orange-200 pl-4">
                <Link 
                  href={endpoint.href}
                  className="text-orange-600 hover:text-orange-800 font-medium block"
                >
                  {endpoint.title}
                </Link>
                <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Informacje dodatkowe */}
      <section className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Informacje dodatkowe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Dostępność</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Panel dostępności w lewym górnym rogu</li>
              <li>Nawigacja klawiaturą</li>
              <li>Wysoki kontrast</li>
              <li>Zmiana rozmiaru tekstu</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Kontakt</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Email: kontakt@example.com</li>
              <li>Telefon: +48 123 456 789</li>
              <li>Deklaracja dostępności: <Link href="/accessibility-declaration" className="text-blue-600 hover:underline">Zobacz</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
} 