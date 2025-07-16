import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { getGlobalSettings } from './getGlobalSettings'

export const mergeOpenGraph = async (og?: Metadata['openGraph']): Promise<Metadata['openGraph']> => {
  const globalSettings = await getGlobalSettings()
  
  const defaultOpenGraph: Metadata['openGraph'] = {
    type: 'website',
    description: globalSettings?.siteDescription || 'Nowoczesna strona internetowa stworzona z Payload CMS',
    images: [
      {
        url: `${getServerSideURL()}/website-template-OG.webp`,
      },
    ],
    siteName: globalSettings?.siteName || 'Payload Sandbox',
    title: globalSettings?.siteName || 'Payload Sandbox',
  }

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
