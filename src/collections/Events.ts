import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
	admin: {
		useAsTitle: 'title',
	},
  slug: 'events',
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
