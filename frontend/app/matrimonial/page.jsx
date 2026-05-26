import MatrimonialClient from '../../components/Matrimonial/MatrimonialClient';

export const metadata = {
  title: 'Matrimonial',
  description: 'Find your perfect life partner within the Sahu community. Verified profiles and trusted matches.',
  keywords: ['Sahu Matrimony', 'Community Marriage', 'Sahu Sabha Matrimonial', 'Life Partner', 'Sahu Profiles'],
  openGraph: {
    title: 'Matrimonial',
    description: 'Trusted matrimonial services for the Sahu community.',
    url: 'https://sahusabha.com/matrimonial',
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

export default function MatrimonialPage() {
  return <MatrimonialClient />;
}
