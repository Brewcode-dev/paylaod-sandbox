import type { Payload } from 'payload'

export const seedGlobalSettings = async (payload: Payload): Promise<void> => {
  try {
    // Check if global settings already exist
    const existingSettings = await payload.find({
      collection: 'globalSettings',
      limit: 1,
    })

    if (existingSettings.docs.length > 0) {
      console.log('Global settings already exist, skipping seed')
      return
    }

    // Create default global settings
    await payload.create({
      collection: 'globalSettings',
      data: {
        siteName: 'Moja Strona',
        siteDescription: 'Nowoczesna strona internetowa stworzona z Payload CMS',
        googleAnalytics: {
          trackingId: '',
          enabled: false,
        },
        contact: {
          email: 'kontakt@example.com',
          phone: '+48 123 456 789',
          address: 'ul. Przykładowa 1, 00-000 Warszawa',
        },
        socialMedia: {
          facebook: 'https://facebook.com/mojastrona',
          twitter: 'https://twitter.com/mojastrona',
          instagram: 'https://instagram.com/mojastrona',
          linkedin: 'https://linkedin.com/company/mojastrona',
          youtube: 'https://youtube.com/@mojastrona',
          github: 'https://github.com/mojastrona',
        },
        footer: {
          copyrightText: '© 2024 Moja Strona. Wszystkie prawa zastrzeżone.',
          footerText: 'Strona stworzona z Payload CMS',
          showSocialMedia: true,
        },
      },
    })

    console.log('Global settings seeded successfully')
  } catch (error) {
    console.error('Error seeding global settings:', error)
  }
} 