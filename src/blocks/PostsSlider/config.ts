import type { Block } from 'payload'

export const PostsSlider: Block = {
  slug: 'postsSlider',
  interfaceName: 'PostsSliderBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Slider Title',
      required: false,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Slider Description',
      required: false,
    },
    {
      name: 'selectionMethod',
      type: 'select',
      label: 'How to select posts',
      defaultValue: 'manual',
      options: [
        { label: 'Manual Selection', value: 'manual' },
        { label: 'Latest Posts', value: 'latest' },
        { label: 'By Category', value: 'category' },
        { label: 'Featured Posts', value: 'featured' },
      ],
      required: true,
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: 'Select Posts',
      required: true,
      admin: {
        condition: (data, siblingData) => siblingData?.selectionMethod === 'manual',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Select Category',
      required: true,
      admin: {
        condition: (data, siblingData) => siblingData?.selectionMethod === 'category',
      },
    },
    {
      name: 'postsLimit',
      type: 'number',
      label: 'Number of posts to show',
      defaultValue: 6,
      min: 1,
      max: 20,
      admin: {
        condition: (data, siblingData) => 
          siblingData?.selectionMethod === 'latest' || 
          siblingData?.selectionMethod === 'category' ||
          siblingData?.selectionMethod === 'featured',
      },
    },
    {
      name: 'display',
      type: 'group',
      label: 'Display Options',
      fields: [
        {
          name: 'showImage',
          type: 'checkbox',
          label: 'Show post image',
          defaultValue: true,
        },
        {
          name: 'showTitle',
          type: 'checkbox',
          label: 'Show post title',
          defaultValue: true,
        },
        {
          name: 'showExcerpt',
          type: 'checkbox',
          label: 'Show post excerpt',
          defaultValue: true,
        },
        {
          name: 'showDate',
          type: 'checkbox',
          label: 'Show publish date',
          defaultValue: true,
        },
        {
          name: 'showCategory',
          type: 'checkbox',
          label: 'Show post category',
          defaultValue: true,
        },
        {
          name: 'excerptLength',
          type: 'number',
          label: 'Excerpt length (characters)',
          defaultValue: 150,
          min: 50,
          max: 500,
          admin: {
            condition: (data, siblingData) => siblingData?.showExcerpt,
          },
        },
      ],
    },
    {
      name: 'slider',
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
          name: 'delay',
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
          name: 'nav',
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
          name: 'perView',
          type: 'select',
          label: 'Slides Per View',
          defaultValue: '3',
          options: [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
          ],
        },
        {
          name: 'space',
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
          name: 'cardStyle',
          type: 'select',
          label: 'Card Style',
          defaultValue: 'modern',
          options: [
            { label: 'Modern', value: 'modern' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Classic', value: 'classic' },
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
        {
          name: 'showReadMore',
          type: 'checkbox',
          label: 'Show "Read More" button',
          defaultValue: true,
        },
      ],
    },
  ],
} 