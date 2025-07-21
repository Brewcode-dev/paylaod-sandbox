import type { Block } from 'payload'

export const SwiperSlider: Block = {
  slug: 'swiperSlider',
  interfaceName: 'SwiperSliderBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Slider Title',
      required: false,
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Slide Title',
          required: false,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Slide Description',
          required: false,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Slide Image',
          required: true,
        },
        {
          name: 'link',
          type: 'group',
          label: 'Slide Link',
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: false,
            },
            {
              name: 'text',
              type: 'text',
              label: 'Link Text',
              required: false,
            },
          ],
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Slider Settings',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          label: 'Enable Autoplay',
          defaultValue: true,
        },
        {
          name: 'autoplayDelay',
          type: 'number',
          label: 'Autoplay Delay (ms)',
          defaultValue: 5000,
          admin: {
            condition: (data, siblingData) => siblingData?.autoplay,
          },
        },
        {
          name: 'loop',
          type: 'checkbox',
          label: 'Enable Loop',
          defaultValue: true,
        },
        {
          name: 'navigation',
          type: 'checkbox',
          label: 'Show Navigation Arrows',
          defaultValue: true,
        },
        {
          name: 'pagination',
          type: 'checkbox',
          label: 'Show Pagination Dots',
          defaultValue: true,
        },
        {
          name: 'slidesPerView',
          type: 'select',
          label: 'Slides Per View',
          defaultValue: '1',
          options: [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
          ],
        },
        {
          name: 'spaceBetween',
          type: 'number',
          label: 'Space Between Slides (px)',
          defaultValue: 30,
        },
      ],
    },
    {
      name: 'styling',
      type: 'group',
      label: 'Styling Options',
      fields: [
        {
          name: 'height',
          type: 'select',
          label: 'Slider Height',
          defaultValue: 'medium',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
            { label: 'Full Height', value: 'full' },
          ],
        },
        {
          name: 'theme',
          type: 'select',
          label: 'Theme',
          defaultValue: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ],
        },
      ],
    },
  ],
} 