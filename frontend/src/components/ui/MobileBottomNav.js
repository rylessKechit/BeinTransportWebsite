'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, User, Phone } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  
  const isActive = (path) => {
    return pathname === path;
  };
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around items-center">
        <Link 
          href="/" 
          className={`flex flex-col items-center py-2 ${isActive('/') ? 'text-red-600' : 'text-gray-500'}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Accueil</span>
        </Link>
        
        <Link 
          href="/reservation" 
          className={`flex flex-col items-center py-2 ${isActive('/reservation') ? 'text-red-600' : 'text-gray-500'}`}
        >
          <Package className="h-6 w-6" />
          <span className="text-xs mt-1">Réserver</span>
        </Link>
        
        <Link 
          href="/dashboard" 
          className={`flex flex-col items-center py-2 ${isActive('/dashboard') ? 'text-red-600' : 'text-gray-500'}`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Compte</span>
        </Link>
        
        <Link 
          href="/contact" 
          className={`flex flex-col items-center py-2 ${isActive('/contact') ? 'text-red-600' : 'text-gray-500'}`}
        >
          <Phone className="h-6 w-6" />
          <span className="text-xs mt-1">Contact</span>
        </Link>
      </div>
    </div>
  );
}