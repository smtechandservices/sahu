'use client';

import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Sidebar from "../components/Sidebar/Sidebar";
import { usePathname } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-gray-50`}>
        <AuthProvider>
          <div className="flex min-h-screen">
            {!isLoginPage && <Sidebar />}
            <main className={`flex-1 ${!isLoginPage ? 'ml-64 p-8' : ''}`}>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
