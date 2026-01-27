import { Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Blog() {
  const posts = [
    {
      title: 'Introducing IdleDeveloper API Platform',
      excerpt: 'We\'re excited to announce the launch of our new API platform, designed to help developers build amazing applications faster.',
      date: 'Jan 25, 2026',
      category: 'Announcements',
      slug: 'introducing-idledeveloper'
    },
    {
      title: 'How to Download TikTok Videos Without Watermark',
      excerpt: 'Learn how to use our TikTok API to download videos in HD quality without watermarks. Complete guide with code examples.',
      date: 'Jan 24, 2026',
      category: 'Tutorials',
      slug: 'tiktok-download-guide'
    },
    {
      title: 'Building a YouTube to MP3 Converter',
      excerpt: 'Step-by-step tutorial on building your own YouTube audio extractor using our API. Includes React and Node.js examples.',
      date: 'Jan 23, 2026',
      category: 'Tutorials',
      slug: 'youtube-mp3-converter'
    },
    {
      title: 'API Best Practices: Rate Limiting & Error Handling',
      excerpt: 'Essential tips for building robust applications with our APIs. Learn about proper error handling and rate limit management.',
      date: 'Jan 22, 2026',
      category: 'Best Practices',
      slug: 'api-best-practices'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-6">Blog</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Tutorials, updates, and insights from the IdleDeveloper team.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {posts.map((post, i) => (
              <article 
                key={i} 
                className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-zinc-400 text-sm mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm text-zinc-500 group-hover:text-white transition-colors">
                  Read more <ArrowRight className="w-3 h-3" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 border-t border-zinc-900 mt-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Stay Updated</h2>
          <p className="text-zinc-400 mb-6">
            Get the latest tutorials and updates delivered to your inbox.
          </p>
          <div className="flex gap-3">
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
            <button className="bg-white text-black font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
