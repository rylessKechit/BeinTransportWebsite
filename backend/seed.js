const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Modèles
const Vehicle = require('./models/Vehicle');
const User = require('./models/User');

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Données des véhicules
const vehicles = [
  {
    name: 'Petit utilitaire',
    capacity: 3,
    imageUrl: '/images/vehicles/3m3.jpg',
    description: 'Idéal pour les petits déménagements ou le transport de quelques cartons.',
    basePrice: 29,
    pricePerKm: 0.5,
    dimensions: {
      length: 200,
      width: 150,
      height: 100
    }
  },
  {
    name: 'Utilitaire moyen',
    capacity: 6,
    imageUrl: '/images/vehicles/6m3.jpg',
    description: 'Parfait pour un déménagement de studio ou le transport de meubles.',
    basePrice: 39,
    pricePerKm: 0.7,
    dimensions: {
      length: 250,
      width: 180,
      height: 130
    }
  },
  {
    name: 'Grand utilitaire',
    capacity: 10,
    imageUrl: '/images/vehicles/10m3.jpg',
    description: "Adapté pour le déménagement d'un appartement 2 pièces.",
    basePrice: 49,
    pricePerKm: 0.9,
    dimensions: {
      length: 300,
      width: 200,
      height: 170
    }
  },
  {
    name: 'Camion',
    capacity: 15,
    imageUrl: '/images/vehicles/15m3.jpg',
    description: "Idéal pour le déménagement d'un appartement 3 pièces.",
    basePrice: 69,
    pricePerKm: 1.1,
    dimensions: {
      length: 350,
      width: 210,
      height: 200
    }
  },
  {
    name: 'Grand camion',
    capacity: 20,
    imageUrl: '/images/vehicles/20m3.jpg',
    description: "Parfait pour le déménagement d'une maison ou grand appartement.",
    basePrice: 89,
    pricePerKm: 1.3,
    dimensions: {
      length: 400,
      width: 220,
      height: 220
    }
  }
];

// Utilisateur admin par défaut
const admin = {
  firstName: 'Admin',
  lastName: 'System',
  email: 'beintransportsdev@gmail.com',
  password: 'password123',
  phone: '0641903254',
  address: {
    street: '123 Rue de l\'Administration',
    city: 'Paris',
    postalCode: '75001'
  },
  role: 'admin'
};

// Importation des données
const importData = async () => {
  try {
    // Supprimer les données existantes
    await Vehicle.deleteMany();
    await User.deleteMany();

    // Importer les nouvelles données
    await Vehicle.insertMany(vehicles);
    await User.create(admin);

    console.log('Données importées avec succès !');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Exécution de l'importation
importData();
