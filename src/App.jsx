

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './componentes/Header';
import HomeMainContent from './componentes/HomeMainContent';
import Contacto from './componentes/Contacto';
import Footer from './componentes/Footer';
import Musica from './componentes/Musica';
import './assets/scss/estilo.scss';
import "../src/assets/scss/_01-General/_App.scss";

const Layout = ({ children }) => {
  return (
    <main className="spotify-main">
      {children}
    </main>
  );
};

/**
 * COMPONENTE APP
 * 
 * Estado:
 * - musicCart: Array que contiene las canciones en la lista de reproducción
 * - searchQuery: String con el término de búsqueda actual
 * 
 * Funciones:
 * - addMusicToCart: Añade una canción a la lista de reproducción
 * - removeMusicFromCart: Elimina una canción de la lista por su ID
 */
function App() {
  // Estado para la lista de reproducción
  const [musicCart, setMusicCart] = useState([]);
  
  // Estado para el término de búsqueda
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Añade una canción a la lista de reproducción
   * @param {Object} song - Canción a añadir
   */
  const addMusicToCart = (song) => {
    setMusicCart(prevCart => [...prevCart, song]);
  };

  /**
   * Elimina una canción de la lista de reproducción
   * @param {number|string} id - ID de la canción a eliminar
   */
  const removeMusicFromCart = (id) => {
    setMusicCart(prevCart => prevCart.filter(song => song.id !== id));
  };

  return (
    <Router>
      {/* Contenedor principal con clase spotify-app para estilos globales */}
      <div className="spotify-app">
        {/* Header que recibe props de búsqueda */}
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Contenido principal con rutas */}
        <div className="spotify-content">
          <Routes>
            {/* Ruta principal (Home) */}
            <Route path="/" element={<Layout><HomeMainContent /></Layout>} />
            
            {/* Ruta de contacto */}
            <Route path="/contactoredessociales" element={<Layout><Contacto /></Layout>} />
            
            {/* Ruta de música con props para manejar la lista de reproducción */}
            <Route path="/musica" element={
              <Layout>
                <Musica 
                  setCart={setMusicCart} 
                  cart={musicCart} 
                  addToCart={addMusicToCart} 
                  removeFromCart={removeMusicFromCart} 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                />
              </Layout>
            } />
            
            {/* Ruta comodín para redirigir a home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
          
        {/* Footer de la aplicación */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;