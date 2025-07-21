# SwiperSlider Block

A custom content block for Payload CMS that creates beautiful, responsive sliders using Swiper.js.

## Features

- 🎠 Responsive slider with multiple slides
- 🖼️ Image support with background images
- 📝 Title and description for each slide
- 🔗 Optional link/CTA for each slide
- ⚙️ Configurable settings (autoplay, navigation, pagination, etc.)
- 🎨 Multiple themes and height options
- 📱 Mobile-friendly design

## Installation

1. Install the Swiper package:

```bash
npm install swiper
# or
yarn add swiper
# or
pnpm add swiper
```

2. The block is already configured and ready to use in your Payload CMS.

## Usage

### In Pages Collection

The SwiperSlider block is available in the "Content" tab of the Pages collection. You can add it to your page layout alongside other content blocks.

### In Posts Collection

The SwiperSlider block is available in the rich text editor of Posts. You can embed it within your post content.

## Configuration Options

### Basic Settings

- **Title**: Optional title for the entire slider
- **Slides**: Array of slide objects (1-10 slides)

### Slide Configuration

Each slide can have:

- **Title**: Slide title
- **Description**: Slide description text
- **Image**: Required background image (from Media collection)
- **Link**: Optional link with URL and text

### Slider Settings

- **Autoplay**: Enable/disable automatic sliding
- **Autoplay Delay**: Time between slides (in milliseconds)
- **Loop**: Enable/disable infinite loop
- **Navigation**: Show/hide navigation arrows
- **Pagination**: Show/hide pagination dots
- **Slides Per View**: Number of slides visible at once (1-4)
- **Space Between**: Space between slides in pixels

### Styling Options

- **Height**: Small, Medium, Large, or Full Height
- **Theme**: Light or Dark theme

## Customization

You can customize the appearance by modifying the `Component.tsx` file:

- Change CSS classes for different styling
- Modify the Swiper configuration
- Add custom animations or effects
- Adjust responsive breakpoints

## Dependencies

- Swiper.js (for slider functionality)
- Tailwind CSS (for styling)
- React (for component rendering)

## Browser Support

The slider works in all modern browsers that support:

- ES6+ JavaScript
- CSS Grid and Flexbox
- CSS Custom Properties

## Troubleshooting

1. **Swiper not working**: Make sure you've installed the `swiper` package
2. **Images not showing**: Check that images are uploaded to the Media collection
3. **Styling issues**: Verify that Tailwind CSS is properly configured

## License

This block is part of the Payload CMS project and follows the same license terms.
