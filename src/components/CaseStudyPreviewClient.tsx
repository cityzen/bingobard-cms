'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { CaseStudy, Testimonial } from '@/payload-types'

function getQuoteText(testimonial: Testimonial): string {
  const paragraphs: any[] = testimonial.testimonial?.root?.children ?? []
  return paragraphs
    .map((node) =>
      ((node.children ?? []) as { text?: string }[])
        .map((child) => child.text ?? '')
        .join(''),
    )
    .join('\n\n')
}

export function CaseStudyPreviewClient({ initialData }: { initialData: CaseStudy }) {
  const { data } = useLivePreview<CaseStudy>({
    initialData,
    serverURL: typeof window !== 'undefined' ? window.location.origin : '',
    depth: 2,
  })

  const client = typeof data.client === 'object' ? data.client : null
  const event = typeof data.event === 'object' ? data.event : null

  return (
    <article className="preview case-study-preview">
      <p className="eyebrow">
        {client?.title}
        {event ? ` · ${event.title}` : ''}
      </p>
      <h1>{data.title}</h1>

      {data.snapshot && data.snapshot.length > 0 && (
        <dl className="snapshot">
          {data.snapshot.map((row, i) => (
            <div key={row.id ?? i}>
              <dt>{row.title}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {data.challenge && (
        <section>
          <h2>The Challenge</h2>
          <RichText data={data.challenge} />
        </section>
      )}

      {data.solution && (
        <section>
          <h2>The Solution</h2>
          <RichText data={data.solution} />
        </section>
      )}

      {data.results && data.results.length > 0 && (
        <section>
          <h2>The Results</h2>
          <table>
            <tbody>
              {data.results.map((row, i) => (
                <tr key={row.id ?? i}>
                  <td>{row.metric}</td>
                  <td>{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {data.testimonials && data.testimonials.length > 0 && (
        <section className="testimonials">
          <h2>In Their Words</h2>
          {data.testimonials
            .filter((t): t is Testimonial => typeof t === 'object')
            .map((testimonial) => (
              <blockquote key={testimonial.id}>
                <p>&ldquo;{getQuoteText(testimonial)}&rdquo;</p>
                <footer>
                  {testimonial.playerName}
                  {testimonial.playerTitle ? `, ${testimonial.playerTitle}` : ''}
                </footer>
              </blockquote>
            ))}
        </section>
      )}
    </article>
  )
}
