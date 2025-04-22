'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, User } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulation d'envoi de formulaire (à remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* En-tête de la page */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vous avez des questions ou besoin d'informations supplémentaires ? 
              Notre équipe est à votre disposition pour vous aider.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Carte d'information - Email */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Email</h3>
              <p className="text-gray-600 text-center mb-4">Pour toute demande d'information</p>
              <a 
                href="mailto:contact@transexpress.fr" 
                className="text-purple-600 hover:text-purple-700 text-center block font-medium"
              >
                contact@transexpress.fr
              </a>
            </div>

            {/* Carte d'information - Téléphone */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Téléphone</h3>
              <p className="text-gray-600 text-center mb-4">Du lundi au vendredi, 9h-18h</p>
              <a 
                href="tel:0123456789" 
                className="text-purple-600 hover:text-purple-700 text-center block font-medium"
              >
                01 23 45 67 89
              </a>
            </div>

            {/* Carte d'information - Adresse */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Adresse</h3>
              <p className="text-gray-600 text-center mb-4">Bureaux et dépôt</p>
              <p className="text-purple-600 text-center font-medium">
                123 Rue du Transport<br />
                75000 Paris
              </p>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-purple-600" />
                Envoyez-nous un message
              </h2>

              {success && (
                <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6 text-green-700">
                  Votre message a été envoyé avec succès. Nous vous contacterons dans les plus brefs délais.
                </div>
              )}

              {error && (
                <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-6 text-purple-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Votre email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Votre téléphone (optionnel)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sujet
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Choisir un sujet</option>
                      <option value="devis">Demande de devis</option>
                      <option value="info">Demande d'information</option>
                      <option value="reservation">Question sur une réservation</option>
                      <option value="reclamation">Réclamation</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Votre message"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    * Champs obligatoires
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-6 rounded-lg transition-colors flex items-center"
                  >
                    {loading ? 'Envoi en cours...' : (
                      <>
                        Envoyer le message 
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Carte Google Maps */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-purple-600" />
              Nous trouver
            </h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-96">
              {/* Intégrez ici une carte Google Maps ou OpenStreetMap */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Carte non disponible - Intégrez ici une carte Google Maps</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}