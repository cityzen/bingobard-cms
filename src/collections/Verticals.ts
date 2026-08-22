import type { CollectionConfig } from 'payload'

export const Verticals: CollectionConfig = {
	admin: {
		useAsTitle: 'title',
	},
  slug: 'verticals',
  fields: [
	{
		  name: 'title',
		  type: 'text',
		  required: true,
	},
	{
		name: 'heroTitle',
		type: 'text',
		required: true,
	  },
	{
		name: 'heroDescription',
		type: 'textarea',
		required: true,
	},
	{
		name: 'featureCardsBenefit',
		type: 'relationship',
		relationTo: 'feature-cards',
		filterOptions: ({ relationTo, siblingData }) => {
			  return {
				type: { equals: 'benefit' },
			  }
		  },
	  },
	  {
		  name: 'featureCardsType',
		  type: 'relationship',
		  relationTo: 'feature-cards',
		  filterOptions: ({ relationTo, siblingData }) => {
				return {
				  type: { equals: 'type' },
				}
			},
		},
  ],
}
