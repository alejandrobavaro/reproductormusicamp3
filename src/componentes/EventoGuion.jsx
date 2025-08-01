import React, { useState, useEffect, useRef } from 'react';
import '../assets/scss/_03-Componentes/_EventoGuion.scss';

function EventoGuion({ 
  // PROPS RECIBIDAS:
  onBloqueChange,      // Función callback que notifica al padre (Musica.jsx) cuando cambia el bloque
  bloqueActual,        // String con el ID del bloque actual, viene del estado de Musica.jsx
  guionEvento          // Objeto con todos los datos del evento, cargado desde guionBoda.json
}) {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS DEL COMPONENTE ███
  // ████████████████████████████████████████████
  
  // [Estado] Controla si el evento está en modo automático (avanza por tiempo)
  const [enCurso, setEnCurso] = useState(false);
  
  // [Estado] Guarda el momento exacto en que se inició el evento
  const [horaInicio, setHoraInicio] = useState(null);
  
  // [Estado] Objeto con toda la información temporal:
  const [tiempo, setTiempo] = useState({
    minutos: 0,        // Minutos transcurridos desde el inicio
    hora: "19:00",     // Hora actual del evento (formato HH:MM)
    bloqueActual: null, // Datos completos del bloque en curso
    proximos: []       // Array con los próximos 2 bloques programados
  });
  
  // [Ref] Referencia al intervalo de tiempo para poder limpiarlo
  const intervaloRef = useRef(null);

  // █████████████████████████████████████████████████████████████████████
  // ███ 2. EFECTOS SECUNDARIOS ███
  // █████████████████████████████████████████████████████████████████████

  // [Efecto] Maneja el intervalo de actualización cuando el evento está en curso
  useEffect(() => {
    // Limpieza si no está en curso o no hay guión
    if (!enCurso || !guionEvento) {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
      return;
    }
    
    // Configura el intervalo para actualizar cada minuto (60000 ms)
    intervaloRef.current = setInterval(actualizarTiempo, 60000);
    // Ejecuta la primera actualización inmediatamente
    actualizarTiempo();
    
    // Función de limpieza al desmontar el componente
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [enCurso, horaInicio, guionEvento]);

  // [Efecto] Sincroniza el bloque actual cuando cambia desde el padre
  useEffect(() => {
    if (bloqueActual && guionEvento?.bloques) {
      const bloque = guionEvento.bloques.find(b => b.id === bloqueActual);
      if (bloque) {
        setTiempo(prev => ({
          ...prev,
          bloqueActual: {
            ...bloque,
            tiempoRestante: calcularTiempoRestante(bloque)
          }
        }));
      }
    }
  }, [bloqueActual, guionEvento]);

  // █████████████████████████████████████████████████████████████████████
  // ███ 3. FUNCIONES PRINCIPALES ███
  // █████████████████████████████████████████████████████████████████████

  /**
   * Calcula y actualiza el tiempo transcurrido y determina el bloque actual
   * Se ejecuta cada minuto cuando el evento está en curso
   */
  const actualizarTiempo = () => {
    if (!guionEvento || !horaInicio) return;
    
    const ahora = new Date();
    // Calcula minutos transcurridos desde el inicio
    const minutosTranscurridos = Math.floor((ahora - horaInicio) / (1000 * 60));
    // Calcula la hora actual del evento
    const horaActual = new Date(horaInicio);
    horaActual.setMinutes(horaActual.getMinutes() + minutosTranscurridos);
    const horaStr = horaActual.toTimeString().substring(0, 5);
    
    let minutosAcum = 0;
    let bloqueEnCurso = null;
    let proximosBloques = [];
    
    // Recorre todos los bloques para determinar cuál está activo
    for (const bloque of guionEvento.bloques) {
      const duracion = calcularDuracion(bloque.horaInicio, bloque.horaFin);
      minutosAcum += duracion;
      
      if (minutosTranscurridos < minutosAcum && !bloqueEnCurso) {
        bloqueEnCurso = {
          ...bloque,
          tiempoRestante: minutosAcum - minutosTranscurridos
        };
      } else if (!bloqueEnCurso) {
        proximosBloques.push(bloque);
      }
    }
    
    // Actualiza el estado con la información calculada
    setTiempo({
      minutos: minutosTranscurridos,
      hora: horaStr,
      bloqueActual: bloqueEnCurso,
      proximos: proximosBloques.slice(0, 2) // Solo los próximos 2 bloques
    });
    
    // Notifica al componente padre si hay un cambio de bloque
    if (bloqueEnCurso && onBloqueChange) {
      onBloqueChange(bloqueEnCurso.id);
    }
  };

  /**
   * Calcula la duración en minutos de un bloque
   * @param {string} inicio - Hora de inicio (formato "HH:MM")
   * @param {string} fin - Hora de fin (formato "HH:MM")
   * @returns {number} Duración en minutos
   */
  const calcularDuracion = (inicio, fin) => {
    try {
      const [hIni, mIni] = inicio.split(':').map(Number);
      const [hFin, mFin] = fin.split(':').map(Number);
      return (hFin * 60 + mFin) - (hIni * 60 + mIni);
    } catch (error) {
      console.error("Error al calcular duración:", error);
      return 0;
    }
  };

  /**
   * Calcula el tiempo restante para un bloque
   * @param {object} bloque - Objeto con datos del bloque
   * @returns {number} Minutos restantes
   */
  const calcularTiempoRestante = (bloque) => {
    try {
      const duracion = calcularDuracion(bloque.horaInicio, bloque.horaFin);
      if (!tiempo.bloqueActual) return duracion;
      return duracion - (tiempo.minutos % duracion);
    } catch (error) {
      console.error("Error al calcular tiempo restante:", error);
      return 0;
    }
  };

  /**
   * Calcula el progreso porcentual de un bloque
   * @param {object} bloque - Objeto con datos del bloque
   * @returns {number} Porcentaje completado (0-100)
   */
  const calcularProgresoBloque = (bloque) => {
    if (!bloque || !tiempo.bloqueActual) return 0;
    try {
      const duracion = calcularDuracion(bloque.horaInicio, bloque.horaFin);
      const transcurrido = duracion - bloque.tiempoRestante;
      return (transcurrido / duracion) * 100;
    } catch (error) {
      console.error("Error al calcular progreso:", error);
      return 0;
    }
  };

  // Inicia el evento (modo automático)
  const iniciarEvento = () => {
    setHoraInicio(new Date());
    setEnCurso(true);
  };

  // Pausa el evento (modo automático)
  const pausarEvento = () => {
    setEnCurso(false);
  };

  /**
   * Maneja la selección manual de un bloque
   * @param {string} bloqueId - ID del bloque seleccionado
   */
  const seleccionarBloque = (bloqueId) => {
    if (onBloqueChange) onBloqueChange(bloqueId);
  };

  /**
   * Formatea minutos a formato "Xh Ym"
   * @param {number} minutos - Cantidad de minutos
   * @returns {string} Tiempo formateado
   */
  const formatoTiempo = (minutos) => {
    const hrs = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${hrs}h ${mins}m`;
  };

  /**
   * Formatea la hora para mostrar (elimina "hs" si existe)
   * @param {string} hora - Hora en formato "HH:MM" o "HHhs"
   * @returns {string} Hora formateada o string vacío si no está definida
   */
  const formatHora = (hora) => {
    if (!hora) return '';
    return hora.toString().replace('hs', '');
  };

  // █████████████████████████████████████████████████████████████████████
  // ███ 4. RENDERIZADO ███
  // █████████████████████████████████████████████████████████████████████
  
  // Muestra estado de carga si no hay datos
  if (!guionEvento) return <div className="evento-guion-loading">Cargando guión...</div>;

  return (
    <div className="evento-guion-container">
      {/* ███ 4.1 Encabezado con título y controles ███ */}
      <div className="evento-guion-header">
        <h3 className="evento-guion-title">{guionEvento.evento}</h3>
        <div className="evento-guion-controls">
          {!enCurso ? (
            <button onClick={iniciarEvento} className="evento-guion-button start">
              Iniciar Evento
            </button>
          ) : (
            <button onClick={pausarEvento} className="evento-guion-button pause">
              Pausar
            </button>
          )}
        </div>
      </div>

      {/* ███ 4.2 Tabla principal de bloques ███ */}
      <div className="evento-guion-tabla">
        {/* Encabezado de tabla (solo visible en desktop) */}
        <div className="evento-guion-tabla-header">
          <div className="evento-guion-col-hora">Hora</div>
          <div className="evento-guion-col-bloque">Bloque</div>
          <div className="evento-guion-col-actividades">Actividades</div>
          <div className="evento-guion-col-estado">Estado</div>
        </div>

        {/* Filas con los bloques del evento */}
        {guionEvento.bloques.map((bloque) => (
          <div 
            key={bloque.id}
            className={`evento-guion-fila ${bloqueActual === bloque.id ? 'active' : ''}`}
            onClick={() => seleccionarBloque(bloque.id)}
          >
            {/* Columna Hora */}
            <div className="evento-guion-col-hora">
              {formatHora(bloque.horaInicio)} - {formatHora(bloque.horaFin)}
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
            
            {/* Columna Estado (progreso o pendiente) */}
            <div className="evento-guion-col-estado">
              {bloqueActual === bloque.id ? (
                <div className="evento-guion-progreso-container">
                  <div className="evento-guion-progreso-bar" 
                    style={{ width: `${calcularProgresoBloque(bloque)}%` }}>
                  </div>
                  <span>{Math.round(calcularProgresoBloque(bloque))}%</span>
                </div>
              ) : (
                <span className="evento-guion-pendiente">Pendiente</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ███ 4.3 Detalle expandido del bloque seleccionado ███ */}
      {bloqueActual && (
        <div className="evento-guion-detalle">
          <h4 className="evento-guion-detalle-titulo">
            {guionEvento.bloques.find(b => b.id === bloqueActual)?.nombre || 'Bloque no encontrado'}
          </h4>
          <div className="evento-guion-detalle-tiempo">
            <span>Hora: {formatHora(guionEvento.bloques.find(b => b.id === bloqueActual)?.horaInicio)} - {formatHora(guionEvento.bloques.find(b => b.id === bloqueActual)?.horaFin)}</span>
            {tiempo.bloqueActual && (
              <span>Progreso: {formatoTiempo(tiempo.minutos)} / {formatoTiempo(calcularDuracion(tiempo.bloqueActual.horaInicio, tiempo.bloqueActual.horaFin))}</span>
            )}
          </div>
          <ul className="evento-guion-detalle-actividades">
            {guionEvento.bloques.find(b => b.id === bloqueActual)?.actividades?.map((act, i) => (
              <li key={i}>{act}</li>
            )) || <li>No hay actividades definidas</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EventoGuion;