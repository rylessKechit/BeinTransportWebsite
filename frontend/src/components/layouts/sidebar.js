'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Package, Truck, User, CreditCard, Settings, 
  ChevronLeft, ChevronRight, LogOut, HelpCircle, 
  Bell, BarChart, X
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Fermer le menu mobile quand le chemin change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Fermer le menu mobile si la fenêtre est redimensionnée
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Liens du menu principal
  const mainLinks = [
    { name: 'Accueil', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Réservations', href: '/bookings', icon: <Package className="h-5 w-5" /> },
    { name: 'Véhicules', href: '/vehicules', icon: <Truck className="h-5 w-5" /> },
    { name: 'Paiements', href: '/payments', icon: <CreditCard className="h-5 w-5" /> },
  ];

  // Liens administrateur (affichés uniquement pour les admins)
  const adminLinks = [
    { name: 'Tableau de bord', href: '/admin', icon: <BarChart className="h-5 w-5" /> },
    { name: 'Utilisateurs', href: '/admin/users', icon: <User className="h-5 w-5" /> },
  ];

  // Autres liens
  const otherLinks = [
    { name: 'Profil', href: '/profile', icon: <User className="h-5 w-5" /> },
    { name: 'Paramètres', href: '/settings', icon: <Settings className="h-5 w-5" /> },
    { name: 'Aide', href: '/help', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  // Classes pour les éléments du menu
  const linkClasses = (active) => `
    flex items-center px-4 py-3 
    ${active 
      ? 'bg-red-50 text-red-600 font-medium' 
      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
    }
    ${collapsed ? 'justify-center' : ''}
    rounded-lg
    transition-colors
  `;

  // Rendu du sidebar pour desktop
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/" className={`${collapsed ? 'hidden' : ''} text-xl font-bold text-red-600`}>
          TransExpress
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <div className="py-2 flex flex-col flex-grow overflow-y-auto">
        <div className="px-3 py-2">
          {!collapsed && <p className="text-xs font-medium text-gray-500 uppercase px-3 mb-2">Menu principal</p>}
          <nav className="space-y-1">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClasses(isActive(link.href))}
                title={collapsed ? link.name : undefined}
              >
                <span>{link.icon}</span>
                {!collapsed && <span className="ml-3">{link.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {user && user.role === 'admin' && (
          <div className="px-3 py-2 mt-6 border-t border-gray-200">
            {!collapsed && <p className="text-xs font-medium text-gray-500 uppercase px-3 mb-2">Administration</p>}
            <nav className="space-y-1">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClasses(isActive(link.href))}
                  title={collapsed ? link.name : undefined}
                >
                  <span>{link.icon}</span>
                  {!collapsed && <span className="ml-3">{link.name}</span>}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <div className="px-3 py-2 mt-6 border-t border-gray-200">
          {!collapsed && <p className="text-xs font-medium text-gray-500 uppercase px-3 mb-2">Compte</p>}
          <nav className="space-y-1">
            {otherLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClasses(isActive(link.href))}
                title={collapsed ? link.name : undefined}
              >
                <span>{link.icon}</span>
                {!collapsed && <span className="ml-3">{link.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto">
          <div className="px-3 py-4 border-t border-gray-200">
            <button
              onClick={logout}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors
                ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? 'Déconnexion' : undefined}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Déconnexion</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Rendu du sidebar pour mobile
  const mobileSidebar = (
    <div className={`md:hidden fixed inset-0 z-50 ${isMobileOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75" onClick={toggleMobileSidebar}></div>
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/" className="text-xl font-bold text-red-600">
            TransExpress
          </Link>
          <button
            onClick={toggleMobileSidebar}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informations utilisateur */}
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

        <div className="py-2">
          <div className="px-3 py-2">
            <p className="text-xs font-medium text-gray-500 uppercase px-3 mb-2">Menu principal</p>
            <nav className="space-y-1">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClasses(isActive(link.href))}
                >
                  <span>{link.icon}</span>
                  <span className="ml-3">{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {user && user.role === 'admin' && (
            <div className="px-3 py-2 mt-6 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase px-3 mb-2">Administration</p>
              <nav className="space-y-1">
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={linkClasses(isActive(link.href))}
                  >
                    <span>{link.icon}</span>
                    <span className="ml-3">{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}

          <div className="px-3 py-2 mt-6 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase px-3 mb-2">Compte</p>
            <nav className="space-y-1">
              {otherLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClasses(isActive(link.href))}
                >
                  <span>{link.icon}</span>
                  <span className="ml-3">{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="px-3 py-4 mt-6 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Bouton d'ouverture du menu mobile
  const mobileMenuButton = (
    <button
      onClick={toggleMobileSidebar}
      className="md:hidden fixed bottom-20 right-4 z-40 p-3 rounded-full bg-red-600 text-white shadow-lg"
    >
      <Menu className="h-6 w-6" />
    </button>
  );

  return (
    <>
      <aside
        className={`hidden md:flex flex-col h-screen bg-white border-r border-gray-200 fixed top-0 left-0 bottom-0 z-40
          ${collapsed ? 'w-20' : 'w-64'} 
          transition-all duration-300`}
      >
        {sidebarContent}
      </aside>
      {mobileSidebar}
      {!isMobileOpen && mobileMenuButton}
    </>
  );
}