import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaFacebook, 
  FaInstagram, 
  FaYoutube, 
  FaSpotify, 
  FaEnvelope, 
  FaPaypal 
} from "react-icons/fa";

import "../assets/scss/_03-Componentes/_Contacto.scss";

const Contacto = () => {
  const navigate = useNavigate();

  const contactItems = [
    {
      icon: <FaFacebook />,
      text: "FACEBOOK",
      url: "https://www.facebook.com/alegondramusic",
      color: "#1877f2"
    },
    {
      icon: <FaInstagram />,
      text: "INSTAGRAM",
      url: "https://www.instagram.com/alegondramusic/?hl=es",
      color: "#e1306c"
    },
    {
      icon: <FaYoutube />,
      text: "YOUTUBE",
      url: "https://www.youtube.com/channel/UCBhJkysp3SnHU1tR3qAA5pQ",
      color: "#ff0000"
    },
    {
      icon: <FaSpotify />,
      text: "SPOTIFY",
      url: "https://open.spotify.com/artist/7qo7PxAcvyyyZb6XztH7zE",
      color: "#1db954"
    },
    {
      icon: <FaEnvelope />,
      text: "CORREO ELECTRÓNICO",
      url: "mailto:bavaroalejandro@gmail.com",
      color: "#00f0ff"
    },
    {
      icon: <FaPaypal />,
      text: "APOYO ECONÓMICO",
      url: "https://www.paypal.com/paypalme/alegondramusic?country.x=AR&locale.x=es_XC",
      color: "#003087"
    }
  ];

  return (
    <section className="spotify-contact-section">
      <div className="contact-container">
        <h1 className="contact-title">
          CONTACTO
        </h1>
        
        <div className="contact-divider"></div>

        <div className="contact-content">
          <div className="logo-container">
            <img
              src="/img/05-img-galeria2/banner4.png"
              alt="Almango Pop Covers"
              className="contact-logo"
            />
          </div>

          <div className="contact-info">
            <h2 className="contact-subtitle">
              CANALES DE COMUNICACIÓN
            </h2>
            
            <div className="contact-items">
              {contactItems.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item"
                  style={{ "--item-color": item.color }}
                >
                  <div className="item-icon" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <span className="item-text">{item.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;