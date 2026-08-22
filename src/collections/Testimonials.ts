import type { CollectionConfig } from 'payload'

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
