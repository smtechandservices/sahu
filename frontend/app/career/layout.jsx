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
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
  openGraph: {
    title: "Career Portal | Sahu Sabha",
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
  twitter: {
    card: "summary_large_image",
    title: "Career Portal | Sahu Sabha",
    description:
      "Explore job opportunities and advertise your business on the Sahu Sabha community portal.",
    images: ["/assets/logo.png"],
  },
};

export default function CareerLayout({ children }) {
  return <>{children}</>;
}
