import React from 'react';
import NewsCard from '../NewsCard/NewsCard';

const newsData = [
  {
    imageUrl: "https://nextui.org/images/fruit-1.jpeg",
    title: "Clínica Veterinaria Querétaro",
    subtitle: "clinicaveterinariaqro.com",
    bodyText: "Cuidamos de tus mascotas con los mejores servicios veterinarios en Querétaro.",
    linkUrl: "https://clinicaveterinariaqro.com",
    linkText: "Visita nuestro sitio web"
  },
  {
    imageUrl: "https://nextui.org/images/fruit-2.jpeg",
    title: "Refugio de Animales San Francisco",
    subtitle: "refugiosanfrancisco.org",
    bodyText: "Brindamos un hogar temporal para animales en situación de calle.",
    linkUrl: "https://refugiosanfrancisco.org",
    linkText: "Conoce más sobre nosotros"
  },
  {
    imageUrl: "https://nextui.org/images/fruit-3.jpeg",
    title: "Adopta Querétaro",
    subtitle: "adoptaqro.org",
    bodyText: "Encuentra a tu nuevo mejor amigo en nuestro portal de adopciones.",
    linkUrl: "https://adoptaqro.org",
    linkText: "Descubre las mascotas disponibles"
  }
];


const RightSidebar: React.FC = () => {
  return (
    <section className='sticky right-0 top-0 z-20 flex h-screen w-full flex-col gap-4 justify-start max-xl:hidden'>
      {newsData.map((news, index) => (
        <NewsCard 
          key={index}
          imageUrl={news.imageUrl}
          title={news.title}
          subtitle={news.subtitle}
          bodyText={news.bodyText}
          linkUrl={news.linkUrl}
          linkText={news.linkText}
        />
      ))}
    </section>
  );
};

export default RightSidebar;
