import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { FaSearch, FaMusic, FaHome, FaTimes } from "react-icons/fa";

// Componente Header - Barra de navegación superior
const Header = ({ searchQuery, setSearchQuery }) => {
  // ------------------------------------------------------------
  // SECCIÓN: ESTADOS Y REFERENCIAS
  // ------------------------------------------------------------
  const location = useLocation(); // Hook de React Router para obtener la ruta actual
  const [showMobileSearch, setShowMobileSearch] = useState(false); // Controla visibilidad de búsqueda en móvil
  const [menuActive, setMenuActive] = useState(false); // Controla si el menú móvil está activo
  const headerRef = useRef(null); // Referencia al elemento header para detectar clicks fuera

  // ------------------------------------------------------------
  // SECCIÓN: DATOS DEL COMPONENTE
  // ------------------------------------------------------------
  // Array con los items del menú de navegación
  const menuItems = [
    { title: "Inicio", path: "/", icon: <FaMusic /> }, 
    // Se eliminó el item de Contacto que estaba aquí originalmente
  ];

  // Determina si debe mostrarse la barra de búsqueda (solo en ruta /musica)
  const shouldShowSearchBar = location.pathname === "/musica";

  // ------------------------------------------------------------
  // SECCIÓN: MANEJADORES DE EVENTOS
  // ------------------------------------------------------------
  // Maneja la navegación cerrando menú móvil y scroll al top
  const handleNavigation = () => {
    setMenuActive(false);
    window.scrollTo(0, 0);
  };

  // Cierra el menú móvil al hacer click fuera del header
  const handleClickOutside = (event) => {
    if (headerRef.current && !headerRef.current.contains(event.target)) {
      setMenuActive(false);
    }
  };

  // ------------------------------------------------------------
  // SECCIÓN: EFECTOS
  // ------------------------------------------------------------
  // Efecto para agregar/remover listener de clicks fuera del header
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ------------------------------------------------------------
  // SECCIÓN: RENDERIZADO
  // ------------------------------------------------------------
  return (
    <header className="app-header" ref={headerRef}>
      <div className="header-wrapper">
        {/* Contenedor del logo */}
        <div className="logo-container">
          <Link to="/" className="logo-link" onClick={handleNavigation}>
            <img 
              src="/img/02-logos/logoreproductordemusicamp32222.png" 
              alt="Reproductor de Música" 
              className="logo-image"
            />
          </Link>
        </div>

        {/* Menú de navegación principal */}
        <nav className={`main-nav ${menuActive ? "active" : ""}`}>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={handleNavigation}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Controles móviles (búsqueda y menú hamburguesa) */}
        <div className="mobile-controls">
          {shouldShowSearchBar && (
            <button
              className="search-toggle"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              {showMobileSearch ? <FaTimes /> : <FaSearch />}
            </button>
          )}

          <button
            className="menu-toggle"
            onClick={() => setMenuActive(!menuActive)}
          >
            <div className={`toggle-bar ${menuActive ? "open" : ""}`}></div>
            <div className={`toggle-bar ${menuActive ? "open" : ""}`}></div>
            <div className={`toggle-bar ${menuActive ? "open" : ""}`}></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;