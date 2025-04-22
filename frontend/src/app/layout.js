import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/responsive.css"; 

import { AuthProvider } from '../context/AuthContext';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import MobileBottomNav from '../components/ui/MobileBottomNav';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'TransExpress - Service de transport et déménagement',
  description: 'Réservez votre véhicule de transport ou déménagement rapidement et simplement.',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-16 md:pt-20">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}