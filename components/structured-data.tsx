export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Modelsnest",
    "description": "Production-ready AI infrastructure with <200ms latency, 99.99% uptime, and transparent pricing. Built by developers, for developers.",
    "url": "https://Modelsnest.com",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free tier available with paid plans for enterprise use"
    },
    "provider": {
      "@type": "Organization",
      "name": "Modelsnest",
      "url": "https://Modelsnest.com",
      "sameAs": [
        "https://www.youtube.com/channel/UCMR4IQM1ZQ-tbGUdElOgK9g",
        "https://www.instagram.com/modelsnest.ai/",
        "https://discord.gg/sEuW4V8K"
      ]
    },
    "featureList": [
      "AI APIs",
      "Enterprise AI",
      "Machine Learning APIs",
      "AI Infrastructure",
      "Developer Tools",
      "API Platform",
      "AI Services",
      "Production AI",
      "Low Latency AI",
      "Scalable AI"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "Modelsnest Team"
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "softwareVersion": "1.0.0",
    "downloadUrl": "https://Modelsnest.com/signup",
    "installUrl": "https://Modelsnest.com/signup"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Modelsnest",
    "url": "https://Modelsnest.com",
    "logo": "https://Modelsnest.com/logo.png",
    "description": "Enterprise AI APIs built for scale with production-ready infrastructure",
    "foundingDate": "2024",
    "sameAs": [
      "https://www.youtube.com/channel/UCMR4IQM1ZQ-tbGUdElOgK9g",
      "https://www.instagram.com/modelsnest.ai/",
      "https://discord.gg/sEuW4V8K"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "modelsnest3@gmail.com"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
