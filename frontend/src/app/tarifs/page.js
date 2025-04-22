import Link from 'next/link';
import { Truck, ArrowRight, HelpCircle, Calculator, Check } from 'lucide-react';

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Nos tarifs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des tarifs transparents et sans surprise pour tous vos besoins de transport
            et déménagement. Choisissez l'offre qui correspond à vos besoins.
          </p>
        </div>

        {/* Grille de prix des véhicules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Petit utilitaire */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
            <div className="h-48 bg-gray-50 flex items-center justify-center">
              <Truck className="h-20 w-20 text-gray-400" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Petit utilitaire</h2>
              <div className="flex items-center mb-4">
                <span className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  3m³
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  Idéal pour studio ou petits objets
                </span>
              </div>
              <div className="border-t border-b border-gray-100 py-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Prix de base</span>
                  <span className="font-semibold">29€</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Prix par km</span>
                  <span className="font-semibold">0,50€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Manutentionnaire</span>
                  <span className="font-semibold">25€</span>
                </div>
              </div>
              <Link
                href="/reservation?vehicleId=3m3"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-lg transition-colors"
              >
                Réserver
              </Link>
            </div>
          </div>

          {/* Utilitaire moyen */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border-2 border-purple-600">
            <div className="bg-purple-600 text-white text-center py-1 text-sm font-medium">
              POPULAIRE
            </div>
            <div className="h-48 bg-gray-50 flex items-center justify-center">
              <Truck className="h-20 w-20 text-gray-400" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Utilitaire moyen</h2>
              <div className="flex items-center mb-4">
                <span className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  10m³
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  Parfait pour un 2 pièces
                </span>
              </div>
              <div className="border-t border-b border-gray-100 py-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Prix de base</span>
                  <span className="font-semibold">49€</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Prix par km</span>
                  <span className="font-semibold">0,90€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Manutentionnaire</span>
                  <span className="font-semibold">25€ (max 2)</span>
                </div>
              </div>
              <Link
                href="/reservation?vehicleId=10m3"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-lg transition-colors"
              >
                Réserver
              </Link>
            </div>
          </div>

          {/* Grand camion */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
            <div className="h-48 bg-gray-50 flex items-center justify-center">
              <Truck className="h-20 w-20 text-gray-400" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Grand camion</h2>
              <div className="flex items-center mb-4">
                <span className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  20m³
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  Pour un grand appartement ou maison
                </span>
              </div>
              <div className="border-t border-b border-gray-100 py-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Prix de base</span>
                  <span className="font-semibold">89€</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Prix par km</span>
                  <span className="font-semibold">1,30€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Manutentionnaire</span>
                  <span className="font-semibold">25€ (max 2)</span>
                </div>
              </div>
              <Link
                href="/reservation?vehicleId=20m3"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-lg transition-colors"
              >
                Réserver
              </Link>
            </div>
          </div>
        </div>

        {/* Voir tous les véhicules */}
        <div className="text-center mb-20">
          <Link
            href="/vehicules"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            Voir tous nos véhicules
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Options supplémentaires */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Options supplémentaires</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-b border-gray-100 pb-4 md:border-b-0 md:border-r md:pr-8 md:pb-0">
                <h3 className="text-xl font-medium mb-4">Manutentionnaires</h3>
                <p className="text-gray-600 mb-4">
                  Nos manutentionnaires professionnels s'occupent du chargement et déchargement
                  de vos affaires, vous évitant les efforts physiques.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tarif par manutentionnaire</span>
                  <span className="text-lg font-semibold">25€</span>
                </div>
              </div>
              
              <div className="pt-4 md:pt-0 md:pl-8">
                <h3 className="text-xl font-medium mb-4">Services spéciaux</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Assurance complémentaire</span>
                    <span className="text-lg font-semibold">10€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Emballage des objets fragiles</span>
                    <span className="text-lg font-semibold">Sur devis</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service express (même jour)</span>
                    <span className="text-lg font-semibold">+30%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ sur les tarifs */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 flex items-center justify-center">
            <HelpCircle className="h-6 w-6 mr-2 text-purple-600" />
            Questions fréquentes sur nos tarifs
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium mb-2">Comment sont calculés les prix ?</h3>
              <p className="text-gray-600">
                Nos prix se composent d'un tarif de base (selon le véhicule) auquel s'ajoute
                un coût kilométrique calculé en fonction de la distance entre les adresses de
                prise en charge et de livraison. Les options comme les manutentionnaires sont
                facturées séparément.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium mb-2">Y a-t-il des frais supplémentaires ?</h3>
              <p className="text-gray-600">
                Tous nos tarifs sont transparents et affichés à l'avance. Aucun frais
                supplémentaire ne sera facturé sauf en cas de conditions exceptionnelles 
                (dépassement horaire, attente prolongée, etc.) qui vous seront communiquées.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium mb-2">Proposez-vous des forfaits pour les entreprises ?</h3>
              <p className="text-gray-600">
                Oui, nous proposons des tarifs spéciaux et des forfaits pour les entreprises
                ayant des besoins réguliers. Contactez notre service commercial pour obtenir
                un devis personnalisé.
              </p>
            </div>
          </div>
        </div>

        {/* Simulateur de prix */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
              <Calculator className="h-6 w-6 mr-2 text-purple-600" />
              Simulateur de prix
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Estimez rapidement le coût de votre transport en quelques clics
            </p>
            
            <Link
              href="/reservation"
              className="block w-full max-w-md mx-auto bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-lg transition-colors"
            >
              Obtenir un devis personnalisé
            </Link>
          </div>
        </div>

        {/* Garanties de prix */}
        <div className="bg-purple-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Nos garanties
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Prix fixe garanti</h3>
              <p className="text-gray-600">
                Le prix affiché lors de votre réservation est le prix que vous payerez, sans surprise.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Remboursement partiel</h3>
              <p className="text-gray-600">
                Si notre service ne vous satisfait pas pleinement, nous vous proposons un remboursement partiel.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Meilleur rapport qualité/prix</h3>
              <p className="text-gray-600">
                Nous nous engageons à vous offrir le meilleur service au meilleur prix sur le marché.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Prêt à réserver votre transport ?</h2>
          <Link
            href="/reservation"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Réserver maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}