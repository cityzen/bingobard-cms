import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
	  admin: {
		useAsTitle: 'playerName',
	  },
  slug: 'testimonials',
  // Real quotes attributed to named people, with their title and the event
  // they spoke at — not public until you decide it should be.
  access: {
    read: ({ req: { user } }) => Boolean(user),
  },
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
