import { CollectionConfig } from 'payload'
// import { SyncButton } from '../components/SyncButton' // Remove this import for now

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'externalId',
    defaultColumns: ['externalId', 'contractorId', 'bookingDate', 'status', 'lastSynced'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: () => false, // Read-only - tylko synchronizacja
    update: () => false, // Read-only - tylko synchronizacja
    delete: () => false, // Read-only - tylko synchronizacja
  },
  fields: [
    {
      name: 'externalId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'External ID from the API',
      },
    },
    {
      name: 'contractorId',
      type: 'text',
      required: true,
      admin: {
        description: 'Contractor ID from the API',
      },
    },
    {
      name: 'bookingDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Booking date from the API',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
      ],
      required: true,
      admin: {
        description: 'Booking status from the API',
      },
    },
    {
      name: 'lastSynced',
      type: 'date',
      admin: {
        description: 'Last synchronization date',
        readOnly: true,
      },
    },
    {
      name: 'rawData',
      type: 'json',
      admin: {
        description: 'Raw data from the API',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }: { data: any }) => {
        // Update lastSynced timestamp
        data.lastSynced = new Date()
        return data
      },
    ],
  },
} 