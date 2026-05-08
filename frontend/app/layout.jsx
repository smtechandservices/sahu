import "./globals.css";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "Sahu Sabha",
    template: "%s | Sahu Sabha"
  },
  description: "Official portal of Sahu Sabha. Connecting the community through heritage, matrimonial services, career support, and more.",
  keywords: ["Sahu Sabha", "Community", "Heritage", "Matrimonial", "Career Support", "Social Welfare", "Culture"],
  authors: [{ name: "Sahu Sabha Digital Team" }],
  creator: "Sahu Sabha",
  publisher: "Sahu Sabha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Sahu Sabha",
    description: "Official portal of Sahu Sabha. Connecting the community through heritage, matrimonial services, career support, and more.",
    url: "https://sahusabha.com",
    siteName: "Sahu Sabha",
    images: [
      {
        url: "/assets/logo.png",
        width: 800,
        height: 800,
        alt: "Sahu Sabha logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sahu Sabha",
    description: "Official portal of Sahu Sabha. Connecting the community through heritage, matrimonial services, career support, and more.",
    images: ["/assets/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { AuthProvider } from "../context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
