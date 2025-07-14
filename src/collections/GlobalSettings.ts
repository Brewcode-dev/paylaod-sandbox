import type { CollectionConfig } from 'payload'

export const GlobalSettings: CollectionConfig = {
  slug: 'globalSettings',
  access: {
    read: () => true, // Public read access
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    group: 'Settings',
    useAsTitle: 'siteName',
    defaultColumns: ['siteName', 'siteDescription', 'updatedAt'],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      label: 'Nazwa strony',
      admin: {
        description: 'Główna nazwa strony wyświetlana w przeglądarce i SEO',
      },
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      label: 'Opis strony',
      admin: {
        description: 'Krótki opis strony używany w meta tagach',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo strony',
      admin: {
        description: 'Główne logo strony (zalecane: PNG, SVG)',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon',
      admin: {
        description: 'Ikona strony wyświetlana w zakładce przeglądarki (zalecane: ICO, PNG)',
      },
    },
    {
      name: 'googleAnalytics',
      type: 'group',
      label: 'Google Analytics',
      fields: [
        {
          name: 'trackingId',
          type: 'text',
          label: 'ID śledzenia (GA4)',
          admin: {
            description: 'ID śledzenia Google Analytics 4 (format: G-XXXXXXXXXX)',
          },
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Włącz Google Analytics',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Informacje kontaktowe',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email kontaktowy',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefon kontaktowy',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Adres',
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
          admin: {
            description: 'Pełny URL do profilu Facebook (np. https://facebook.com/mojastrona)',
          },
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter/X URL',
          admin: {
            description: 'Pełny URL do profilu Twitter/X (np. https://twitter.com/mojastrona)',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
          admin: {
            description: 'Pełny URL do profilu Instagram (np. https://instagram.com/mojastrona)',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn URL',
          admin: {
            description: 'Pełny URL do profilu LinkedIn (np. https://linkedin.com/company/mojastrona)',
          },
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube URL',
          admin: {
            description: 'Pełny URL do kanału YouTube (np. https://youtube.com/@mojastrona)',
          },
        },
        {
          name: 'github',
          type: 'text',
          label: 'GitHub URL',
          admin: {
            description: 'Pełny URL do profilu GitHub (np. https://github.com/mojastrona)',
          },
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Stopka',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          label: 'Tekst copyright',
          defaultValue: '© 2024 Wszystkie prawa zastrzeżone',
        },
        {
          name: 'footerText',
          type: 'textarea',
          label: 'Dodatkowy tekst w stopce',
        },
        {
          name: 'showSocialMedia',
          type: 'checkbox',
          label: 'Pokaż linki social media w stopce',
          defaultValue: true,
        },
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 10,
  },
} 