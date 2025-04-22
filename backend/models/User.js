const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Veuillez fournir un prénom'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Veuillez fournir un nom'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Veuillez fournir un email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Veuillez fournir un email valide',
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Veuillez fournir un mot de passe'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Veuillez fournir un numéro de téléphone'],
      trim: true,
    },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: { type: String, default: 'France' },
    },
    role: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client',
    },
  },
  { timestamps: true }
);

// Hash du mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour vérifier le mot de passe
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour générer un JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model('User', UserSchema);
