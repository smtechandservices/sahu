import DonateClient from '../../components/Donate/DonateClient';

export const metadata = {
  title: 'Donate & Support',
  description: 'Support the Sahu community through collective giving. Your contributions help in education, hostel maintenance, and community welfare.',
  keywords: ['Sahu Sabha Donation', 'Community Support', 'Charity', 'Sahu Welfare Fund', 'Sahu Scholarships'],
  openGraph: {
    title: 'Donate & Support',
    description: 'Empowering the Sahu community through collective giving.',
    url: 'https://sahusabha.com/donate',
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

export default function DonatePage() {
  return <DonateClient />;
}
