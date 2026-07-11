import { useNavigate } from 'react-router-dom';
import './Privacy.css';

const LAST_UPDATED = 'June 2026';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <button className="privacy-back" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-updated">Last updated: {LAST_UPDATED}</p>
      </header>

      <main className="privacy-body">
        <section>
          <h2>Overview</h2>
          <p>
            Localese ("we", "our", "the app") is a language-learning app built for
            Indian heritage learners. We take privacy seriously. This policy explains
            what data we collect, why, and how we protect it.
          </p>
        </section>

        <section>
          <h2>What we collect</h2>
          <p><strong>Nothing personally identifiable.</strong> Localese does not require
          you to create an account. We do not collect your name, email address,
          phone number, or any identifying information.</p>

          <p><strong>Learning progress</strong> — your lesson completions, XP, and
          streak data are stored <em>locally on your device</em> using the browser's
          localStorage API. This data never leaves your device and is not sent to our
          servers.</p>

          <p><strong>Analytics (aggregate only)</strong> — we use Plausible Analytics,
          a privacy-friendly analytics tool that does not use cookies and does not
          track individuals. We see page views and feature usage in aggregate form only.
          No personal data is collected by Plausible.
          <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer">
            Read Plausible's data policy →
          </a>
          </p>

          <p><strong>Subscription payments</strong> — if you purchase a premium
          subscription, payments are processed by Apple (App Store) or Google
          (Play Store). We use RevenueCat to manage subscription state. RevenueCat
          receives a pseudonymous device identifier but not your payment details.
          <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer">
            Read RevenueCat's privacy policy →
          </a>
          </p>
        </section>

        <section>
          <h2>Audio files</h2>
          <p>
            All audio in Localese is pre-generated using Google Cloud Text-to-Speech
            and stored as static files. When you tap the speaker button, your device
            fetches a static MP3 file — no text or user data is sent to Google.
          </p>
        </section>

        <section>
          <h2>Children's privacy</h2>
          <p>
            Localese is designed for adult learners (18+). We do not knowingly collect
            any information from children under 13. If you believe a child has used
            the app and provided personal data, please contact us and we will address
            it promptly.
          </p>
        </section>

        <section>
          <h2>Data retention and deletion</h2>
          <p>
            Since all progress data is stored locally on your device, you can delete
            it at any time by clearing your browser's localStorage or uninstalling
            the app. We have no copy of this data on our servers.
          </p>
        </section>

        <section>
          <h2>Changes to this policy</h2>
          <p>
            We may update this policy as the app evolves. We will note the "Last
            updated" date above. Continued use of the app after changes constitutes
            acceptance of the new policy.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about this policy? Email us at{' '}
            <a href="mailto:bandyopadhyay.archishman@gmail.com">
              bandyopadhyay.archishman@gmail.com
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
