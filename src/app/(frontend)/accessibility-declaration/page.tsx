import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deklaracja dostępności',
  description: 'Deklaracja dostępności dla aplikacji Payload Sandbox',
}

export default function AccessibilityDeclarationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Deklaracja dostępności</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Informacje ogólne</h2>
          <p className="mb-4">
            Ta aplikacja jest zgodna z wytycznymi WCAG 2.1 na poziomie AA. 
            Podejmujemy starania, aby nasza strona była dostępna dla wszystkich użytkowników, 
            w tym osób z niepełnosprawnościami.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Funkcje dostępności</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Możliwość zmiany rozmiaru tekstu (normalny, duży, bardzo duży)</li>
            <li>Tryb wysokiego kontrastu</li>
            <li>Nawigacja klawiaturą</li>
            <li>Oznaczenia ARIA dla czytników ekranu</li>
            <li>Alternatywne teksty dla obrazów</li>
            <li>Semantyczna struktura HTML</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Jak korzystać z funkcji dostępności</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Panel dostępności</h3>
            <p className="mb-4">
              W lewym górnym rogu strony znajduje się przycisk z ikoną dostępności. 
              Kliknij go, aby otworzyć panel z opcjami dostępności:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Text</strong> - normalny rozmiar tekstu</li>
              <li><strong>Text+</strong> - większy rozmiar tekstu</li>
              <li><strong>Text++</strong> - bardzo duży rozmiar tekstu</li>
              <li><strong>High Contrast</strong> - włączenie trybu wysokiego kontrastu</li>
              <li><strong>Low Contrast</strong> - wyłączenie trybu wysokiego kontrastu</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Nawigacja klawiaturą</h2>
          <p className="mb-4">
            Możesz nawigować po stronie używając klawisza Tab. 
            Wszystkie interaktywne elementy są dostępne z klawiatury.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
          <p className="mb-4">
            Jeśli napotkasz problemy z dostępnością lub masz sugestie dotyczące poprawy dostępności, 
            skontaktuj się z nami:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email: accessibility@example.com</li>
            <li>Telefon: +48 123 456 789</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Zgodność z przepisami</h2>
          <p className="mb-4">
            Ta strona jest zgodna z:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Wytycznymi WCAG 2.1 na poziomie AA</li>
            <li>Ustawą o dostępności cyfrowej</li>
            <li>Standardami dostępności UE</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Aktualizacje</h2>
          <p className="mb-4">
            Ostatnia aktualizacja tej deklaracji: {new Date().toLocaleDateString('pl-PL')}
          </p>
        </section>
      </div>
    </div>
  )
} 