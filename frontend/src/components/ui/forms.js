'use client';

import React, { forwardRef } from 'react';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

// Input de base
export const Input = forwardRef(({ 
  label, 
  error, 
  icon,
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className={`relative ${className}`}>
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={`block w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border ${
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
          } rounded-lg`}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Input mot de passe avec visibilité toggleable
export const PasswordInput = forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className={`relative ${className}`}>
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={`block w-full pl-4 pr-10 py-2.5 border ${
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
          } rounded-lg`}
          {...props}
        />
        
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          onClick={toggleVisibility}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

// Select
export const Select = forwardRef(({ 
  label, 
  error, 
  options = [],
  placeholder = "Sélectionner une option",
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <select
        ref={ref}
        className={`block w-full px-4 py-2.5 border ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
        } rounded-lg bg-white ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// Textarea
export const Textarea = forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        className={`block w-full px-4 py-2.5 border ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
        } rounded-lg resize-y ${className}`}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Checkbox
export const Checkbox = forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className={`h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 ${className}`}
          {...props}
        />
        
        {label && (
          <label className="ml-2 block text-sm text-gray-700">
            {label}
          </label>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// Radio Button
export const Radio = forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          type="radio"
          ref={ref}
          className={`h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500 ${className}`}
          {...props}
        />
        
        {label && (
          <label className="ml-2 block text-sm text-gray-700">
            {label}
          </label>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

// Groupe de radios
export const RadioGroup = forwardRef(({ 
  label, 
  error, 
  options = [],
  value,
  onChange,
  name,
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className={`space-y-2 ${className}`} {...props}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
            />
            <label htmlFor={`${name}-${option.value}`} className="ml-2 block text-sm text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

RadioGroup.displayName = 'RadioGroup';

// Radio Card (Carte sélectionnable)
export const RadioCard = forwardRef(({ 
  label,
  title, 
  description,
  icon,
  checked,
  value,
  onChange,
  name,
  className = '', 
  ...props 
}, ref) => {
  return (
    <label
      className={`block border-2 rounded-lg p-4 cursor-pointer transition-all
        ${checked ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300'} ${className}`}
      {...props}
    >
      <input
        type="radio"
        ref={ref}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      
      <div className="flex items-start">
        {icon && <div className="mr-4 text-red-600">{icon}</div>}
        
        <div className="flex-grow">
          {title && <h3 className="font-medium mb-1">{title}</h3>}
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
        
        <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ml-4 flex items-center justify-center ${
          checked ? 'border-red-600 bg-red-600' : 'border-gray-300'
        }`}>
          {checked && <Check className="h-4 w-4 text-white" />}
        </div>
      </div>
    </label>
  );
});

RadioCard.displayName = 'RadioCard';

// Groupe d'entrées (pour prénom/nom, adresse/ville, etc.)
export const InputGroup = ({ children, className = '', ...props }) => {
  return (
    <div className={`grid gap-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Formulaire de recherche
export const SearchInput = forwardRef(({ 
  onSearch,
  placeholder = "Rechercher...",
  className = '', 
  ...props 
}, ref) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(e.target.search.value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        ref={ref}
        type="search"
        name="search"
        placeholder={placeholder}
        className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
        {...props}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      <button
        type="submit"
        className="absolute inset-y-0 right-0 px-3 flex items-center bg-red-600 text-white rounded-r-lg"
      >
        Rechercher
      </button>
    </form>
  );
});

SearchInput.displayName = 'SearchInput';

// Groupe de formulaire avec étiquette
export const FormGroup = ({ label, children, className = '', ...props }) => {
  return (
    <div className={`mb-6 ${className}`} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      {children}
    </div>
  );
};