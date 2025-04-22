import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white">
              Bein Transports
            </Link>
            <p className="mt-4 text-gray-400">
              Votre partenaire de confiance pour tous vos besoins de transport et déménagement.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semigbold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/vehicules" className="text-gray-400 hover:text-white transition-colors">
                  Véhicules
                </Link>
              </li>
              <li>
                <Link href="/reservation" className="text-gray-400 hover:text-white transition-colors">
                  Réservation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations de contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-500" />
                <span className="text-gray-400">123 Rue du Transport, 75000 Paris</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-purple-500" />
                <a href="tel:0123456789" className="text-gray-400 hover:text-white transition-colors">
                  01 23 45 67 89
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-purple-500" />
                <a href="mailto:contact@transexpress.fr" className="text-gray-400 hover:text-white transition-colors">
                  contact@transexpress.fr
                </a>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-purple-600 p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-purple-600 p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-purple-600 p-2 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-6">
              <h4 className="font-medium mb-2">Inscrivez-vous à notre newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="px-4 py-2 w-full bg-gray-800 text-white rounded-l-lg focus:outline-none"
                />
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-lg transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Bein Transports. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}