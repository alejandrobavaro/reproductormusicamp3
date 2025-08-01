/**
 * COMPONENTE FOOTER
 * 
 * Pie de página que contiene:
 * - Logotipos en los extremos
 * - Redes sociales centrales
 * - Información de copyright
 * - Enlace al desarrollador
 * 
 * Estructura:
 * 1. Logos laterales (izquierda y derecha)
 * 2. Sección central con redes sociales
 * 3. Sección inferior con copyright
 */
import React from "react";
import { FaInstagram, FaYoutube, FaFacebookF, FaTwitter } from "react-icons/fa";
import "../assets/scss/_03-Componentes/_Footer.scss";

function Footer() {
  return (
    <footer className="app-footer">
      {/* Contenedor principal del footer */}
      <div className="footer-container">
        {/* Logo izquierdo */}
        <div className="footer-logo-side">
          <div className="logo-wrapper">
            <img 
              src="/img/02-logos/logo2.png" 
              alt="Logo Almango" 
              className="footer-logo"
            />
          </div>
        </div>

        {/* Sección central con redes sociales */}
        <div className="footer-center">
          <h3 className="socials-title">CONÉCTATE CON NOSOTROS</h3>
          
          <div className="socials-container">
            <a href="https://www.instagram.com/almangopopmusic" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaInstagram className="social-icon" />
              <span className="social-label">Instagram</span>
            </a>
            <a href="https://www.youtube.com/@almangopopcovers" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaYoutube className="social-icon" />
              <span className="social-label">YouTube</span>
            </a>
            <a href="https://www.facebook.com/almangopopmusic" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaFacebookF className="social-icon" />
              <span className="social-label">Facebook</span>
            </a>
            <a href="https://twitter.com/almangopopmusic" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTwitter className="social-icon" />
              <span className="social-label">Twitter</span>
            </a>
          </div>
        </div>

        {/* Logo derecho */}
        <div className="footer-logo-side">
          <div className="logo-wrapper">
            <img 
              src="/img/02-logos/logo2.png" 
              alt="Logo Almango" 
              className="footer-logo"
            />
          </div>
        </div>
      </div>

      {/* Sección de copyright */}
      <div className="footer-bottom">
        <div className="copyright-container">
          <a href="https://alejandrobavaro.github.io/gondraworld-dev/" target="_blank" rel="noopener noreferrer" className="dev-link">
            GONDRA WORLD DEV
          </a>
          <span className="copyright-text">© {new Date().getFullYear()} Almango Pop Covers. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;