import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
	admin: {
		useAsTitle: 'title',
	},
  slug: 'clients',
  // Client name and location only. Nothing here is sensitive, so public.
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
      required: false,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    }
  ],
}
