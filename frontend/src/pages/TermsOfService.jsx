import SEO, { pageSEO } from '../components/SEO'

export default function TermsOfService() {
  return (
    <div className="bg-[#09090b] text-zinc-300 min-h-screen">
      <SEO {...pageSEO.terms} />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-zinc-500">Last updated: January 26, 2026</p>
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-strong:text-white">
          <p>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the
            https://api.idledeveloper.tech website and the IdleDeveloper API (the "Service") operated by
            IdleDeveloper ("us", "we", or "our").
          </p>

          <p>
            Your access to and use of the Service is conditioned on your acceptance of and compliance with
            these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <p>
            By accessing or using the Service you agree to be bound by these Terms. If you disagree
            with any part of the terms then you may not access the Service.
          </p>

          <h2>1. Accounts</h2>
          <p>
            When you create an account with us, you must provide us with information that is accurate, complete,
            and current at all times. Failure to do so constitutes a breach of the Terms, which may result in
            immediate termination of your account on our Service.
          </p>
          <p>
            You are responsible for safeguarding the password and API keys that you use to access the Service
            and for any activities or actions under your password and API keys. You agree not to disclose your
            password or API keys to any third party. You must notify us immediately upon becoming aware of any
            breach of security or unauthorized use of your account.
          </p>

          <h2>2. API Usage</h2>
          <p>
            We grant you a limited, non-exclusive, non-transferable license to use our APIs for your
            personal or commercial projects, subject to these Terms and the limitations of your purchased
            credit plan.
          </p>
          <p>
            You agree not to use the Service for any illegal or unauthorized purpose. You must not, in the
            use of the Service, violate any laws in your jurisdiction (including but not limited to copyright
            laws).
          </p>
          <p>
            We reserve the right to temporarily or permanently suspend your access to the API if we determine
            that you are abusing the service, such as by making an excessive number of requests that harm the
            stability of our systems.
          </p>

          <h2>3. Purchases and Payments</h2>
          <p>
            If you wish to purchase credits for the Service, you may be asked to supply certain information
            relevant to your Purchase including, without limitation, your credit card number, the expiration
            date of your credit card, and your billing address. All payments are processed through our secure
            third-party payment processor, Paystack.
          </p>
          <p>
            Credits purchased are non-refundable. Credits do not expire.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding content provided by users), features, and
            functionality are and will remain the exclusive property of IdleDeveloper and its licensors.
            The Service is protected by copyright, trademark, and other laws of both Nigeria and foreign
            countries.
          </p>

          <h2>5. Links To Other Web Sites</h2>
          <p>
            Our Service may contain links to third-party web sites or services that are not owned or
            controlled by IdleDeveloper.
          </p>
          <p>
            IdleDeveloper has no control over, and assumes no responsibility for, the content, privacy
            policies, or practices of any third-party web sites or services. You further acknowledge and
            agree that IdleDeveloper shall not be responsible or liable, directly or indirectly, for any
            damage or loss caused or alleged to be caused by or in connection with use of or reliance on any
            such content, goods or services available on or through any such web sites or services.
          </p>

          <h2>6. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any
            reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate
            your account, you may simply discontinue using the Service.
          </p>

          <h2>7. Limitation Of Liability</h2>
          <p>
            In no event shall IdleDeveloper, nor its directors, employees, partners, agents, suppliers, or
            affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
            resulting from (i) your access to or use of or inability to access or use the Service; (ii) any
            conduct or content of any third party on the Service; (iii) any content obtained from the Service;
            and (iv) unauthorized access, use or alteration of your transmissions or content, whether based
            on warranty, contract, tort (including negligence) or any other legal theory, whether or not we
            have been informed of the possibility of such damage, and even if a remedy set forth herein is
            found to have failed of its essential purpose.
          </p>

          <h2>8. Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS
            AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or
            implied, including, but not limited to, implied warranties of merchantability, fitness for a
            particular purpose, non-infringement or course of performance.
          </p>
          <p>
            IdleDeveloper does not warrant that a) the Service will function uninterrupted, secure or
            available at any particular time or location; b) any errors or defects will be corrected; c) the
            Service is free of viruses or other harmful components; or d) the results of using the Service
            will meet your requirements.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of Nigeria, without
            regard to its conflict of law provisions.
          </p>

          <h2>10. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
            revision is material we will try to provide at least 30 days' notice prior to any new terms
            taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@idledeveloper.tech or
            via Telegram at <a href="https://t.me/theidledeveloper" target="_blank" rel="noopener noreferrer">@theidledeveloper</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
