'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import React from 'react'

import type { Vertical } from '@/payload-types'

type CardLike = {
  id?: string | null
  icon?: string | null
  description: string
} & ({ benefit: string } | { use: string })

function CardGroup({ groupTitle, cards }: { groupTitle: string; cards: CardLike[] | null | undefined }) {
  return (
    <div className="feature-card-group">
      <h3>{groupTitle}</h3>
      {cards && cards.length > 0 ? (
        <div className="feature-cards">
          {cards.map((card, i) => (
            <div className="feature-card" key={card.id ?? i}>
              {card.icon && <span className="icon">{card.icon}</span>}
              <h4>{'benefit' in card ? card.benefit : card.use}</h4>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty">No cards yet</p>
      )}
    </div>
  )
}

export function VerticalPreviewClient({ initialData }: { initialData: Vertical }) {
  const { data } = useLivePreview<Vertical>({
    initialData,
    serverURL: typeof window !== 'undefined' ? window.location.origin : '',
    depth: 2,
  })

  return (
    <article className="preview vertical-preview">
      <p className="eyebrow">{data.title}</p>
      <h1>{data.heroTitle}</h1>
      <p className="hero-description">{data.heroDescription}</p>

      <CardGroup groupTitle={data.benefits?.title ?? 'Benefits'} cards={data.benefits?.benefitCards} />
      <CardGroup groupTitle={data.types?.title ?? 'Types'} cards={data.types?.useCards} />
    </article>
  )
}
