/**
 * Format d'une date pour l'affichage
 * @param {string|Date} date - Date à formater
 * @param {string} locale - Locale pour le formatage (par défaut: fr-FR)
 * @returns {string} - Date formatée
 */
export const formatDate = (date, locale = 'fr-FR') => {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  };
  
  /**
   * Formater un montant pour l'affichage
   * @param {number} amount - Montant à formater
   * @param {string} currency - Devise (par défaut: EUR)
   * @param {string} locale - Locale pour le formatage (par défaut: fr-FR)
   * @returns {string} - Montant formaté
   */
  export const formatCurrency = (amount, currency = 'EUR', locale = 'fr-FR') => {
    if (amount === null || amount === undefined) return '';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount);
  };
  
  /**
   * Obtenir le nom d'un type de service
   * @param {string} serviceType - Identifiant du type de service
   * @returns {string} - Nom du service
   */
  export const getServiceTypeName = (serviceType) => {
    switch (serviceType) {
      case 'demenagement':
        return 'Déménagement';
      case 'livraison':
        return 'Livraison de colis';
      case 'transport':
        return 'Transport divers';
      default:
        return serviceType || '';
    }
  };
  
  /**
   * Obtenir le libellé d'un statut de réservation
   * @param {string} status - Statut de réservation
   * @returns {string} - Libellé du statut
   */
  export const getBookingStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'in-progress':
        return 'En cours';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status || '';
    }
  };
  
  /**
   * Obtenir les classes CSS pour un badge de statut
   * @param {string} status - Statut de réservation
   * @returns {string} - Classes CSS
   */
  export const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-indigo-100 text-indigo-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  /**
   * Vérifier si une chaîne est une adresse email valide
   * @param {string} email - Adresse email à vérifier
   * @returns {boolean} - true si l'adresse est valide
   */
  export const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };
  
  /**
   * Vérifier si une chaîne est un numéro de téléphone valide (France)
   * @param {string} phone - Numéro de téléphone à vérifier
   * @returns {boolean} - true si le numéro est valide
   */
  export const isValidPhone = (phone) => {
    const re = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return re.test(phone);
  };
  
  /**
   * Obtenir la date du jour au format YYYY-MM-DD
   * @returns {string} - Date formatée
   */
  export const getTodayFormatted = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  /**
   * Troncation de texte avec ellipsis
   * @param {string} text - Texte à tronquer
   * @param {number} maxLength - Longueur maximale
   * @returns {string} - Texte tronqué
   */
  export const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    
    return text.substring(0, maxLength) + '...';
  };