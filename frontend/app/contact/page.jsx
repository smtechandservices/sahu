import ContactClient from '../../components/Contact/ContactClient';

export const metadata = {
  title: 'Contact Support',
  description: 'Get in touch with the Sahu Sabha support team. We are here to help with membership queries, event coordination, and community assistance.',
  keywords: ['Sahu Sabha Contact', 'Community Support', 'Sabha Helpline', 'Member Assistance', 'Sahu Sabha Email'],
  openGraph: {
    title: 'Contact Support',
    description: 'Reach out to the Sahu Sabha support team for help with any queries.',
    url: 'https://bihartailiksahusabha.com/contact',
    siteName: 'Sahu Sabha',
    images: [
      {
        url: '/assets/logo.png',
        width: 800,
        height: 800,
        alt: 'Sahu Sabha Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
