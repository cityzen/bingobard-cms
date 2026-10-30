import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { VerticalPreviewClient } from '@/components/VerticalPreviewClient'
import '../../../styles.css'

export default async function VerticalPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let doc
  try {
    doc = await payload.findByID({
      collection: 'verticals',
      id,
      depth: 2,
    })
  } catch {
    notFound()
  }

  return <VerticalPreviewClient initialData={doc} />
}
