'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Mail, Phone, MapPin, Lock, Save, 
  Edit, AlertTriangle, CheckCircle, Loader
} from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const router = useRouter();
  
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'France'
  });
  
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [editMode, setEditMode] = useState({
    personal: false,
    address: false,
    password: false
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    personal: false,
    address: false,
    password: false
  });
  const [error, setError] = useState({
    personal: null,
    address: null,
    password: null
  });

  // Rediriger si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/profile');
    }
  }, [user, authLoading, router]);
  
  // Initialiser les données utilisateur
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      
      if (user.address) {
        setAddress({
          street: user.address.street || '',
          city: user.address.city || '',
          postalCode: user.address.postalCode || '',
          country: user.address.country || 'France'
        });
      }
    }
  }, [user]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEditMode = (section) => {
    setEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Réinitialiser les messages d'erreur et de succès
    setError(prev => ({
      ...prev,
      [section]: null
    }));
    setSuccess(prev => ({
      ...prev,
      [section]: false
    }));
  };

  const savePersonalInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ ...error, personal: null });
    
    try {
      // Validation simple
      if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email || !personalInfo.phone) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }
      
      // Simuler la mise à jour (à remplacer par l'appel API réel)
      const success = await updateProfile({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phone: personalInfo.phone,
        // email généralement non modifiable, mais inclus dans la requête
        email: personalInfo.email
      });
      
      if (success) {
        setSuccess({ ...success, personal: true });
        setEditMode({ ...editMode, personal: false });
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          setSuccess({ ...success, personal: false });
        }, 3000);
      } else {
        throw new Error('Erreur lors de la mise à jour du profil');
      }
    } catch (err) {
      setError({ ...error, personal: err.message });
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ ...error, address: null });
    
    try {
      // Validation simple
      if (!address.street || !address.city || !address.postalCode) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }
      
      // Simuler la mise à jour (à remplacer par l'appel API réel)
      const success = await updateProfile({
        address: {
          street: address.street,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country
        }
      });
      
      if (success) {
        setSuccess({ ...success, address: true });
        setEditMode({ ...editMode, address: false });
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          setSuccess({ ...success, address: false });
        }, 3000);
      } else {
        throw new Error('Erreur lors de la mise à jour de l\'adresse');
      }
    } catch (err) {
      setError({ ...error, address: err.message });
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ ...error, password: null });
    
    try {
      // Validation
      if (!password.current || !password.new || !password.confirm) {
        throw new Error('Veuillez remplir tous les champs');
      }
      
      if (password.new !== password.confirm) {
        throw new Error('Les nouveaux mots de passe ne correspondent pas');
      }
      
      if (password.new.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }
      
      // Simuler la mise à jour (à remplacer par l'appel API réel)
      // Note: cette fonctionnalité nécessitera un endpoint API spécifique
      const success = true;
      
      if (success) {
        setSuccess({ ...success, password: true });
        setEditMode({ ...editMode, password: false });
        setPassword({ current: '', new: '', confirm: '' });
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          setSuccess({ ...success, password: false });
        }, 3000);
      } else {
        throw new Error('Erreur lors de la mise à jour du mot de passe');
      }
    } catch (err) {
      setError({ ...error, password: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <Loader className="h-8 w-8 text-purple-600 animate-spin" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Mon profil</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar avec avatar et menu */}
            <div className="bg-white rounded-xl shadow-md p-6 h-fit">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-medium mb-4">
                  {personalInfo.firstName?.charAt(0)}{personalInfo.lastName?.charAt(0)}
                </div>
                <h2 className="text-xl font-semibold">{personalInfo.firstName} {personalInfo.lastName}</h2>
                <p className="text-gray-500">{user.role === 'admin' ? 'Administrateur' : 'Client'}</p>
              </div>
              
              <nav className="space-y-1">
                <a href="#personal-info" className="block px-4 py-2 text-purple-600 bg-purple-50 rounded-lg font-medium">
                  Informations personnelles
                </a>
                <a href="#address" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Adresse
                </a>
                <a href="#security" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Sécurité
                </a>
              </nav>
            </div>
            
            {/* Formulaires de profil */}
            <div className="md:col-span-2 space-y-8">
              {/* Informations personnelles */}
              <section id="personal-info" className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Informations personnelles</h2>
                  <button 
                    onClick={() => toggleEditMode('personal')} 
                    className="text-purple-600 hover:text-purple-700 flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {editMode.personal ? 'Annuler' : 'Modifier'}
                  </button>
                </div>
                
                {success.personal && (
                  <div className="mx-6 mt-4 bg-green-50 border-l-4 border-green-600 p-4 text-green-700 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Informations personnelles mises à jour avec succès.
                  </div>
                )}
                
                {error.personal && (
                  <div className="mx-6 mt-4 bg-purple-50 border-l-4 border-purple-600 p-4 text-purple-700 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {error.personal}
                  </div>
                )}
                
                <div className="p-6">
                  <form onSubmit={savePersonalInfo}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prénom
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="firstName"
                            value={personalInfo.firstName}
                            onChange={handlePersonalInfoChange}
                            disabled={!editMode.personal}
                            className={`block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg ${
                              editMode.personal ? 'bg-white focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={personalInfo.lastName}
                          onChange={handlePersonalInfoChange}
                          disabled={!editMode.personal}
                          className={`block w-full px-4 py-2.5 border border-gray-300 rounded-lg ${
                            editMode.personal ? 'bg-white focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          disabled={true} // Email généralement non modifiable
                          className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">L'email ne peut pas être modifié</p>
                    </div>
                    
                    <div className="mb-6">
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
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          disabled={!editMode.personal}
                          className={`block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg ${
                            editMode.personal ? 'bg-white focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                    </div>
                    
                    {editMode.personal && (
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg flex items-center transition-colors"
                        >
                          {loading ? (
                            <>
                              <Loader className="animate-spin h-4 w-4 mr-2" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Enregistrer
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </section>

              {/* Adresse */}
              <section id="address" className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Adresse</h2>
                  <button 
                    onClick={() => toggleEditMode('address')} 
                    className="text-purple-600 hover:text-purple-700 flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {editMode.address ? 'Annuler' : 'Modifier'}
                  </button>
                </div>
                
                {success.address && (
                  <div className="mx-6 mt-4 bg-green-50 border-l-4 border-green-600 p-4 text-green-700 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Adresse mise à jour avec succès.
                  </div>
                )}
                
                {error.address && (
                  <div className="mx-6 mt-4 bg-purple-50 border-l-4 border-purple-600 p-4 text-purple-700 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {error.address}
                  </div>
                )}
                
                <div className="p-6">
                  <form onSubmit={saveAddress}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rue et numéro
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="street"
                          value={address.street}
                          onChange={handleAddressChange}
                          disabled={!editMode.address}
                          className={`block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg ${
                            editMode.address ? 'bg-white focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ville
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={address.city}
                          onChange={handleAddressChange}
                          disabled={!editMode.address}
                          className={`block w-full px-4 py-2.5 border border-gray-300 rounded-lg ${
                            editMode.address ? 'bg-white focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Code postal
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={address.postalCode}
                          onChange={handleAddressChange}
                          disabled={!editMode.address}
                          className={`block w-full px-4 py-2.5 border border-gray-300 rounded-lg ${
                            editMode.address ? 'bg-white focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pays
                      </label>
                      <select
                        name="country"
                        value={address.country}
                        onChange={handleAddressChange}
                        disabled={!editMode.address}
                        className={`block w-full px-4 py-2.5 border border-gray-300 rounded-lg ${
                          editMode.address ? 'bg-white focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                        }`}
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Luxembourg">Luxembourg</option>
                      </select>
                    </div>
                    
                    {editMode.address && (
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg flex items-center transition-colors"
                        >
                          {loading ? (
                            <>
                              <Loader className="animate-spin h-4 w-4 mr-2" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Enregistrer
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </section>

              {/* Sécurité */}
              <section id="security" className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Sécurité</h2>
                  <button 
                    onClick={() => toggleEditMode('password')} 
                    className="text-purple-600 hover:text-purple-700 flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {editMode.password ? 'Annuler' : 'Modifier le mot de passe'}
                  </button>
                </div>
                
                {success.password && (
                  <div className="mx-6 mt-4 bg-green-50 border-l-4 border-green-600 p-4 text-green-700 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mot de passe mis à jour avec succès.
                  </div>
                )}
                
                {error.password && (
                  <div className="mx-6 mt-4 bg-purple-50 border-l-4 border-purple-600 p-4 text-purple-700 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {error.password}
                  </div>
                )}
                
                <div className="p-6">
                  {editMode.password ? (
                    <form onSubmit={savePassword}>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mot de passe actuel
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="current"
                            value={password.current}
                            onChange={handlePasswordChange}
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouveau mot de passe
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="new"
                            value={password.new}
                            onChange={handlePasswordChange}
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">6 caractères minimum</p>
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirmer le nouveau mot de passe
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="confirm"
                            value={password.confirm}
                            onChange={handlePasswordChange}
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg flex items-center transition-colors"
                        >
                          {loading ? (
                            <>
                              <Loader className="animate-spin h-4 w-4 mr-2" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Mettre à jour le mot de passe
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-6">
                      <Lock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        Pour modifier votre mot de passe, cliquez sur le bouton 'Modifier le mot de passe'
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}