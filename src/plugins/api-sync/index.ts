import { Plugin } from 'payload'
import { apiSyncPlugin } from './plugin.js'
import type { ApiSyncConfig } from './types.js'

export { apiSyncPlugin }
export type { ApiSyncConfig }

// Re-export types for convenience
export * from './types.js' 