import CareerClient from '../../components/Career/CareerClient';

export const metadata = {
  title: "Career Portal",
  description:
    "Explore job opportunities posted by Sahu Sabha community members. Find full-time, part-time, and remote roles across India.",
  keywords: [
    "Sahu Sabha Jobs",
    "Career Portal",
    "Community Jobs",
    "Job Opportunities",
    "Advertisement Showcase",
    "Local Business",
  ],
  openGraph: {
    title: "Career Portal",
    description:
      "Explore job opportunities and advertise your business on the Sahu Sabha community portal.",
    url: "https://sahusabha.com/career",
    siteName: "Sahu Sabha",
    images: [
      {
        url: "/assets/logo.png",
        width: 800,
        height: 800,
        alt: "Sahu Sabha Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function CareerPage() {
  return <CareerClient />;
}
