import { useEffect } from 'react'

const defaultMeta = {
  title: 'IdleDeveloper API - Powerful APIs for Modern Developers',
  description: 'Build amazing applications with our suite of APIs. Download TikTok videos without watermark, extract YouTube audio, and more. Simple integration, transparent pricing.',
  image: 'https://api.idledeveloper.tech/og-image.png',
  url: 'https://api.idledeveloper.tech'
}

export default function SEO({ 
  title, 
  description, 
  image, 
  url,
  type = 'website',
  noIndex = false 
}) {
  const meta = {
    title: title ? `${title} | IdleDeveloper API` : defaultMeta.title,
    description: description || defaultMeta.description,
    image: image || defaultMeta.image,
    url: url || defaultMeta.url
  }

  useEffect(() => {
    // Update document title
    document.title = meta.title

    // Update meta tags
    const updateMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attr}="${name}"]`)
      
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, name)
        document.head.appendChild(element)
      }
      
      element.setAttribute('content', content)
    }

    // Standard meta tags
    updateMeta('description', meta.description)
    updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow')

    // Open Graph
    updateMeta('og:title', meta.title, true)
    updateMeta('og:description', meta.description, true)
    updateMeta('og:image', meta.image, true)
    updateMeta('og:url', meta.url, true)
    updateMeta('og:type', type, true)

    // Twitter
    updateMeta('twitter:title', meta.title)
    updateMeta('twitter:description', meta.description)
    updateMeta('twitter:image', meta.image)
    updateMeta('twitter:url', meta.url)

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', meta.url)

  }, [meta.title, meta.description, meta.image, meta.url, type, noIndex])

  return null
}

// Pre-defined SEO configs for common pages
export const pageSEO = {
  home: {
    title: null, // Uses default
    description: 'Build amazing applications with our suite of APIs. Download TikTok videos without watermark, extract YouTube audio, and more. Simple integration, transparent pricing, world-class reliability.',
    url: 'https://api.idledeveloper.tech'
  },
  docs: {
    title: 'Documentation',
    description: 'Complete API documentation for IdleDeveloper. Learn how to integrate TikTok video downloads, YouTube audio extraction, and more into your applications.',
    url: 'https://api.idledeveloper.tech/docs'
  },
  pricing: {
    title: 'Pricing',
    description: 'Simple, transparent pricing for IdleDeveloper API. Pay only for what you use. No subscriptions, no hidden fees. Start with 25 free credits.',
    url: 'https://api.idledeveloper.tech/pricing'
  },
  login: {
    title: 'Sign In',
    description: 'Sign in to your IdleDeveloper account to access your API keys, usage analytics, and manage your credits.',
    url: 'https://api.idledeveloper.tech/login',
    noIndex: true
  },
  register: {
    title: 'Create Account',
    description: 'Create your free IdleDeveloper account and get 25 free API credits. No credit card required.',
    url: 'https://api.idledeveloper.tech/register'
  },
  dashboard: {
    title: 'Dashboard',
    description: 'Manage your IdleDeveloper API keys, view usage analytics, and purchase credits.',
    url: 'https://api.idledeveloper.tech/dashboard',
    noIndex: true
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms of Service for IdleDeveloper API. Read our terms and conditions for using our API services.',
    url: 'https://api.idledeveloper.tech/terms'
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Privacy Policy for IdleDeveloper API. Learn how we collect, use, and protect your data.',
    url: 'https://api.idledeveloper.tech/privacy'
  },
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with the IdleDeveloper team. We\'re here to help with any questions about our API services.',
    url: 'https://api.idledeveloper.tech/contact'
  }
}
