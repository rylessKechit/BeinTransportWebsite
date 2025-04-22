'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, X, Home, Package, Truck, Phone, 
  User, LogOut, CreditCard, MapPin
} from 'lucide-react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Fermer le menu quand le chemin change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Fermer le menu si la fenêtre est redimensionnée
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Liens du menu principal
  const mainLinks = [
    { name: 'Accueil', href: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Services', href: '/services', icon: <Package className="h-5 w-5" /> },
    { name: 'Véhicules', href: '/vehicules', icon: <Truck className="h-5 w-5" /> },
    { name: 'Tarifs', href: '/tarifs', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'Contact', href: '/contact', icon: <Phone className="h-5 w-5" /> },
  ];

  // Liens utilisateur (si connecté)
  const userLinks = [
    { name: 'Tableau de bord', href: '/dashboard', icon: <User className="h-5 w-5" /> },
    { name: 'Mes réservations', href: '/bookings', icon: <Package className="h-5 w-5" /> },
    { name: 'Nouvelle réservation', href: '/reservation', icon: <Truck className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Bouton d'ouverture du menu */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-white shadow-md"
        aria-label="Menu"
      >
        {isOpen ? <X className="h-6 w-6 text-gray-800" /> : <Menu className="h-6 w-6 text-gray-800" />}
      </button>

      {/* Overlay sombre lorsque le menu est ouvert */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Menu mobile */}
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-xl transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* En-tête du menu */}
          <div className="p-4 border-b border-gray-200">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              Bein Transports
            </Link>
          </div>

          {/* Section utilisateur si connecté */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Liens principaux */}
          <nav className="p-4 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Navigation</p>
            <ul className="space-y-1">
              {mainLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center p-3 rounded-lg ${
                      pathname === link.href
                        ? 'bg-purple-50 text-purple-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={toggleMenu}
                  >
                    {link.icon}
                    <span className="ml-3">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Liens utilisateur si connecté */}
          {user && (
            <nav className="p-4 border-b border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Espace client</p>
              <ul className="space-y-1">
                {userLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center p-3 rounded-lg ${
                        pathname === link.href
                          ? 'bg-purple-50 text-purple-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={toggleMenu}
                    >
                      {link.icon}
                      <span className="ml-3">{link.name}</span>
                    </Link>
                  </li>
                ))}

                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-3 w-full text-left rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="ml-3">Déconnexion</span>
                  </button>
                </li>
              </ul>
            </nav>
          )}

          {/* Actions si non connecté */}
          {!user && (
            <div className="p-4 border-b border-gray-200">
              <Link
                href="/auth/login"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg text-center mb-3"
                onClick={toggleMenu}
              >
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="block w-full bg-white hover:bg-gray-50 text-gray-700 py-2 px-6 rounded-lg text-center border border-gray-300"
                onClick={toggleMenu}
              >
                Inscription
              </Link>
            </div>
          )}

          {/* Informations de contact */}
          <div className="p-4 mt-auto">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Contact</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-0.5 text-purple-600" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-purple-600" />
                <span>123 Rue du Transport, 75000 Paris</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}