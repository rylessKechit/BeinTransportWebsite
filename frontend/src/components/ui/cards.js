'use client';

import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';

// Carte de base
export function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// En-tête de carte
export function CardHeader({ children, className = '', ...props }) {
  return (
    <div 
      className={`p-4 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Corps de carte
export function CardBody({ children, className = '', ...props }) {
  return (
    <div 
      className={`p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Pied de carte
export function CardFooter({ children, className = '', ...props }) {
  return (
    <div 
      className={`p-4 border-t border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Carte avec titre
export function TitledCard({ title, children, className = '', ...props }) {
  return (
    <Card className={className} {...props}>
      <CardHeader className="bg-gray-50">
        <h3 className="font-medium">{title}</h3>
      </CardHeader>
      <CardBody>
        {children}
      </CardBody>
    </Card>
  );
}

// Carte cliquable (lien)
export function LinkCard({ href, title, description, icon, className = '', external = false, ...props }) {
  return (
    <Link href={href} className={`block ${className}`} {...props}>
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardBody className="flex items-start">
          {icon && <div className="mr-4 text-purple-600">{icon}</div>}
          <div className="flex-grow">
            <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
            {description && <p className="text-gray-600 text-sm">{description}</p>}
          </div>
          <div className="ml-4 text-gray-400">
            {external ? <ExternalLink className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

// Carte de service (avec image et appel à l'action)
export function ServiceCard({ title, description, icon, imageUrl, actionText = 'En savoir plus', actionUrl = '#', className = '', ...props }) {
  return (
    <Card className={`h-full flex flex-col ${className}`} {...props}>
      {imageUrl && (
        <div className="h-48 relative">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardBody className="flex-grow">
        <div className="flex items-center mb-4">
          {icon && <div className="mr-3 text-purple-600">{icon}</div>}
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{description}</p>
      </CardBody>
      <CardFooter className="pt-0 pb-6 px-6 border-0">
        <Link
          href={actionUrl}
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
        >
          {actionText}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}

// Carte de prix/tarif
export function PricingCard({ title, price, features = [], popular = false, actionText = 'Sélectionner', actionUrl = '#', className = '', ...props }) {
  return (
    <Card 
      className={`h-full flex flex-col ${popular ? 'border-2 border-purple-600 shadow-lg' : ''} ${className}`}
      {...props}
    >
      {popular && (
        <div className="bg-purple-600 text-white text-center py-1 text-sm font-medium">
          Recommandé
        </div>
      )}
      <CardBody className="flex-grow">
        <div className="text-center mb-6">
          <h3 className="font-semibold text-xl mb-2">{title}</h3>
          <div className="flex items-center justify-center">
            <span className="text-4xl font-bold">{price}</span>
            {price !== 'Sur devis' && <span className="text-gray-500 ml-1">/jour</span>}
          </div>
        </div>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardBody>
      
      <CardFooter className="pt-0 pb-6 px-6 border-0 text-center">
        <Link
          href={actionUrl}
          className={`inline-block w-full py-2 px-4 rounded-lg font-medium ${
            popular 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
          }`}
        >
          {actionText}
        </Link>
      </CardFooter>
    </Card>
  );
}

// Carte de statistiques
export function StatsCard({ title, value, description, icon, change, changeDirection = 'up', change, changeDirection = 'up', className = '', ...props }) {
  return (
    <Card className={`h-full ${className}`} {...props}>
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-700">{title}</h3>
          {icon && (
            <div className="p-2 rounded-full bg-gray-50">
              {icon}
            </div>
          )}
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold">{value}</p>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          
          {change && (
            <div className={`text-sm ${changeDirection === 'up' ? 'text-green-500' : 'text-purple-500'} flex items-center`}>
              <svg 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {changeDirection === 'up' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                )}
              </svg>
              {change}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

// Carte d'information avec icône
export function InfoCard({ title, content, icon, variant = 'default', className = '', ...props }) {
  const variantStyles = {
    default: 'bg-gray-50',
    primary: 'bg-purple-50',
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    danger: 'bg-purple-50',
    info: 'bg-blue-50'
  };
  
  const variantIconColors = {
    default: 'text-gray-500',
    primary: 'text-purple-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-purple-600',
    info: 'text-blue-600'
  };
  
  return (
    <div className={`rounded-lg p-4 ${variantStyles[variant]} ${className}`} {...props}>
      <div className="flex">
        {icon && (
          <div className={`mr-4 ${variantIconColors[variant]}`}>
            {icon}
          </div>
        )}
        <div>
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <div className="text-gray-700">{content}</div>
        </div>
      </div>
    </div>
  );
}

// Carte d'équipe/contact
export function ContactCard({ name, role, imageUrl, email, phone, className = '', ...props }) {
  return (
    <Card className={`h-full ${className}`} {...props}>
      <CardBody className="text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-medium">
              {name?.charAt(0)}
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        {role && <p className="text-gray-600 mb-4">{role}</p>}
        
        {(email || phone) && (
          <div className="space-y-2 text-left">
            {email && (
              <a 
                href={`mailto:${email}`} 
                className="flex items-center text-gray-700 hover:text-purple-600"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {email}
              </a>
            )}
            
            {phone && (
              <a 
                href={`tel:${phone.replace(/\s/g, '')}`} 
                className="flex items-center text-gray-700 hover:text-purple-600"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {phone}
              </a>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// Carte de témoignage client
export function TestimonialCard({ quote, author, position, avatarUrl, className = '', ...props }) {
  return (
    <Card className={`h-full flex flex-col ${className}`} {...props}>
      <CardBody className="flex-grow">
        <svg className="h-8 w-8 text-purple-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        
        <p className="text-gray-700 mb-6">{quote}</p>
        
        <div className="flex items-center mt-auto">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={author} 
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mr-3">
              {author?.charAt(0)}
            </div>
          )}
          
          <div>
            <h4 className="font-medium">{author}</h4>
            {position && <p className="text-sm text-gray-500">{position}</p>}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Carte FAQ (Question/Réponse)
export function FaqCard({ question, answer, open = false, onToggle, className = '', ...props }) {
  return (
    <Card 
      className={`border border-gray-200 shadow-sm ${className}`} 
      onClick={onToggle}
      {...props}
    >
      <CardBody className="p-4 cursor-pointer">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">{question}</h3>
          <button className={`p-1 rounded-full transition-transform ${open ? 'rotate-180' : ''}`}>
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {open && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-gray-600">
            {answer}
          </div>
        )}
      </CardBody>
    </Card>
  );
}