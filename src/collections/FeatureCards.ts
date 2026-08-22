import type { CollectionConfig } from 'payload'

export const FeatureCards: CollectionConfig = {
	admin: {
		useAsTitle: 'title',
	},
  slug: 'feature-cards',
  fields: [
	{
		name: 'type',
		type: 'select',
		options: [
			{
				label: 'Benefit',
				value: 'benefit'
			},
			{
				label: 'Type',
				value: 'type'
			}
		],
		required: true,
	},
	{
		  name: 'icon',
		  type: 'text',
		  required: true,
	},
	{
		name: 'title',
		type: 'text',
		required: true,
	  },
	{
		name: 'description',
		type: 'textarea',
		required: true,
	},
  ],
}
