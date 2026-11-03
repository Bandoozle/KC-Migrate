import type { Metadata } from "next";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { PRIVACY_POLICY_OPEN_ITEMS, PRIVACY_POLICY_PATH, PRIVACY_POLICY_PUBLISHED } from "@/lib/privacy-policy";
import { canonicalUrl } from "@/lib/site";
import styles from "./PrivacyPolicy.module.css";

const TITLE = "Privacy Policy | Kosick Communications";
const DESCRIPTION =
  "How Kosick Communications collects, uses and protects personal information submitted through kosick.com, including forms, the chat assistant and analytics.";

export function generateMetadata(): Metadata {
  const url = canonicalUrl(PRIVACY_POLICY_PATH);
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: url },
    robots: PRIVACY_POLICY_PUBLISHED ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { type: "website", siteName: "Kosick Communications", title: TITLE, description: DESCRIPTION, url },
  };
}

const EMAIL = "info@kosick.com";

/* Every statement below describes what the site verifiably does; open points are listed in PRIVACY_POLICY_OPEN_ITEMS */
export default function PrivacyPolicyPage() {
  return (
    <main>
      <InternalPageHero plain compact eyebrow="Kosick Communications" titlePrimary="Privacy" titleSecondary="Policy" />

      <div className={styles.body}>
        {PRIVACY_POLICY_PUBLISHED ? null : (
          <aside className={styles.draft} role="note">
            <strong>Draft for review: not yet published</strong>
            This page is hidden from search engines and not linked from the site. Before it is published, Kosick needs
            to confirm:
            <ul>
              {PRIVACY_POLICY_OPEN_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        )}

        <article className={styles.prose}>
          <h2>Who we are</h2>
          <p>
            This policy explains how Kosick Communications Ltd (&ldquo;Kosick&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;),
            a marketing agency with teams in Vancouver and Calgary, handles personal information collected through
            kosick.com. Questions about this policy can be sent to <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or by calling{" "}
            <a href="tel:+16049255800">604-925-5800</a>.
          </p>

          <h2>Information we collect and why</h2>

          <h3>Contact form</h3>
          <p>
            When you send us a message, we collect your name, email address, phone number, company (optional) and
            message, along with the page you sent it from. We use this to reply to your enquiry. Our team receives your
            message by email, and we may send you an email confirming we received it.
          </p>

          <h3>Newsletter</h3>
          <p>
            When you sign up for our newsletter, we collect your email address and the page you signed up from, and use
            them to send you our newsletter.
          </p>

          <h3>Chat assistant</h3>
          <p>
            Our website chat answers questions using an artificial intelligence model provided by Anthropic. The
            messages you type are sent to our chat system to generate replies. Please do not share sensitive personal
            information in the chat. If you choose to send your details through the chat&rsquo;s contact form, we
            collect your name, company, email address, phone number and message, together with the chat conversation
            and the page you were on, so our team can follow up with you.
          </p>

          <h3>Spam and abuse protection</h3>
          <p>
            To protect our forms from spam and abuse, we store a one-way coded version (a hash) of your IP address with
            each form submission instead of the address itself. These codes are deleted after 90 days.
          </p>

          <h3>Analytics and advertising measurement</h3>
          <p>
            We use Google Analytics to understand how visitors use our website, and Google Ads conversion tracking to
            measure whether our advertising leads to enquiries. These tools use cookies and similar technologies. When
            you submit a form, Google Ads enhanced conversions may share a hashed (coded) version of the contact details
            you entered with Google, which Google uses to match the enquiry to an ad interaction. Learn more about{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              how Google uses information from sites that use its services
            </a>
            , or manage your ad preferences at{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              adssettings.google.com
            </a>
            .
          </p>

          <h3>Embedded videos</h3>
          <p>
            Some pages include videos hosted by Vimeo or YouTube. When you view or play them, those services may collect
            information under their own privacy policies.
          </p>

          <h3>Information stored in your browser</h3>
          <p>
            The chat keeps your current conversation in your browser&rsquo;s session storage so it is not lost as you move
            between pages. It is cleared when you close the browser tab.
          </p>

          <h2>Service providers</h2>
          <p>We use trusted service providers to run this website and handle the information described above:</p>
          <ul>
            <li>Vercel, which hosts the website;</li>
            <li>Cloudflare, which provides our domain and network security services;</li>
            <li>Supabase, which stores contact form and newsletter submissions;</li>
            <li>Resend, which delivers form notification and confirmation emails;</li>
            <li>WordPress hosting, which runs our chat system and stores chat leads;</li>
            <li>Anthropic, which provides the AI model behind the chat assistant; and</li>
            <li>Google, which provides analytics and advertising measurement.</li>
          </ul>
          <p>These providers process information on our behalf, and some of them are located outside Canada.</p>

          <h2>How long we keep information</h2>
          <ul>
            <li>Contact form submissions are deleted from our form database after 24 months.</li>
            <li>The coded IP addresses stored for spam protection are deleted after 90 days.</li>
            <li>Newsletter sign-ups are kept until you unsubscribe.</li>
          </ul>

          <h2>Your choices</h2>
          <p>
            You can ask to see, correct or delete the personal information we hold about you, or withdraw from our
            newsletter, by emailing <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. You can also block or delete cookies in
            your browser settings.
          </p>

          <h2>Changes to this policy</h2>
          <p>We may update this policy from time to time. The current version is always posted on this page.</p>
        </article>
      </div>
    </main>
  );
}
