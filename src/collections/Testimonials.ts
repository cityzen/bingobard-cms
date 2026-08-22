import type { CollectionConfig } from 'payload'

const QuoteBlock: Block = {
  slug: 'Quote', // required
  imageURL: 'https://google.com/path/to/image.jpg',
  imageAltText: 'A nice thumbnail image to show what this block looks like',
  interfaceName: 'QuoteBlock', // optional
  fields: [
	// required
	{
	  name: 'quoteHeader',
	  type: 'text',
	  required: true,
	},
	{
	  name: 'quoteText',
	  type: 'text',
	},
  ],
}

export const Testimonials: CollectionConfig = {
	  admin: {
		useAsTitle: 'playerName',
	  },
  slug: 'testimonials',
  fields: [
	{
		name: 'playerName',
		type: 'text',
		required: true,
	},
	{
		  name: 'playerTitle',
		  type: 'text',
		  required: false,
	},
	{
		name: 'event',
		type: 'relationship',
		relationTo: 'events',
	  },
	{
		name: 'testimonial',
		type: 'richText',
		required: true,
	},
  ],
}
