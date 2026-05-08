import AccommodationClient from '../../components/Accommodation/AccommodationClient';

export const metadata = {
  title: "Accommodation | Sahu Sabha",
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
};

export default function AccommodationPage() {
  return <AccommodationClient />;
}
