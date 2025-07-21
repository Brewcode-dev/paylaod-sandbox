# PostsSlider Block

A custom content block for Payload CMS that creates beautiful, responsive sliders displaying posts from the Posts collection with multiple selection methods.

## Features

- 🎠 Responsive slider with multiple posts
- 🔄 Multiple selection methods (Manual, Latest, By Category, Featured)
- 🖼️ Configurable display options (image, title, excerpt, date, category)
- ⚙️ Flexible slider settings (autoplay, navigation, pagination, etc.)
- 🎨 Multiple card styles and themes
- 📱 Mobile-friendly design
- 🔗 Automatic linking to post pages

## Installation

1. Install the Swiper package (if not already installed):

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

The PostsSlider block is available in the "Content" tab of the Pages collection. You can add it to your page layout alongside other content blocks.

### In Posts Collection

The PostsSlider block is available in the rich text editor of Posts. You can embed it within your post content.

## Selection Methods

### 1. Manual Selection

- Choose specific posts from the Posts collection
- Full control over which posts to display
- Best for curated content sections

### 2. Latest Posts

- Automatically displays the most recent posts
- Configurable limit (1-20 posts)
- Perfect for "Latest News" or "Recent Articles" sections

### 3. By Category

- Displays posts from a specific category
- Shows the most recent posts in that category
- Great for category-specific content sections

### 4. Featured Posts

- Displays posts marked as featured
- Requires a `featured` field in your Posts collection
- Ideal for highlighting important content

## Configuration Options

### Basic Settings

- **Title**: Optional title for the entire slider
- **Description**: Optional description text
- **Selection Method**: How to select posts (see above)
- **Posts Limit**: Number of posts to display (for automatic selection)

### Display Options

- **Show Image**: Display post hero image
- **Show Title**: Display post title
- **Show Excerpt**: Display post excerpt
- **Show Date**: Display publish date
- **Show Category**: Display post category
- **Excerpt Length**: Number of characters for excerpt (50-500)

### Slider Settings

- **Autoplay**: Enable/disable automatic sliding
- **Autoplay Delay**: Time between slides (in milliseconds)
- **Loop**: Enable/disable infinite loop
- **Navigation**: Show/hide navigation arrows
- **Pagination**: Show/hide pagination dots
- **Slides Per View**: Number of slides visible at once (1-4)
- **Space Between**: Space between slides in pixels

### Styling Options

- **Card Style**: Modern, Minimal, or Classic
- **Theme**: Light or Dark theme
- **Show Read More**: Display "Read More" button

## Card Styles

### Modern

- Clean white background with shadow
- Hover effects with enhanced shadow
- Professional appearance

### Minimal

- Light gray background with border
- Subtle hover effects
- Clean and simple design

### Classic

- White background with thick border
- Traditional card appearance
- Formal styling

## API Integration

The block automatically fetches posts from your Payload API based on the selection method:

- **Manual**: Uses the selected posts directly
- **Latest**: Fetches from `/api/posts?sort=-publishedAt&limit=X`
- **Category**: Fetches from `/api/posts?where[categories][in]=CATEGORY_ID&sort=-publishedAt&limit=X`
- **Featured**: Fetches from `/api/posts?where[featured][equals]=true&sort=-publishedAt&limit=X`

## Customization

You can customize the appearance by modifying the `Component.tsx` file:

- Change CSS classes for different styling
- Modify the Swiper configuration
- Add custom animations or effects
- Adjust responsive breakpoints
- Customize the API endpoints

## Dependencies

- Swiper.js (for slider functionality)
- Tailwind CSS (for styling)
- React (for component rendering)
- Payload CMS API (for post fetching)

## Browser Support

The slider works in all modern browsers that support:

- ES6+ JavaScript
- CSS Grid and Flexbox
- CSS Custom Properties
- Fetch API

## Troubleshooting

1. **Posts not loading**: Check that your Posts collection is properly configured
2. **Images not showing**: Verify that posts have hero images uploaded
3. **Category filtering not working**: Ensure categories are properly linked to posts
4. **Featured posts not showing**: Add a `featured` field to your Posts collection
5. **Styling issues**: Verify that Tailwind CSS is properly configured

## Example Use Cases

- **Latest News Section**: Use "Latest Posts" method to show recent articles
- **Related Posts**: Use "By Category" method to show posts from the same category
- **Featured Content**: Use "Featured Posts" method to highlight important articles
- **Curated Collection**: Use "Manual Selection" to create custom post collections

## License

This block is part of the Payload CMS project and follows the same license terms.
