// App.jsx - Versión optimizada y documentada
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './componentes/Header';
import Contacto from './componentes/Contacto';
import Footer from './componentes/Footer';
import Musica from './componentes/Musica';
import './assets/scss/estilo.scss';
import "../src/assets/scss/_01-General/_App.scss";

/**
 * COMPONENTE PRINCIPAL APP
 * 
 * Estructura:
 * 1. Router - Envuelve toda la aplicación para manejo de rutas
 * 2. Header - Barra de navegación superior
 * 3. Contenido principal - Cambia según la ruta
 * 4. Footer - Barra inferior con redes y contacto
 * 
 * Rutas configuradas:
 * - / : Muestra el componente Musica (página principal)
 * - /contactoredessociales : Muestra el componente Contacto (importante: usa esta ruta exacta)
 * - * : Redirecciona cualquier otra ruta a la principal
 */
function App() {
  // ------------------------------------------------------------
  // ESTADOS
  // ------------------------------------------------------------
  const [musicCart, setMusicCart] = useState([]); // Guarda la lista de reproducción
  const [searchQuery, setSearchQuery] = useState(""); // Almacena el término de búsqueda

  return (
    <Router>
      {/* Contenedor principal de la aplicación */}
      <div className="spotify-app">
        {/* Header - Barra superior de navegación */}
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Contenido principal - Cambia según la ruta actual */}
        <div className="spotify-content">
          <Routes>
            {/* Ruta principal - Muestra el reproductor de música */}
            <Route path="/" element={
              <Musica 
                setCart={setMusicCart} 
                cart={musicCart} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
              />
            } />
            
            {/* 
              Ruta de contacto - IMPORTANTE: 
              Coincide exactamente con el Link en el Footer (/contactoredessociales)
              Renderiza el componente Contacto con todos sus elementos
            */}
            <Route path="/contactoredessociales" element={<Contacto />} />
            
            {/* Ruta comodín - Redirige a la página principal si la ruta no existe */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        
        {/* Footer - Barra inferior con redes sociales y contacto */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;