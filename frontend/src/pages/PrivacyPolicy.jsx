import SEO, { pageSEO } from '../components/SEO'

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#09090b] text-zinc-300 min-h-screen">
      <SEO {...pageSEO.privacy} />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-zinc-500">Last updated: January 26, 2026</p>
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-strong:text-white">
          <p>
            IdleDeveloper ("us", "we", or "our") operates the https://api.idledeveloper.tech website and the
            IdleDeveloper API (the "Service").
          </p>

          <p>
            This page informs you of our policies regarding the collection, use, and disclosure of personal
            data when you use our Service and the choices you have associated with that data.
          </p>

          <p>
            We use your data to provide and improve the Service. By using the Service, you agree to the
            collection and use of information in accordance with this policy.
          </p>

          <h2>1. Information Collection and Use</h2>
          <p>
            We collect several different types of information for various purposes to provide and improve our
            Service to you.
          </p>

          <h3>Types of Data Collected</h3>
          <h4>Personal Data</h4>
          <p>
            While using our Service, we may ask you to provide us with certain personally identifiable
            information that can be used to contact or identify you ("Personal Data"). Personally
            identifiable information may include, but is not limited to:
          </p>
          <ul>
            <li>Email address</li>
            <li>Full name</li>
            <li>Usage Data</li>
          </ul>

          <h4>Usage Data</h4>
          <p>
            We may also collect information on how the Service is accessed and used ("Usage Data"). This
            Usage Data may include information such as your computer's Internet Protocol address (e.g. IP
            address), browser type, browser version, the pages of our Service that you visit, the time and
            date of your visit, the time spent on those pages, unique device identifiers, and other
            diagnostic data.
          </p>

          <h4>API Request Data</h4>
          <p>
            When you make requests to our API, we log the request details, including your API key, the
            endpoint accessed, the timestamp, and the status of the request. We do not store the content
            (e.g., video URLs) you process through the API.
          </p>

          <h2>2. Use of Data</h2>
          <p>IdleDeveloper uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To provide analysis or valuable information so that we can improve the Service</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>

          <h2>3. Data Storage and Security</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over
            the Internet, or method of electronic storage is 100% secure. While we strive to use commercially
            acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
          <p>
            Your account password is encrypted and we do not have access to it. Your API keys are stored
            securely and are only accessible to you.
          </p>

          <h2>4. Service Providers</h2>
          <p>
            We may employ third-party companies and individuals to facilitate our Service ("Service
            Providers"), to provide the Service on our behalf, to perform Service-related services or to
            assist us in analyzing how our Service is used.
          </p>
          <ul>
            <li>
              <strong>Paystack:</strong> We use Paystack for payment processing. Their Privacy Policy can be
              viewed at <a href="https://paystack.com/terms" target="_blank" rel="noopener noreferrer">https://paystack.com/terms</a>.
            </li>
            <li>
              <strong>Google (for OAuth):</strong> We use Google for authentication. Their Privacy Policy can be
              viewed at <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>.
            </li>
          </ul>

          <h2>5. Children's Privacy</h2>
          <p>
            Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly
            collect personally identifiable information from anyone under the age of 13. If you are a parent
            or guardian and you are aware that your Children has provided us with Personal Data, please
            contact us. If we become aware that we have collected Personal Data from children without
            verification of parental consent, we take steps to remove that information from our servers.
          </p>

          <h2>6. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting
            the new Privacy Policy on this page.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this
            Privacy Policy are effective when they are posted on this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@idledeveloper.tech
            or via Telegram at <a href="https://t.me/theidledeveloper" target="_blank" rel="noopener noreferrer">@theidledeveloper</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
