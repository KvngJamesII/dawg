import { Link } from 'react-router-dom'

export default function CookiePolicy() {
  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-semibold text-white mb-4">Cookie Policy</h1>
          <p className="text-zinc-500 mb-8">Last updated: January 27, 2026</p>

          <div className="prose prose-invert prose-zinc max-w-none">
            <div className="space-y-8 text-zinc-300">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">What Are Cookies</h2>
                <p className="text-zinc-400 leading-relaxed">
                  Cookies are small text files that are stored on your computer or mobile device when you visit our website. 
                  They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">How We Use Cookies</h2>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  IdleDeveloper uses cookies for the following purposes:
                </p>
                <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                  <li><strong className="text-zinc-300">Essential Cookies:</strong> Required for the website to function properly, including authentication and security.</li>
                  <li><strong className="text-zinc-300">Preference Cookies:</strong> Remember your settings like theme preference (light/dark mode).</li>
                  <li><strong className="text-zinc-300">Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Cookies We Use</h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-zinc-800">
                      <tr>
                        <th className="text-left p-4 text-zinc-300 font-medium">Cookie Name</th>
                        <th className="text-left p-4 text-zinc-300 font-medium">Purpose</th>
                        <th className="text-left p-4 text-zinc-300 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-400">
                      <tr className="border-b border-zinc-800/50">
                        <td className="p-4 font-mono text-xs">token</td>
                        <td className="p-4">Authentication session</td>
                        <td className="p-4">7 days</td>
                      </tr>
                      <tr className="border-b border-zinc-800/50">
                        <td className="p-4 font-mono text-xs">theme</td>
                        <td className="p-4">Theme preference</td>
                        <td className="p-4">1 year</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-xs">_ga</td>
                        <td className="p-4">Google Analytics</td>
                        <td className="p-4">2 years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Managing Cookies</h2>
                <p className="text-zinc-400 leading-relaxed">
                  Most web browsers allow you to control cookies through their settings. You can set your browser to:
                </p>
                <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4 mt-4">
                  <li>Block all cookies</li>
                  <li>Accept only first-party cookies</li>
                  <li>Delete cookies when you close your browser</li>
                  <li>Browse in "private" or "incognito" mode</li>
                </ul>
                <p className="text-zinc-400 leading-relaxed mt-4">
                  Please note that blocking cookies may affect your experience on our website and limit certain functionality.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Third-Party Cookies</h2>
                <p className="text-zinc-400 leading-relaxed">
                  We may use third-party services that set their own cookies, such as Google Analytics for website analytics. 
                  These cookies are governed by the respective third parties' privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Updates to This Policy</h2>
                <p className="text-zinc-400 leading-relaxed">
                  We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
                <p className="text-zinc-400 leading-relaxed">
                  If you have questions about our use of cookies, please contact us at{' '}
                  <a href="https://t.me/iDevSupportBot" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                    @iDevSupportBot
                  </a>{' '}
                  on Telegram.
                </p>
              </section>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              See also: <Link to="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link> · <Link to="/terms" className="text-emerald-400 hover:underline">Terms of Service</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
