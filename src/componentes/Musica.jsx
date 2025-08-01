import React, { useState, useEffect, useRef } from "react";
import { MusicaProvider } from "./MusicaContexto";
import MusicaCancionesLista from "./MusicaCancionesLista";
import MusicaReproductor from "./MusicaReproductor";
import MusicaFiltros from "./MusicaFiltros";
import EventoGuion from "./EventoGuion";
import "../assets/scss/_03-Componentes/_Musica.scss";

/**
 * COMPONENTE PRINCIPAL MUSICA
 * 
 * Propósito: Gestiona el reproductor musical y su sincronización con el itinerario del evento
 * 
 * Flujo mejorado:
 * 1. Carga inicial de datos (música + guión)
 * 2. Configuración del reproductor
 * 3. Sincronización con EventoGuion
 * 4. Diseño compacto para escritorio
 */
function Musica({ setCart, cart, searchQuery, setSearchQuery }) {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS DEL COMPONENTE ███
  // ████████████████████████████████████████████
  
  // [Estado] Almacena todos los bloques musicales (cargados desde bodalistacompleta.json)
  const [bloques, setBloques] = useState({});
  
  // [Estado] Bloque musical actual seleccionado ("todo" o ID específico)
  const [bloqueActual, setBloqueActual] = useState("todo");
  
  // [Estado] Canciones filtradas según el bloque seleccionado
  const [filteredSongs, setFilteredSongs] = useState([]);
  
  // [Estado] Canción actualmente en reproducción
  const [currentSong, setCurrentSong] = useState(null);
  
  // [Estado] Control de reproducción (true = play, false = pause)
  const [isPlaying, setIsPlaying] = useState(false);
  
  // [Estado] Nivel de volumen (0 a 1)
  const [volume, setVolume] = useState(0.7);
  
  // [Ref] Referencia al elemento de audio HTML
  const audioRef = useRef(null);
  
  // [Estado] Control de alertas temporales
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // [Estado] Datos del guión del evento (cargados desde guionBoda.json)
  const [guionEvento, setGuionEvento] = useState(null);
  
  // [Estado] Estados de completado de los bloques del evento
  const [estadosEvento, setEstadosEvento] = useState({});

  // █████████████████████████████████████████████████████████████████████
  // ███ 2. EFECTOS SECUNDARIOS ███
  // █████████████████████████████████████████████████████████████████████

  // [Efecto] Carga inicial de datos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Carga en paralelo ambos archivos JSON
        const [musicaRes, guionRes] = await Promise.all([
          fetch('/bodalistacompleta.json'),
          fetch('/guionBoda.json')
        ]);
        
        if (!musicaRes.ok || !guionRes.ok) throw new Error('Error al cargar datos');
        
        const [musicaData, guionData] = await Promise.all([
          musicaRes.json(),
          guionRes.json()
        ]);
        
        setBloques(musicaData);
        setGuionEvento(guionData);
        setFilteredSongs(Object.values(musicaData).flatMap(bloque => bloque.canciones));
      } catch (err) {
        console.error("Error cargando datos:", err);
        mostrarAlerta("Error cargando datos");
      }
    };

    cargarDatos();
    
    // Cargar estado guardado del localStorage
    const savedState = localStorage.getItem('musicaState');
    if (savedState) {
      const { bloqueActual, currentSong, isPlaying, volume } = JSON.parse(savedState);
      setBloqueActual(bloqueActual);
      setCurrentSong(currentSong);
      setIsPlaying(isPlaying);
      setVolume(volume);
    }
  }, []);

  // [Efecto] Filtra canciones cuando cambia el bloque actual
  useEffect(() => {
    if (!bloqueActual || !bloques) return;
    
    setFilteredSongs(
      bloqueActual === "todo" 
        ? Object.values(bloques).flatMap(bloque => bloque.canciones)
        : bloques[bloqueActual]?.canciones || []
    );
  }, [bloqueActual, bloques]);

  // [Efecto] Persiste el estado importante
  useEffect(() => {
    const state = { bloqueActual, currentSong, isPlaying, volume };
    localStorage.setItem('musicaState', JSON.stringify(state));
  }, [bloqueActual, currentSong, isPlaying, volume]);

  // █████████████████████████████████████████████████████████████████████
  // ███ 3. FUNCIONES PRINCIPALES ███
  // █████████████████████████████████████████████████████████████████████

  /**
   * Muestra una alerta temporal al usuario
   * @param {string} mensaje - Texto a mostrar
   */
  const mostrarAlerta = (mensaje) => {
    setAlertMessage(mensaje);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  /**
   * Reproduce una canción específica
   * @param {Object} song - Canción a reproducir
   */
  const handlePlaySong = (song) => {
    if (currentSong && isPlaying) mostrarAlerta("Cambiando de canción...");
    
    setCurrentSong(song);
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(e => console.error("Error al reproducir:", e));
    }
  };

  /**
   * Alterna entre play/pause
   */
  const handlePlayPause = () => {
    if (!currentSong) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.error("Error al reproducir:", e));
    }
    setIsPlaying(!isPlaying);
  };

  /**
   * Avanza a la siguiente canción
   */
  const handleNext = () => {
    if (!currentSong || filteredSongs.length === 0) return;
    
    const nextIndex = (filteredSongs.findIndex(s => s.id === currentSong.id) + 1) % filteredSongs.length;
    handlePlaySong(filteredSongs[nextIndex]);
  };

  /**
   * Retrocede a la canción anterior
   */
  const handlePrev = () => {
    if (!currentSong || filteredSongs.length === 0) return;
    
    const prevIndex = (filteredSongs.findIndex(s => s.id === currentSong.id) - 1 + filteredSongs.length) % filteredSongs.length;
    handlePlaySong(filteredSongs[prevIndex]);
  };

  /**
   * Maneja cambios en el volumen
   * @param {Object} e - Evento del input
   */
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  /**
   * Alterna entre silenciar/desilenciar
   */
  const handleMute = () => {
    if (audioRef.current) audioRef.current.muted = !audioRef.current.muted;
  };

  /**
   * Maneja cambios en el estado de los bloques
   * @param {string} bloqueId - ID del bloque
   * @param {string} nuevoEstado - "completado" o "pendiente"
   */
  const handleEstadoChange = (bloqueId, nuevoEstado) => {
    setEstadosEvento(prev => ({ ...prev, [bloqueId]: nuevoEstado }));
    
    if (nuevoEstado === 'completado' && bloqueId === bloqueActual) {
      const bloquesIds = guionEvento?.bloques?.map(b => b.id) || [];
      const nextIndex = bloquesIds.indexOf(bloqueId) + 1;
      if (nextIndex > 0 && nextIndex < bloquesIds.length) {
        setBloqueActual(bloquesIds[nextIndex]);
        mostrarAlerta(`Avanzando a ${guionEvento.bloques[nextIndex].nombre}`);
      }
    }
  };

  // █████████████████████████████████████████████████████████████████████
  // ███ 4. RENDERIZADO ███
  // █████████████████████████████████████████████████████████████████████
  return (
    <MusicaProvider>
      <div className="music-page">

      <MusicaFiltros 
              bloques={bloques}
              bloqueActual={bloqueActual}
              setBloqueActual={setBloqueActual}
            />
        {/* Diseño para escritorio (1024px+) */}
        <div className="music-desktop-layout">
          {/* Sección superior compacta (reproductor + filtros) */}
          <div className="music-controls-section">
            <MusicaReproductor 
              currentSong={currentSong}
              isPlaying={isPlaying}
              volume={volume}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrev={handlePrev}
              onVolumeChange={handleVolumeChange}
              onMute={handleMute}
              bloqueActual={bloqueActual}
              bloques={bloques}
              audioRef={audioRef}
            />
            
      
          </div>

          {/* Sección principal dividida en dos columnas */}
          <div className="music-content-section">
            {/* Columna izquierda: Lista de canciones (30% ancho) */}
            <div className="music-songs-column">
              <MusicaCancionesLista 
                songs={filteredSongs}
                currentSong={currentSong}
                onPlaySong={handlePlaySong}
              />
            </div>
            
            {/* Columna derecha: Itinerario del evento (70% ancho) */}
            <div className="evento-guion-column">
              <EventoGuion 
                onBloqueChange={setBloqueActual}
                bloqueActual={bloqueActual}
                guionEvento={guionEvento}
                onEstadoChange={handleEstadoChange}
              />
            </div>
            
          </div>
        </div>

        {/* Diseño para móvil (<1024px) */}
        <div className="music-mobile-layout">
          {/* Contenedor principal móvil */}
          <div className="music-container">
            <audio ref={audioRef} onEnded={handleNext} hidden />
            
            <MusicaReproductor 
              currentSong={currentSong}
              isPlaying={isPlaying}
              volume={volume}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrev={handlePrev}
              onVolumeChange={handleVolumeChange}
              onMute={handleMute}
              bloqueActual={bloqueActual}
              bloques={bloques}
              audioRef={audioRef}
            />
            
            <MusicaFiltros 
              bloques={bloques}
              bloqueActual={bloqueActual}
              setBloqueActual={setBloqueActual}
            />
            
            <MusicaCancionesLista 
              songs={filteredSongs}
              currentSong={currentSong}
              onPlaySong={handlePlaySong}
            />
          </div>
          
          <EventoGuion 
            onBloqueChange={setBloqueActual}
            bloqueActual={bloqueActual}
            guionEvento={guionEvento}
            onEstadoChange={handleEstadoChange}
          />
        </div>

        {/* Alertas temporales (común a ambos diseños) */}
        {showAlert && (
          <div className="alert-message">
            {alertMessage}
          </div>
        )}
      </div>
    </MusicaProvider>
  );
}

export default Musica;