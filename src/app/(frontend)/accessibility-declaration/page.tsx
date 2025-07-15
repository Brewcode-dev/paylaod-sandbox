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
            <li>Kontrola animacji (włączanie/wyłączanie)</li>
            <li>Zwiększenie odstępów między elementami</li>
            <li>Ukrywanie obrazów dla lepszej czytelności</li>
            <li>Funkcja resetowania wszystkich ustawień</li>
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
            
            <h4 className="text-lg font-semibold mb-2 mt-4">Opcje tekstu:</h4>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong>Text</strong> - normalny rozmiar tekstu</li>
              <li><strong>Text+</strong> - większy rozmiar tekstu</li>
              <li><strong>Text++</strong> - bardzo duży rozmiar tekstu</li>
            </ul>

            <h4 className="text-lg font-semibold mb-2">Opcje kontrastu:</h4>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong>High Contrast</strong> - włączenie trybu wysokiego kontrastu</li>
              <li><strong>Low Contrast</strong> - wyłączenie trybu wysokiego kontrastu</li>
            </ul>

            <h4 className="text-lg font-semibold mb-2">Opcje animacji:</h4>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong>Animations On</strong> - włączenie animacji</li>
              <li><strong>Animations Off</strong> - wyłączenie animacji (zalecane dla osób z wrażliwością na ruch)</li>
            </ul>

            <h4 className="text-lg font-semibold mb-2">Opcje odstępów:</h4>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong>Spacing Normal</strong> - standardowe odstępy</li>
              <li><strong>Spacing Large</strong> - zwiększone odstępy między elementami</li>
            </ul>

            <h4 className="text-lg font-semibold mb-2">Opcje obrazów:</h4>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong>Images Show</strong> - wyświetlanie obrazów</li>
              <li><strong>Images Hide</strong> - ukrywanie obrazów (dla lepszej czytelności)</li>
            </ul>

            <h4 className="text-lg font-semibold mb-2">Funkcje dodatkowe:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Reset</strong> - przywrócenie domyślnych ustawień i wyczyszczenie ciasteczek</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Zalecenia dla różnych grup użytkowników</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">Dla osób z wadami wzroku:</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Użyj opcji "Text+" lub "Text++" dla większego tekstu</li>
                <li>Włącz "High Contrast" dla lepszego kontrastu</li>
                <li>Rozważ "Images Hide" jeśli obrazy przeszkadzają w czytaniu</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-green-800">Dla osób z wrażliwością na ruch:</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Włącz "Animations Off" aby wyłączyć animacje</li>
                <li>Użyj "Spacing Large" dla lepszej nawigacji</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-purple-800">Dla osób z trudnościami w czytaniu:</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Zwiększ rozmiar tekstu</li>
                <li>Włącz "Spacing Large" dla lepszej czytelności</li>
                <li>Rozważ "Images Hide" aby skupić się na tekście</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-orange-800">Dla użytkowników czytników ekranu:</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Wszystkie elementy mają odpowiednie oznaczenia ARIA</li>
                <li>Struktura nagłówków jest semantyczna</li>
                <li>Obrazy mają alternatywne opisy</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Nawigacja klawiaturą</h2>
          <p className="mb-4">
            Możesz nawigować po stronie używając klawisza Tab. 
            Wszystkie interaktywne elementy są dostępne z klawiatury.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Skróty klawiszowe:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Tab</strong> - nawigacja do następnego elementu</li>
              <li><strong>Shift + Tab</strong> - nawigacja do poprzedniego elementu</li>
              <li><strong>Enter</strong> - aktywacja przycisku lub linku</li>
              <li><strong>Escape</strong> - zamknięcie panelu dostępności</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Zapisywanie ustawień</h2>
          <p className="mb-4">
            Twoje ustawienia dostępności są automatycznie zapisywane w przeglądarce 
            i będą przywrócone przy następnej wizycie. Możesz w każdej chwili 
            użyć przycisku "Reset" aby przywrócić domyślne ustawienia.
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
            <li>Wymaganiami EN 301 549 V3.2.1</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Aktualizacje</h2>
          <p className="mb-4">
            Ostatnia aktualizacja tej deklaracji: {new Date().toLocaleDateString('pl-PL')}
          </p>
          <p className="text-sm text-gray-600">
            Dodano nowe funkcje: kontrola animacji, zwiększenie odstępów, ukrywanie obrazów, 
            funkcja resetowania ustawień oraz zamykanie panelu przez kliknięcie poza nim.
          </p>
        </section>
      </div>
    </div>
  )
} 