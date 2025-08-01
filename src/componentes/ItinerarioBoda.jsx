import React, { useState, useEffect } from "react";
import "../assets/scss/_03-Componentes/_ItinerarioBoda.scss";

function ItinerarioBoda({ 
  bloqueActual,          // ID del bloque actual seleccionado
  onBloqueSeleccionado,  // Función para cambiar de bloque
  guionEvento            // Datos del guión del evento (nuevo prop)
}) {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS DEL COMPONENTE ███
  // ████████████████████████████████████████████
  
  // [Estado] Bloque actual expandido para ver detalles
  const [bloqueExpandido, setBloqueExpandido] = useState(null);
  
  // [Estado] Lista completa de bloques del evento
  const [bloquesEvento, setBloquesEvento] = useState([]);

  // █████████████████████████████████████████████████████████████████████
  // ███ 2. EFECTOS SECUNDARIOS ███
  // █████████████████████████████████████████████████████████████████████

  // [Efecto] Carga inicial del guión del evento
  useEffect(() => {
    const cargarGuionEvento = async () => {
      try {
        const response = await fetch('/guionBoda.json');
        if (!response.ok) throw new Error('Error al cargar el guión');
        
        const data = await response.json();
        setBloquesEvento(data.bloques);
      } catch (err) {
        console.error("Error cargando guión:", err);
      }
    };

    cargarGuionEvento();
  }, []);

  // [Efecto] Actualiza el bloque expandido cuando cambia el bloque actual
  useEffect(() => {
    if (bloqueActual && bloquesEvento.length > 0) {
      const bloque = bloquesEvento.find(b => b.id === bloqueActual);
      setBloqueExpandido(bloque);
    }
  }, [bloqueActual, bloquesEvento]);

  // █████████████████████████████████████████████████████████████████████
  // ███ 3. FUNCIONES AUXILIARES ███
  // █████████████████████████████████████████████████████████████████████

  // [Función] Maneja el clic en un bloque
  const handleClickBloque = (bloqueId) => {
    onBloqueSeleccionado(bloqueId);
    const bloque = bloquesEvento.find(b => b.id === bloqueId);
    setBloqueExpandido(bloque);
  };

  // [Función] Formatea la hora para mostrar
  const formatHora = (hora) => {
    return hora.replace('hs', '');
  };

  // █████████████████████████████████████████████████████████████████████
  // ███ 4. RENDERIZADO DEL COMPONENTE ███
  // █████████████████████████████████████████████████████████████████████
  return (
    <div className="itinerario-container">
      {/* ███ 4.1 Lista de todos los bloques del evento ███ */}
      <div className="timeline-bloques">
        <h3 className="timeline-title">Guión del Evento</h3>
        
        {bloquesEvento.map((bloque) => (
          <div 
            key={bloque.id}
            className={`bloque-item ${bloqueActual === bloque.id ? 'active' : ''}`}
            onClick={() => handleClickBloque(bloque.id)}
          >
            <div className="bloque-hora">
              {formatHora(bloque.horaInicio)} - {formatHora(bloque.horaFin)}
            </div>
            <div className="bloque-nombre">{bloque.nombre}</div>
          </div>
        ))}
      </div>

      {/* ███ 4.2 Detalle del bloque actualmente seleccionado ███ */}
      {bloqueExpandido && (
        <div className="bloque-detalle">
          <h4 className="detalle-title">
            {bloqueExpandido.nombre} ({formatHora(bloqueExpandido.horaInicio)} - {formatHora(bloqueExpandido.horaFin)})
          </h4>
          
          <ul className="actividades-list">
            {bloqueExpandido.actividades.map((actividad, index) => (
              <li key={index} className="actividad-item">
                <span className="actividad-icon">•</span>
                {actividad}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ItinerarioBoda;