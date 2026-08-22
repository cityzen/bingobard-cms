import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  fields: [
	{
		name: 'Player Name',
		type: 'text',
		required: true,
	},
	{
		  name: 'Player Title',
		  type: 'text',
		  required: false,
	},
	{
		name: 'Event',
		type: 'relationship',
		relationTo: 'events',
	  },
	{
		name: 'Testimonial',
		type: 'richText',
		required: true,
	},
  ],
}
