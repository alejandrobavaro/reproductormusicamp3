import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_EventoGuion.scss';

/**
 * COMPONENTE EVENTO GUION
 * 
 * Propósito: Muestra el itinerario del evento y permite la navegación entre bloques
 * 
 * Props recibidas:
 * - onBloqueChange: Función para notificar al padre (Musica.jsx) cuando cambia el bloque
 * - bloqueActual: ID del bloque actual (controlado desde Musica.jsx)
 * - guionEvento: Datos del evento cargados desde guionBoda.json
 * - onEstadoChange: Función para notificar cambios en el estado de los bloques
 */
function EventoGuion({ 
  onBloqueChange,
  bloqueActual,
  guionEvento,
  onEstadoChange 
}) {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS DEL COMPONENTE ███
  // ████████████████████████████████████████████
  
  // [Estado] Guarda el estado (completado/pendiente) de cada bloque
  const [estadosBloques, setEstadosBloques] = useState({});

  // █████████████████████████████████████████████████████████████████████
  // ███ 2. EFECTOS SECUNDARIOS ███
  // █████████████████████████████████████████████████████████████████████

  // [Efecto] Inicializa los estados cuando se carga el guionEvento
  useEffect(() => {
    if (guionEvento?.bloques) {
      const inicialEstados = {};
      guionEvento.bloques.forEach(bloque => {
        // Mantiene el estado existente o lo inicializa como 'pendiente'
        inicialEstados[bloque.id] = estadosBloques[bloque.id] || 'pendiente';
      });
      setEstadosBloques(inicialEstados);
    }
  }, [guionEvento]); // Se ejecuta cuando cambia guionEvento

  // █████████████████████████████████████████████████████████████████████
  // ███ 3. FUNCIONES PRINCIPALES ███
  // █████████████████████████████████████████████████████████████████████

  /**
   * Cambia el estado de un bloque entre completado/pendiente
   * @param {string} bloqueId - ID del bloque a modificar
   */
  const toggleEstadoBloque = (bloqueId) => {
    const nuevoEstado = estadosBloques[bloqueId] === 'completado' ? 'pendiente' : 'completado';
    
    // Actualiza el estado local
    setEstadosBloques(prev => ({
      ...prev,
      [bloqueId]: nuevoEstado
    }));
    
    // Notifica al componente padre (Musica.jsx)
    if (onEstadoChange) {
      onEstadoChange(bloqueId, nuevoEstado);
    }
  };

  // █████████████████████████████████████████████████████████████████████
  // ███ 4. RENDERIZADO ███
  // █████████████████████████████████████████████████████████████████████
  
  // Muestra estado de carga si no hay datos
  if (!guionEvento) return <div className="evento-guion-loading">Cargando guión...</div>;

  return (
    <div className="evento-guion-container">
      {/* ███ 4.1 Encabezado ███ */}
      <div className="evento-guion-header">
        <h3 className="evento-guion-title">{guionEvento.evento}</h3>
      </div>

      {/* ███ 4.2 Tabla de bloques ███ */}
      <div className="evento-guion-tabla">
        {/* Encabezado de tabla (solo visible en desktop) */}
        <div className="evento-guion-tabla-header">
          <div className="evento-guion-col-hora">Hora</div>
          <div className="evento-guion-col-bloque">Bloque</div>
          <div className="evento-guion-col-actividades">Actividades</div>
          {/* <div className="evento-guion-col-estado">Estado</div> */}
        </div>

        {/* Mapeo de todos los bloques del evento */}
        {guionEvento.bloques.map((bloque) => (
          <div 
            key={bloque.id}
            className={`evento-guion-fila ${bloqueActual === bloque.id ? 'active' : ''}`}
            onClick={() => onBloqueChange && onBloqueChange(bloque.id)}
          >
            {/* Columna Hora */}
            <div className="evento-guion-col-hora">
              {bloque.horaInicio} - {bloque.horaFin}
            </div>
            
            {/* Columna Nombre del Bloque */}
            <div className="evento-guion-col-bloque">
              {bloque.nombre}
            </div>
            
            {/* Columna Actividades (muestra máx 2) */}
            <div className="evento-guion-col-actividades">
              <ul>
                {bloque.actividades.slice(0, 2).map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
                {bloque.actividades.length > 2 && (
                  <li className="mas-actividades">+{bloque.actividades.length - 2} más</li>
                )}
              </ul>
            </div>
            
            {/* Columna Estado con switch */}
            {/* <div className="evento-guion-col-estado">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={estadosBloques[bloque.id] === 'completado'}
                  onChange={() => toggleEstadoBloque(bloque.id)}
                  onClick={e => e.stopPropagation()} // Evita que el click llegue al contenedor
                />
                <span className="slider round"></span>
              </label>
              <span className={`estado-texto ${estadosBloques[bloque.id]}`}>
                {estadosBloques[bloque.id] === 'completado' ? 'Completado' : 'Pendiente'}
              </span>
            </div> */}
          </div>
        ))}
      </div>

      {/* ███ 4.3 Detalle expandido del bloque seleccionado ███ */}
      {bloqueActual && (
        <div className="evento-guion-detalle">
          <h4>{guionEvento.bloques.find(b => b.id === bloqueActual)?.nombre}</h4>
          <ul className="evento-guion-detalle-actividades">
            {guionEvento.bloques.find(b => b.id === bloqueActual)?.actividades?.map((act, i) => (
              <li key={i}>{act}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EventoGuion;