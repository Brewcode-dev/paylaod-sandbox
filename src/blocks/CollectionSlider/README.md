# CollectionSlider Block

A universal content block for Payload CMS that creates beautiful, responsive sliders displaying items from any collection with dynamic field mapping.

## Features

- 🎠 Responsive slider for any collection
- 🔄 Multiple selection methods (Manual, Latest, By Category, Featured)
- 🎯 Dynamic field mapping for different collections
- 🖼️ Configurable display options (image, title, excerpt, date, category)
- ⚙️ Flexible slider settings (autoplay, navigation, pagination, etc.)
- 🎨 Multiple card styles and themes
- 📱 Mobile-friendly design
- 🔗 Automatic linking to item pages

## Supported Collections

- **Posts** - Blog posts with rich text content
- **Categories** - Category listings
- **Media** - Media library items
- **Bookings** - Booking/reservation items
- **Photos** - Photo gallery items

## Installation

1. Install the Swiper package (if not already installed):

```bash
npm install swiper
```

2. The block is already configured and ready to use in your Payload CMS.

## Usage

### In Pages Collection

The CollectionSlider block is available in the "Content" tab of the Pages collection.

### In Posts Collection

The CollectionSlider block is available in the rich text editor of Posts.

## Configuration Options

### Basic Settings

- **Title**: Optional title for the entire slider
- **Description**: Optional description text
- **Collection**: Select which collection to display (Posts, Categories, Media, Bookings, Photos)
- **Selection Method**: How to select items (see below)
- **Items Limit**: Number of items to display (for automatic selection)

### Selection Methods

#### 1. Manual Selection

- Choose specific items from the selected collection
- Full control over which items to display
- Best for curated content sections

#### 2. Latest Items

- Automatically displays the most recent items
- Configurable limit (1-20 items)
- Perfect for "Latest News" or "Recent Items" sections

#### 3. By Category

- Displays items from a specific category
- Shows the most recent items in that category
- Great for category-specific content sections

#### 4. Featured Items

- Displays items marked as featured
- Requires a featured field in your collection
- Ideal for highlighting important content

### Display Options

- **Show Image**: Display item image
- **Show Title**: Display item title
- **Show Excerpt**: Display item excerpt/description
- **Show Date**: Display publish/created date
- **Show Category**: Display category (if available)
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

## Dynamic Field Mapping

The block automatically maps fields based on the selected collection:

### Posts Collection

- Title: `title`
- Date: `publishedAt`
- Image: `heroImage`
- Slug: `slug`
- Content: `content` (rich text)

### Categories Collection

- Title: `title`
- Date: `createdAt`
- Image: `image`
- Slug: `slug`
- Content: `description`

### Media Collection

- Title: `filename`
- Date: `createdAt`
- Image: `url`
- Slug: `id`
- Content: `alt`

### Bookings Collection

- Title: `title`
- Date: `createdAt`
- Image: `image`
- Slug: `id`
- Content: `description`

### Photos Collection

- Title: `title`
- Date: `createdAt`
- Image: `url`
- Slug: `id`
- Content: `description`

## API Integration

The block automatically fetches items from your Payload API based on the selection method:

- **Manual**: Uses the selected items directly
- **Latest**: Fetches from `/api/{collection}?sort=-{dateField}&limit=X`
- **Category**: Fetches from `/api/{collection}?where[categories][in]=CATEGORY_ID&sort=-{dateField}&limit=X`
- **Featured**: Fetches from `/api/{collection}?where[featured][equals]=true&sort=-{dateField}&limit=X`

## Adding New Collections

To add support for a new collection:

1. **Update the config** in `config.ts`:

   ```typescript
   options: [
     // ... existing options
     { label: 'Your Collection', value: 'yourCollection' },
   ]
   ```

2. **Update the collectionConfig** in `Component.tsx`:

   ```typescript
   yourCollection: {
     apiPath: '/api/your-collection',
     titleField: 'title',
     dateField: 'createdAt',
     imageField: 'image',
     slugField: 'slug',
     contentField: 'description',
   }
   ```

3. **Update TypeScript types**:
   ```typescript
   collection: 'posts' | 'categories' | 'media' | 'bookings' | 'photos' | 'yourCollection'
   ```

## Customization

You can customize the appearance by modifying the `Component.tsx` file:

- Change CSS classes for different styling
- Modify the Swiper configuration
- Add custom animations or effects
- Adjust responsive breakpoints
- Customize the API endpoints
- Add new field mappings

## Dependencies

- Swiper.js (for slider functionality)
- Tailwind CSS (for styling)
- React (for component rendering)
- Payload CMS API (for item fetching)

## Browser Support

The slider works in all modern browsers that support:

- ES6+ JavaScript
- CSS Grid and Flexbox
- CSS Custom Properties
- Fetch API

## Troubleshooting

1. **Items not loading**: Check that your collection is properly configured
2. **Images not showing**: Verify that items have images uploaded
3. **Category filtering not working**: Ensure categories are properly linked to items
4. **Featured items not showing**: Add a `featured` field to your collection
5. **Styling issues**: Verify that Tailwind CSS is properly configured

## Example Use Cases

- **Latest Posts Slider**: Use Posts collection with "Latest Items" method
- **Category Gallery**: Use Photos collection with "By Category" method
- **Featured Media**: Use Media collection with "Featured Items" method
- **Booking Showcase**: Use Bookings collection with "Manual Selection" method
- **Category Navigation**: Use Categories collection with "Latest Items" method

## License

This block is part of the Payload CMS project and follows the same license terms.
