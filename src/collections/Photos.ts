import { CollectionConfig } from 'payload'

export const Photos: CollectionConfig = {
  slug: 'photos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['externalId', 'albumId', 'title', 'lastSynced'],
    pagination: {
      defaultLimit: 10,
      limits: [10, 20, 50, 100],
    },
    group: 'Content',
  },
  access: {
    read: () => true,
    create: () => false, // Read-only - tylko synchronizacja
    update: () => false, // Read-only - tylko synchronizacja
    delete: () => true, // Read-only - tylko synchronizacja
  },
  fields: [
    {
      name: 'externalId',
      type: 'number',
      required: true,
      unique: true,
      admin: {
        description: 'ID z zewnętrznego API',
        position: 'sidebar',
      },
    },
    {
      name: 'albumId',
      type: 'number',
      required: true,
      admin: {
        description: 'ID albumu z API',
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Tytuł zdjęcia',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'URL zdjęcia',
        position: 'sidebar',
      },
    },
    {
      name: 'thumbnailUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'URL miniaturki',
        position: 'sidebar',
      },
    },
    {
      name: 'lastSynced',
      type: 'date',
      admin: {
        description: 'Ostatnia synchronizacja',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'rawData',
      type: 'json',
      admin: {
        description: 'Surowe dane z API',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }: { data: any }) => {
        // Aktualizuj timestamp przy każdej zmianie
        data.lastSynced = new Date()
        return data
      },
    ],
  },
} 