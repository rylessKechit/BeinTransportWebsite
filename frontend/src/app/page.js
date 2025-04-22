import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Package, Home, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0 bg-gray-800">
          {/* Remplacer par une vraie image quand disponible */}
          <div className="w-full h-full object-cover brightness-50"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">Votre partenaire de transport à la demande</h1>
            <p className="text-xl mb-8">Déménagement, livraison ou transport spécial, réservez votre véhicule adapté en quelques clics.</p>
            <Link 
              href="/reservation" 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center w-fit"
            >
              Réserver maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Nos services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Truck className="h-12 w-12 text-red-600" />}
              title="Transport à la demande"
              description="Choisissez parmi nos différentes tailles de véhicules (3m³ à 20m³) selon vos besoins."
            />
            <ServiceCard 
              icon={<Home className="h-12 w-12 text-red-600" />}
              title="Déménagement"
              description="Solution complète pour votre déménagement avec l'aide de nos manutentionnaires qualifiés."
            />
            <ServiceCard 
              icon={<Package className="h-12 w-12 text-red-600" />}
              title="Livraison express"
              description="Livraison urgente de colis ou marchandises dans toute la ville et ses environs."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Comment ça marche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard 
              number="1"
              title="Choisissez votre service"
              description="Sélectionnez le type de transport dont vous avez besoin."
            />
            <StepCard 
              number="2"
              title="Sélectionnez le véhicule"
              description="Choisissez la taille du véhicule adaptée à votre besoin."
            />
            <StepCard 
              number="3"
              title="Ajoutez des options"
              description="Besoin de manutentionnaires ? Ajoutez-les à votre réservation."
            />
            <StepCard 
              number="4"
              title="Confirmez et payez"
              description="Validez votre réservation et effectuez le paiement en ligne."
            />
          </div>
        </div>
      </section>

      {/* Vehicles Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Notre flotte de véhicules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <VehicleCard 
              name="Petit utilitaire"
              capacity="3m³"
              description="Idéal pour les petits déménagements ou le transport de quelques cartons."
              price="À partir de 29€"
            />
            <VehicleCard 
              name="Utilitaire moyen"
              capacity="6m³"
              description="Parfait pour un déménagement de studio ou le transport de meubles."
              price="À partir de 39€"
            />
            <VehicleCard 
              name="Grand utilitaire"
              capacity="10m³"
              description="Adapté pour le déménagement d'un appartement 2 pièces."
              price="À partir de 49€"
            />
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/vehicules" 
              className="text-red-600 hover:text-red-700 font-semibold flex items-center justify-center"
            >
              Voir tous nos véhicules
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à réserver votre véhicule ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Simplifiez vos déplacements et transports avec notre service flexible et abordable.</p>
          <Link 
            href="/reservation" 
            className="bg-white text-red-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center"
          >
            Réserver maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

// Composants réutilisables
function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function VehicleCard({ name, capacity, description, price }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="relative h-56 bg-gray-200">
        {/* Placeholder pour l'image */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <Truck className="h-20 w-20" />
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{name}</h3>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {capacity}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">{price}</span>
          <Link 
            href={`/reservation?vehicle=${capacity}`}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Réserver
          </Link>
        </div>
      </div>
    </div>
  )
}