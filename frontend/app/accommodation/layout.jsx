export const metadata = {
  title: "Accommodation",
  description:
    "Access well-maintained community facilities provided by Sahu Sabha. Reserve halls for events, book hostel stays for students, or find temporary guest room accommodations.",
  keywords: [
    "Sahu Sabha Accommodation",
    "Hostel",
    "Community Hall",
    "Guest Rooms",
    "Sabha Atithi Griha",
    "Heritage Grand Hall",
    "Sahu Vidyarthi Bhavan",
  ],
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
  openGraph: {
    title: "Accommodation | Sahu Sabha",
    description:
      "Explore community hostel, guest room, and hall booking services provided by Sahu Sabha for its members across India.",
    url: "https://sahusabha.com/accommodation",
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
    title: "Accommodation | Sahu Sabha",
    description:
      "Explore community hostel, guest room, and hall booking services provided by Sahu Sabha for its members across India.",
    images: ["/assets/logo.png"],
  },
};

export default function AccommodationLayout({ children }) {
  return <>{children}</>;
}
