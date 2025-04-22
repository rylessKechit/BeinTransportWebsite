'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { User, Package, LogOut, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            TransExpress
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-800 hover:text-purple-600 transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/services"
              className="text-gray-800 hover:text-purple-600 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/vehicules"
              className="text-gray-800 hover:text-purple-600 transition-colors"
            >
              Véhicules
            </Link>
            <Link
              href="/tarifs"
              className="text-gray-800 hover:text-purple-600 transition-colors"
            >
              Tarifs
            </Link>
            <Link
              href="/contact"
              className="text-gray-800 hover:text-purple-600 transition-colors"
            >
              Contact
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center text-gray-800 hover:text-purple-600">
                  <User className="h-5 w-5 mr-2" />
                  <span>{user.firstName}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-purple-50"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Mes réservations
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-purple-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Mon profil
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Connexion
              </Link>
            )}
          </nav>

          {/* Hamburger Menu */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg mt-2">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link
              href="/"
              className="block text-gray-800 hover:text-purple-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/services"
              className="block text-gray-800 hover:text-purple-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/vehicules"
              className="block text-gray-800 hover:text-purple-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Véhicules
            </Link>
            <Link
              href="/tarifs"
              className="block text-gray-800 hover:text-purple-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tarifs
            </Link>
            <Link
              href="/contact"
              className="block text-gray-800 hover:text-purple-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center text-gray-800 hover:text-purple-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="h-5 w-5 mr-2" />
                  Mes réservations
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left text-gray-800 hover:text-purple-600 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}