import NewsClient from '../../components/News/NewsClient';

export const metadata = {
  title: 'Community News',
  description: 'Stay informed with the latest news, announcements, and updates from the Sahu Sabha community across India.',
  keywords: ['Sahu Sabha News', 'Community Updates', 'Sabha Announcements', 'Sahu Heritage', 'India Community'],
  openGraph: {
    title: 'Community News',
    description: 'Latest news and announcements from the Sahu Sabha community.',
    url: 'https://bihartailiksahusabha.com/news',
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

export default function NewsPage() {
  return <NewsClient />;
}
