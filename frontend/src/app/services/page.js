import Link from 'next/link';
import { ArrowRight, Home, Package, Truck, Users, Clock, CheckCircle } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Nos services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos solutions de transport et déménagement adaptées à tous vos besoins.
            Fiabilité, flexibilité et rapport qualité-prix sont nos priorités.
          </p>
        </div>

        {/* Services principaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Déménagement */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
            <div className="h-52 bg-purple-50 flex items-center justify-center">
              <Home className="h-20 w-20 text-purple-600" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Déménagement</h2>
              <p className="text-gray-600 mb-6">
                Service complet pour votre déménagement. De la simple location de véhicule à la prestation avec manutentionnaires, nous vous accompagnons à chaque étape.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Véhicules adaptés à la taille de votre logement</span>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Manutentionnaires professionnels disponibles</span>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Tarifs transparents sans mauvaises surprises</span>
                </div>
              </div>
              <Link
                href="/reservation?service=demenagement"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                Réserver un déménagement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Livraison de colis */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
            <div className="h-52 bg-blue-50 flex items-center justify-center">
              <Package className="h-20 w-20 text-blue-600" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Livraison de colis</h2>
              <p className="text-gray-600 mb-6">
                Besoin de livrer un colis volumineux ou urgent ? Notre service de livraison express vous garantit une livraison rapide et sécurisée dans toute la ville.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Livraison express en quelques heures</span>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Suivi en temps réel de votre livraison</span>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Assurance incluse pour tous vos colis</span>
                </div>
              </div>
              <Link
                href="/reservation?service=livraison"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                Réserver une livraison
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Transport divers */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
            <div className="h-52 bg-green-50 flex items-center justify-center">
              <Truck className="h-20 w-20 text-green-600" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Transport divers</h2>
              <p className="text-gray-600 mb-6">
                Pour tous vos besoins spécifiques de transport : meubles, électroménager, matériaux de construction, etc. Nous nous adaptons à toutes les situations.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Transport d'objets volumineux ou lourds</span>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Chauffeurs expérimentés et professionnels</span>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Réservation possible le jour même</span>
                </div>
              </div>
              <Link
                href="/reservation?service=transport"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                Réserver un transport
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Comment fonctionne notre service ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Réservez en ligne</h3>
              <p className="text-gray-600">
                Choisissez votre service, votre véhicule et vos options en quelques clics.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Confirmation</h3>
              <p className="text-gray-600">
                Recevez une confirmation immédiate avec tous les détails de votre réservation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Jour J</h3>
              <p className="text-gray-600">
                Notre équipe arrive à l'heure prévue, prête à effectuer le service demandé.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Service terminé</h3>
              <p className="text-gray-600">
                Partagez votre expérience et votre avis pour aider à améliorer nos services.
              </p>
            </div>
          </div>
        </div>

        {/* Options supplémentaires */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-20">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Options supplémentaires</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Manutentionnaires</h3>
                  <p className="text-gray-600">
                    Facilitez votre déménagement avec nos manutentionnaires professionnels. Ils s'occupent du chargement et déchargement de vos biens avec soin et efficacité.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Horaires flexibles</h3>
                  <p className="text-gray-600">
                    Nous nous adaptons à vos contraintes d'horaires. Réservez votre créneau idéal, même en soirée ou le week-end selon disponibilité.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-purple-600 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Prêt à réserver votre service ?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Obtenez un devis instantané et réservez en quelques clics. Notre équipe est prête à vous accompagner pour tous vos besoins de transport et déménagement.
            </p>
            <Link 
              href="/reservation" 
              className="inline-block bg-white text-purple-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Réserver maintenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}