import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  fields: [
	{
		name: 'Event Title',
		type: 'text',
		required: true,
	},
    {
	  	name: 'Event Location',
	  	type: 'text',
	  	required: true,
	},
	{
		name: 'Event Start Date',
		type: 'date',
		required: true,
  	},
	{
		name: 'Event End Date',
		type: 'date',
		required: true,
	},
  ],
}
