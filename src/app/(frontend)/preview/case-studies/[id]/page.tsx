import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { CaseStudyPreviewClient } from '@/components/CaseStudyPreviewClient'
import '../../../styles.css'

export default async function CaseStudyPreviewPage({
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
      collection: 'case-studies',
      id,
      depth: 2,
    })
  } catch {
    notFound()
  }

  return <CaseStudyPreviewClient initialData={doc} />
}
