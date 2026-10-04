import type { CollectionConfig } from 'payload'

export const CaseStudies: CollectionConfig = {
	admin: {
		useAsTitle: 'title',
	},
	slug: 'case-studies',
	access: {
		read: () => true,
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true,
		},
		// Snapshot
		{
			name: 'client',
			type: 'relationship',
			relationTo: 'clients',
			hasMany: false,
			required: true,
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      hasMany: false,
      required: true,
      filterOptions: ({ siblingData }) => {
        const clientId = (siblingData as { client?: number | string })?.client
        if (!clientId) {
          return false
        }
        return {
          client: { equals: clientId },
        }
      },
    },
		// Narrative sections
		{
			name: 'challenge',
			type: 'richText',
			required: true,
		},
		{
			name: 'solution',
			type: 'richText',
			required: true,
		},
		{
			name: 'snapshot',
			type: 'array',
			fields: [
				{
					name: 'title',
					type: 'text',
					required: true,
				},
				{
					name: 'value',
					type: 'text',
					required: true,
				},
			],
		},
		{
			name: 'results',
			type: 'array',
			fields: [
				{
					name: 'metric',
					type: 'text',
					required: true,
				},
				{
					name: 'result',
					type: 'text',
					required: true,
				},
			],
		},
		// In their words
		{
			name: 'testimonials',
			type: 'relationship',
			relationTo: 'testimonials',
			hasMany: true,
			validate: (value) => {
				if (Array.isArray(value) && value.length > 10) {
					return 'You can select up to 10 testimonials.'
				}
				return true
			},
		},
	],
}
