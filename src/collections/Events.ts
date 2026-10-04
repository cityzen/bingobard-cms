import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
	admin: {
		useAsTitle: 'title',
	},
  slug: 'events',
  // Events are public marketing content; no testimonial or logo data here.
  access: {
    read: () => true,
  },
  fields: [
	{
		name: 'title',
		type: 'text',
		required: true,
	},
    {
	  	name: 'location',
	  	type: 'text',
	  	required: true,
	},
    {
	  	name: 'client',
      type: 'relationship',
      relationTo: 'clients',
	},
	{
		name: 'startDate',
		type: 'date',
		required: true,
  	},
	{
		name: 'endDate',
		type: 'date',
		required: true,
	},
  ],
}
