'use client'

import React from 'react'
import Link from 'next/link'
import { useGlobalSettings } from '../../../hooks/useGlobalSettings'

export default function GlobalSettingsDemo() {
  const { settings, loading, error } = useGlobalSettings()

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Ładowanie ustawień...</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Błąd ładowania ustawień</h1>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Brak ustawień globalnych</h1>
        <p>Nie znaleziono ustawień globalnych. Sprawdź czy zostały utworzone w panelu administracyjnym.</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Demo Ustawień Globalnych</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Podstawowe informacje */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Podstawowe informacje</h2>
          <div className="space-y-2">
            <p><strong>Nazwa strony:</strong> {settings.siteName}</p>
            <p><strong>Opis:</strong> {settings.siteDescription || 'Brak opisu'}</p>
            <p><strong>Logo:</strong> {settings.logo ? 'Tak' : 'Nie'}</p>
            <p><strong>Favicon:</strong> {settings.favicon ? 'Tak' : 'Nie'}</p>
            {settings.favicon && typeof settings.favicon === 'object' && 'filename' in settings.favicon && (
              <p><strong>Nazwa pliku favicon:</strong> {settings.favicon.filename}</p>
            )}
          </div>
        </div>

        {/* Google Analytics */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Google Analytics</h2>
          <div className="space-y-2">
            <p><strong>Włączone:</strong> {settings.googleAnalytics?.enabled ? 'Tak' : 'Nie'}</p>
            <p><strong>ID śledzenia:</strong> {settings.googleAnalytics?.trackingId || 'Brak'}</p>
          </div>
        </div>

        {/* Informacje kontaktowe */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informacje kontaktowe</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {settings.contact?.email || 'Brak'}</p>
            <p><strong>Telefon:</strong> {settings.contact?.phone || 'Brak'}</p>
            <p><strong>Adres:</strong> {settings.contact?.address || 'Brak'}</p>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Social Media</h2>
          <div className="space-y-2">
            <p><strong>Facebook:</strong> {settings.socialMedia?.facebook || 'Brak'}</p>
            <p><strong>Twitter/X:</strong> {settings.socialMedia?.twitter || 'Brak'}</p>
            <p><strong>Instagram:</strong> {settings.socialMedia?.instagram || 'Brak'}</p>
            <p><strong>LinkedIn:</strong> {settings.socialMedia?.linkedin || 'Brak'}</p>
            <p><strong>YouTube:</strong> {settings.socialMedia?.youtube || 'Brak'}</p>
            <p><strong>GitHub:</strong> {settings.socialMedia?.github || 'Brak'}</p>
          </div>
        </div>

        {/* Stopka */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Stopka</h2>
          <div className="space-y-2">
            <p><strong>Copyright:</strong> {settings.footer?.copyrightText || 'Brak'}</p>
            <p><strong>Tekst stopki:</strong> {settings.footer?.footerText || 'Brak'}</p>
            <p><strong>Pokaż social media:</strong> {settings.footer?.showSocialMedia ? 'Tak' : 'Nie'}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Jak edytować ustawienia?</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Przejdź do panelu administracyjnego: <Link href="/admin" className="text-blue-600 dark:text-blue-400 underline">/admin</Link></li>
          <li>Zaloguj się na konto administratora</li>
          <li>Przejdź do sekcji &quot;Settings&quot; → &quot;Global Settings&quot;</li>
          <li>Edytuj ustawienia i zapisz zmiany</li>
          <li>Odśwież tę stronę, aby zobaczyć zmiany</li>
        </ol>
      </div>
    </div>
  )
} 