import type { CollectionConfig } from 'payload'

export const Verticals: CollectionConfig = {
	admin: {
		useAsTitle: 'title',
	},
  slug: 'verticals',
  // Nested testimonials are not populated here, so this is safe to expose.
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
		name: 'heroTitle',
		type: 'textarea',
		required: true,
	  },
	{
		name: 'heroDescription',
		type: 'textarea',
		required: true,
	},
	{
      name: 'benefits',
      type: 'group', // required
      interfaceName: 'Benefits', // optional
      fields: [
        // required
        {
          name: 'title',
          type: 'textarea',
          required: true
        },
        {
		name: 'benefitCards',
		type: 'array',
		fields: [
		{
			name: 'icon',
			type: 'text',
			required: false,
		},
			{
				name: 'benefit',
				type: 'text',
				required: true,
			},
			{
				name: 'description',
				type: 'text',
				required: true,
			},
		],
	},
      ],
    },

    {
         name: 'types',
         type: 'group', // required
         interfaceName: 'Types', // optional
         fields: [
           // required
           {
             name: 'title',
             type: 'textarea',
             required: true
           },
		{
name: 'useCards',
type: 'array',
fields: [
{
name: 'icon',
type: 'text',
required: false,
},
{
name: 'use',
type: 'text',
required: true,
},
{
name: 'description',
type: 'text',
required: true,
},
],
},
         ],
       },



  ],
}
