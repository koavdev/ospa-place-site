import { useHead } from '@unhead/vue'

const SITE = 'https://ospa.com.br'
const ORG_REF = `${SITE}/#organization`
const DEFAULT_OG_IMAGE = `${SITE}/logos/ospa-og.jpg`

/**
 * Centraliza title/description/canonical/OG/Twitter + JSON-LD por pagina.
 * O canonical e computado a partir de canonicalPath (aceita tambem aliases:
 * a pagina renderizada em /capital pode ter canonicalPath: '/ospa-capital'
 * e apontar o link rel=canonical para a versao preferida).
 */
export function usePageHead({ title, description, canonicalPath, jsonLd, ogImage = DEFAULT_OG_IMAGE }) {
  const canonical = `${SITE}${canonicalPath}`
  const scripts = []
  if (jsonLd) {
    const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
    for (const block of blocks) {
      scripts.push({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(block),
      })
    }
  }
  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: ogImage },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    link: [
      { rel: 'canonical', href: canonical },
    ],
    script: scripts,
  })
}

export function breadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE}${it.url}`,
    })),
  }
}

export function service({ name, description, serviceType, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    url: url ? (url.startsWith('http') ? url : `${SITE}${url}`) : undefined,
    provider: { '@id': ORG_REF },
    areaServed: { '@type': 'Country', name: 'Brasil' },
  }
}
