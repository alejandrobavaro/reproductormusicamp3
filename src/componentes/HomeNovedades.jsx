import React, { useState } from "react";
import "../assets/scss/_03-Componentes/_HomeNovedades.scss";

function HomeNovedades({ fullscreenMode }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedNews, setExpandedNews] = useState(null);

  // Revista de novedades de la banda
  const magazinePages = [
    {
      title: "¡SHOW EN VIVO - PLAZA DEL ROCK!",
      date: "Julio 2025",
      image: "/img/04-img-galeria1/Designer (1).jpeg",
      content: (
        <>
          <p>Este sábado, Almango Pop Covers se presenta en el clásico festival de la Plaza del Rock con un setlist renovado lleno de clásicos ochentosos que harán vibrar a todos. ¡Entrada libre y gratuita!</p>
          <blockquote>
            "¡No te pierdas este viaje musical por las décadas más icónicas!"
            <cite>- Revista RetroSound</cite>
          </blockquote>
          <p>Será una noche con luces, humo y una atmósfera retro-futurista para bailar como en los años dorados del pop internacional.</p>
        </>
      ),
      gallery: ["/img/04-img-galeria1/IMG_1219.JPG", "/img/04-img-galeria1/IMG_1212.JPG", "/img/04-img-galeria1/IMG_1219.JPG"],
      category: "Próximo Show"
    },
    {
      title: "¡NUEVOS HITS EN NUESTRA ROCKOLA!",
      date: "Junio 2025",
      image: "/img/04-img-galeria1/2025-01-31 023.jpg",
      content: (
        <>
          <p>Sumamos nuevos temas a nuestro repertorio: “Dancing with Myself” de Billy Idol, “Take on Me” de A-ha y “Don’t Stop Believin’” de Journey, ya forman parte de nuestra rockola oficial.</p>
          <p>Pedilas en vivo en nuestros shows o desde nuestra web, donde podés votar qué tema querés que suene en el próximo evento.</p>
          <p>¡La fiesta la armamos entre todos!</p>
        </>
      ),
      gallery: ["/img/04-img-galeria1/2025-01-31 023.jpg", "/img/04-img-galeria1/2025-01-31 023.jpg"],
      category: "Repertorio"
    },
    {
      title: "SUMAMOS SINTETIZADORES ANALÓGICOS",
      date: "Mayo 2025",
      image: "/img/04-img-galeria1/2025-01-31 023.jpg",
      content: (
        <>
          <p>La banda incorpora una nueva línea de sintetizadores analógicos para llevar nuestros covers a otro nivel. ¡Más groove, más ochentas, más power!</p>
          <p>El sonido ahora tiene más cuerpo, más aire y más nostalgia. ¡Vení a escucharlo en vivo!</p>
        </>
      ),
      gallery: ["/img/04-img-galeria1/2025-01-31 023.jpg", "/img/04-img-galeria1/2025-01-31 023.jpg"],
      category: "Equipamiento"
    }
  ];

  // Noticias breves
  const newsItems = [
    {
      id: 1,
      title: "¡TOCAMOS EN UN CUMPLE RETRO!",
      date: "10 Junio 2025",
      excerpt: "Nos contrataron para animar una fiesta temática de los 80s con música en vivo y ambientación total.",
      content: (
        <>
          <p>Luces de neón, vinilos, y mucho baile. La banda interpretó 20 hits de los 70s, 80s y 90s. ¡Fue una noche inolvidable!</p>
          <p>Gracias a todo el público que nos acompañó con looks retro y mucho entusiasmo.</p>
        </>
      ),
      images: ["/img/04-img-galeria1/2025-01-31 023.jpg", "/img/04-img-galeria1/2025-01-31 023.jpg"],
      category: "Eventos Privados"
    },
    {
      id: 2,
      title: "¡NUEVO VIDEOCLIP EN CAMINO!",
      date: "5 Junio 2025",
      excerpt: "Estamos grabando nuestro primer videoclip con estética VHS retro y mucha onda ochentosa.",
      content: (
        <>
          <p>Filmado en una pista de patinaje con luces de tubo y ropa flúor, el video promete transportarte directamente a 1986.</p>
          <p>Muy pronto disponible en nuestras redes y en la web oficial.</p>
        </>
      ),
      images: ["/img/04-img-galeria1/Designer (10).jpeg", "/img/04-img-galeria1/2025-01-31 023.jpg"],
      category: "Producción"
    },
    {
      id: 3,
      title: "¡NUEVA INTERFAZ EN NUESTRA WEB!",
      date: "1 Junio 2025",
      excerpt: "La sección 'Rockola' ahora tiene filtros por década y artista, y podés armar tu playlist personalizada.",
      content: (
        <>
          <p>¿Querés escuchar tu tema favorito en el próximo show? Entrá a la web y votá desde nuestra nueva interfaz animada en estilo ciberpunk.</p>
          <p>¡Los clásicos que amás, con tecnología del futuro!</p>
        </>
      ),
      images: ["/img/04-img-galeria1/Designer.jpeg"],
      category: "Web Update"
    }
  ];

  return (
    <div className={`novedades-container ${fullscreenMode ? 'fullscreen-mode' : ''}`}>
      <section className="tech-magazine">
        <h2>NOVEDADES DE ALMANGO</h2>
        <p className="magazine-subtitle">SHOWS, ROCKOLA Y MUCHO POP</p>

        <div className="magazine-page">
          <div className="page-image-container">
            <div 
              className="page-image" 
              style={{ backgroundImage: `url(${magazinePages[currentPage].image})` }}
            >
              <div className="page-header">
                <h3>{magazinePages[currentPage].title}</h3>
                <span className="page-date">{magazinePages[currentPage].date}</span>
              </div>
            </div>
          </div>

          <div className="page-content">
            {magazinePages[currentPage].content}

            {magazinePages[currentPage].gallery && (
              <div className="page-gallery">
                <h4>GALERÍA</h4>
                <div className="gallery-grid">
                  {magazinePages[currentPage].gallery.map((img, i) => (
                    <div key={i} className="gallery-item">
                      <img src={img} alt={`Galería ${i + 1}`} />
                      <div className="holographic-overlay"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="page-controls">
            <div className="page-indicator">
              ARCHIVO {currentPage + 1} / {magazinePages.length}
            </div>
            <div className="navigation-buttons">
              <button 
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="neon-button"
              >
                ← ATRÁS
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(magazinePages.length - 1, p + 1))}
                disabled={currentPage === magazinePages.length - 1}
                className="neon-button"
              >
                ADELANTE →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="news-section">
        <h2>ÚLTIMAS NOVEDADES</h2>
        <p className="news-subtitle">HISTORIAS Y ACTUALIZACIONES DE NUESTRA BANDA</p>

        <div className="news-list">
          {newsItems.map(news => (
            <div 
              key={news.id} 
              className={`news-card ${expandedNews === news.id ? 'expanded' : ''}`}
            >
              <div className="news-image">
                <img src={news.images[0]} alt={news.title} />
                <div className="scanner-effect"></div>
              </div>
              <div className="news-content">
                <span className="news-category">{news.category}</span>
                <h3>{news.title}</h3>
                <time>{news.date}</time>
                <p className="news-excerpt">{news.excerpt}</p>

                {expandedNews === news.id ? (
                  <div className="news-full-content">
                    {news.content}
                    <button 
                      className="news-toggle"
                      onClick={() => setExpandedNews(null)}
                    >
                      CERRAR
                    </button>
                  </div>
                ) : (
                  <button 
                    className="news-toggle"
                    onClick={() => setExpandedNews(news.id)}
                  >
                    VER MÁS
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomeNovedades;
