import { GlobalConfig } from 'payload'

export const ApiSyncConfig: GlobalConfig = {
  slug: 'api-sync-config',
  admin: {
    group: 'API Sync',
    description: 'Konfiguracja synchronizacji z zewnętrznym API',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'apiUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'URL bazowy API (np. https://api.example.com)',
      },
    },
    {
      name: 'endpoint',
      type: 'text',
      required: true,
      defaultValue: 'api/v1/Bookings/GetBookingsByContractor',
      admin: {
        description: 'Endpoint API do synchronizacji rezerwacji',
      },
    },
    {
      name: 'jwtToken',
      type: 'text',
      admin: {
        description: 'JWT Bearer token do autoryzacji API',
      },
    },
    {
      name: 'autoSync',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Włącz automatyczną synchronizację',
      },
    },
    {
      name: 'syncInterval',
      type: 'number',
      defaultValue: 300000, // 5 minut
      admin: {
        description: 'Interwał synchronizacji w milisekundach (300000 = 5 minut)',
      },
    },
    {
      name: 'retryAttempts',
      type: 'number',
      defaultValue: 3,
      admin: {
        description: 'Liczba prób retry w przypadku błędu',
      },
    },
    {
      name: 'retryDelay',
      type: 'number',
      defaultValue: 1000,
      admin: {
        description: 'Opóźnienie między próbami w milisekundach',
      },
    },
    {
      name: 'lastSync',
      type: 'date',
      admin: {
        description: 'Ostatnia synchronizacja',
        readOnly: true,
      },
    },
    {
      name: 'lastSyncStatus',
      type: 'select',
      options: [
        { label: 'Sukces', value: 'success' },
        { label: 'Błąd', value: 'error' },
        { label: 'Nie synchronizowano', value: 'never' },
      ],
      defaultValue: 'never',
      admin: {
        description: 'Status ostatniej synchronizacji',
        readOnly: true,
      },
    },
    {
      name: 'lastSyncError',
      type: 'textarea',
      admin: {
        description: 'Ostatni błąd synchronizacji',
        readOnly: true,
      },
    },
    {
      name: 'syncStats',
      type: 'group',
      admin: {
        description: 'Statystyki synchronizacji',
        readOnly: true,
      },
      fields: [
        {
          name: 'totalRecords',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Łączna liczba zsynchronizowanych rekordów',
          },
        },
        {
          name: 'lastRecordsProcessed',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Liczba rekordów w ostatniej synchronizacji',
          },
        },
        {
          name: 'lastRecordsCreated',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Liczba nowych rekordów w ostatniej synchronizacji',
          },
        },
        {
          name: 'lastRecordsUpdated',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Liczba zaktualizowanych rekordów w ostatniej synchronizacji',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        console.log('🔧 ApiSyncConfig beforeChange hook triggered')
        console.log('Data to save:', data)

        // Aktualizuj timestamp przy każdej zmianie konfiguracji
        data.updatedAt = new Date()

        // Log the user making the change
        if (req.user) {
          console.log('User making change:', req.user.email)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        console.log('✅ ApiSyncConfig afterChange hook triggered')
        console.log('Saved document:', doc)

        // Log successful save
        if (req.user) {
          console.log(`Configuration saved by user: ${req.user.email}`)
        }
      },
    ],
    beforeValidate: [
      ({ data, req }) => {
        console.log('🔍 ApiSyncConfig beforeValidate hook triggered')
        console.log('Validating data:', data)
        return data
      },
    ],
  },
}
