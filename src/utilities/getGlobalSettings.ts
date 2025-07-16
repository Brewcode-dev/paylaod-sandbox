import { getPayload } from 'payload'
import config from '@payload-config'

export async function getGlobalSettings() {
  try {
    const payload = await getPayload({ config })

    const globalSettings = await payload.findGlobal({
      slug: 'globalSettings',
    })

    return globalSettings
  } catch (error) {
    console.error('Error fetching global settings:', error)
    return null
  }
}

// Function to clear any potential cache
export async function clearGlobalSettingsCache() {
  // This function can be used to clear any server-side cache if needed
  console.log('Global settings cache cleared')
} 