
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { FaSearch, FaMusic, FaHome, FaEnvelope, FaTimes } from "react-icons/fa";

const Header = ({ searchQuery, setSearchQuery }) => {
  // ------------------------------------------------------------
  // ESTADOS Y REFERENCIAS
  // ------------------------------------------------------------
  const location = useLocation(); // Hook para obtener la ruta actual
  const [showMobileSearch, setShowMobileSearch] = useState(false); // Controlar búsqueda móvil
  const [menuActive, setMenuActive] = useState(false); // Controlar menú móvil
  const headerRef = useRef(null); // Referencia para el header

  // ------------------------------------------------------------
  // DATOS DEL COMPONENTE
  // ------------------------------------------------------------
  const menuItems = [
    { title: "Inicio", path: "/", icon: <FaHome /> },
    { title: "Música", path: "/musica", icon: <FaMusic /> },
    { title: "Contacto", path: "/contactoredessociales", icon: <FaEnvelope /> },
  ];

  // Mostrar barra de búsqueda solo en /musica
  const shouldShowSearchBar = location.pathname === "/musica";

  // ------------------------------------------------------------
  // MANEJADORES DE EVENTOS
  // ------------------------------------------------------------
  const handleNavigation = () => {
    setMenuActive(false);
    window.scrollTo(0, 0);
  };

  // Cerrar menú al hacer click fuera
  const handleClickOutside = (event) => {
    if (headerRef.current && !headerRef.current.contains(event.target)) {
      setMenuActive(false);
    }
  };

  // ------------------------------------------------------------
  // EFECTOS
  // ------------------------------------------------------------
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ------------------------------------------------------------
  // RENDERIZADO
  // ------------------------------------------------------------
  return (
    <header className="app-header" ref={headerRef}>
      <div className="header-wrapper">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/" className="logo-link" onClick={handleNavigation}>
            <img 
              src="/img/02-logos/logoreproductordemusicamp3.png" 
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

        {/* Controles móviles */}
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