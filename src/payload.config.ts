// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Bookings } from './collections/Bookings'
import { Photos } from './collections/Photos'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { GlobalSettings } from './globals/GlobalSettings'

import { plugins } from './plugins'
import { apiSyncPlugin } from './plugins/api-sync'
import { ApiSyncConfig } from './globals/ApiSyncConfig'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { syncBookingsEndpoint } from './endpoints/sync-bookings'
import { syncPhotosEndpoint } from './endpoints/sync-photos'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
      // Add custom components to the admin panel
      afterDashboard: ['@/components/SyncButtons'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [Pages, Posts, Media, Categories, Users, Bookings, Photos],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, ApiSyncConfig, GlobalSettings],
  endpoints: [syncBookingsEndpoint, syncPhotosEndpoint],
  plugins: [
    ...plugins,
    apiSyncPlugin({
      apiUrl: process.env.API_BASE_URL || 'https://api.example.com', // Fallback URL
      endpoint: 'api/v1/Bookings/GetBookingsByContractor', // Fallback endpoint
      collectionName: 'bookings',
      autoSync: false, // Will be loaded from admin
      syncInterval: 300000, // Will be loaded from admin
      retryAttempts: 3, // Will be loaded from admin
      retryDelay: 1000, // Will be loaded from admin
      onError: (error: Error) => {
        console.error('API Sync Error:', error)
      },
    }),
    // Temporarily disabled Photos API sync to fix slider issues
    // apiSyncPlugin({
    //   apiUrl: 'https://jsonplaceholder.typicode.com',
    //   endpoint: 'photos',
    //   collectionName: 'photos',
    //   autoSync: false, // Will be loaded from admin
    //   syncInterval: 300000, // Will be loaded from admin
    //   retryAttempts: 3, // Will be loaded from admin
    //   retryDelay: 1000, // Will be loaded from admin
    //   onError: (error: Error) => {
    //     console.error('Photos API Sync Error:', error)
    //   },
    // }),
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    // Initialize sync services for both APIs
    // Note: The sync service will be initialized by the plugin
    console.log('Payload initialized - sync services will be available via plugins')
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
