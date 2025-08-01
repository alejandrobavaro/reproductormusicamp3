import React, { useState, useEffect, useRef } from "react";
import { MusicaProvider } from "./MusicaContexto";
import ItinerarioBoda from './ItinerarioBoda';
import MusicaCancionesLista from "./MusicaCancionesLista";
import MusicaReproductor from "./MusicaReproductor";
import MusicaFiltros from "./MusicaFiltros";
import EventoGuion from "./EventoGuion";
import "../assets/scss/_03-Componentes/_Musica.scss";

function Musica() {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS PRINCIPALES DEL REPRODUCTOR ███
  // ████████████████████████████████████████████
  
  // [Estado] Lista completa de bloques musicales (del JSON bodalistacompleta.json)
  const [bloques, setBloques] = useState({});
  
  // [Estado] Bloque musical actual seleccionado (puede ser "todo" o un ID específico)
  const [bloqueActual, setBloqueActual] = useState("todo");
  
  // [Estado] Canciones filtradas según el bloque actual seleccionado
  const [filteredSongs, setFilteredSongs] = useState([]);
  
  // [Estado] Canción que se está reproduciendo actualmente
  const [currentSong, setCurrentSong] = useState(null);
  
  // [Estado] Si el reproductor está en play (true) o pausa (false)
  const [isPlaying, setIsPlaying] = useState(false);
  
  // [Estado] Volumen actual (valor entre 0 y 1)
  const [volume, setVolume] = useState(0.7);
  
  // [Ref] Referencia al elemento de audio HTML para controlarlo directamente
  const audioRef = useRef(null);
  
  // [Estado] Para mostrar alertas temporales al usuario
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // [Estado] Bloque actual según la línea de tiempo del evento (se sincroniza con EventoGuion)
  const [bloqueEventoActual, setBloqueEventoActual] = useState(null);
  
  // [Estado] Datos del guión completo del evento (del JSON guionBoda.json)
  const [guionEvento, setGuionEvento] = useState(null);

  // █████████████████████████████████████████████████████████████████████
  // ███ 2. EFECTOS SECUNDARIOS (Se ejecutan cuando cambian las dependencias)
  // █████████████████████████████████████████████████████████████████████

  // [Efecto] Carga inicial de la playlist musical y el guión del evento
  useEffect(() => {
    // Función para cargar la lista de canciones
    const cargarPlaylistBoda = async () => {
      try {
        const response = await fetch('/bodalistacompleta.json');
        if (!response.ok) throw new Error('Error al cargar la playlist');
        const data = await response.json();
        setBloques(data);
        
        // Inicializa con todas las canciones
        const todasCanciones = Object.values(data).flatMap(bloque => bloque.canciones);
        setFilteredSongs(todasCanciones);
      } catch (err) {
        console.error("Error cargando JSON musical:", err);
      }
    };

    // Función para cargar el guión del evento
    const cargarGuionEvento = async () => {
      try {
        const response = await fetch('/guionBoda.json');
        if (!response.ok) throw new Error('Error al cargar el guión');
        const data = await response.json();
        setGuionEvento(data);
      } catch (err) {
        console.error("Error cargando JSON del guión:", err);
      }
    };

    // Ejecuta ambas cargas en paralelo
    Promise.all([cargarPlaylistBoda(), cargarGuionEvento()]);
  }, []);

  // [Efecto] Filtra las canciones cuando cambia el bloque actual seleccionado
  useEffect(() => {
    if (!bloqueActual || !bloques) return;
    
    if (bloqueActual === "todo") {
      // Muestra todas las canciones de todos los bloques
      const todasCanciones = Object.values(bloques).flatMap(bloque => bloque.canciones);
      setFilteredSongs(todasCanciones);
    } else if (bloques[bloqueActual]) {
      // Muestra solo las canciones del bloque seleccionado
      setFilteredSongs(bloques[bloqueActual].canciones);
    }
  }, [bloqueActual, bloques]);

  // [Efecto] Sincroniza el bloque actual con la línea de tiempo del evento
  useEffect(() => {
    if (bloqueEventoActual) {
      setBloqueActual(bloqueEventoActual);
    }
  }, [bloqueEventoActual]);

  // [Efecto] Carga el estado guardado (persistencia) al iniciar la aplicación
  useEffect(() => {
    const savedState = localStorage.getItem('musicaState');
    if (savedState) {
      const { bloqueActual, currentSong, isPlaying, volume } = JSON.parse(savedState);
      setBloqueActual(bloqueActual);
      setCurrentSong(currentSong);
      setIsPlaying(isPlaying);
      setVolume(volume);
    }
  }, []);

  // [Efecto] Guarda el estado actual en localStorage cuando cambia
  useEffect(() => {
    const state = {
      bloqueActual,
      currentSong,
      isPlaying,
      volume
    };
    localStorage.setItem('musicaState', JSON.stringify(state));
  }, [bloqueActual, currentSong, isPlaying, volume]);

  // █████████████████████████████████████████████████████████████████████
  // ███ 3. FUNCIONES PRINCIPALES DEL REPRODUCTOR
  // █████████████████████████████████████████████████████████████████████

  // [Función] Muestra alertas temporales en la interfaz
  const mostrarAlerta = (mensaje) => {
    setAlertMessage(mensaje);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // [Función] Maneja la selección de una canción para reproducir
  const handlePlaySong = (song) => {
    if (currentSong && isPlaying) {
      mostrarAlerta("Cambiando de canción...");
    }
    
    setCurrentSong(song);
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(e => console.error("Error al reproducir:", e));
    }
  };

  // [Función] Alterna entre play y pause
  const handlePlayPause = () => {
    if (!currentSong) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.error("Error al reproducir:", e));
    }
    setIsPlaying(!isPlaying);
  };

  // [Función] Avanza a la siguiente canción en la lista
  const handleNext = () => {
    if (!currentSong || filteredSongs.length === 0) return;
    
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    handlePlaySong(filteredSongs[nextIndex]);
  };

  // [Función] Retrocede a la canción anterior en la lista
  const handlePrev = () => {
    if (!currentSong || filteredSongs.length === 0) return;
    
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    handlePlaySong(filteredSongs[prevIndex]);
  };

  // [Función] Actualiza el volumen del reproductor
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // [Función] Alterna entre silenciar y desilenciar
  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  // [Función] Maneja la selección de un bloque desde ItinerarioBoda
  const handleBloqueSeleccionado = (bloqueId) => {
    setBloqueActual(bloqueId);
    mostrarAlerta(`Cambiado al bloque: ${bloqueId}`);
  };

  // █████████████████████████████████████████████████████████████████████
  // ███ 4. RENDERIZADO DEL COMPONENTE
  // █████████████████████████████████████████████████████████████████████
  return (
    <MusicaProvider>
      <div className="music-page">
      <EventoGuion 
  onBloqueChange={setBloqueEventoActual}
  bloqueActual={bloqueActual}
  guionEvento={guionEvento}
/>
        
        {/* ███ 4.3 Contenedor principal del reproductor ███ */}
        <div className="music-container">
          {/* Elemento de audio oculto que maneja la reproducción real
              - Se controla mediante la referencia audioRef
              - Al terminar una canción, pasa a la siguiente automáticamente */}
          <audio 
            ref={audioRef} 
            onEnded={handleNext}
            hidden
          />
          
          {/* ███ 4.4 Reproductor principal ███
              - Muestra la canción actual
              - Controles de reproducción
              - Barra de progreso
              - Controles de volumen */}
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
          
          {/* ███ 4.5 Filtros por bloques musicales ███
              - Permite seleccionar bloques musicales
              - Filtra las canciones mostradas */}
          <MusicaFiltros 
            bloques={bloques}
            bloqueActual={bloqueActual}
            setBloqueActual={setBloqueActual}
          />
          
          {/* ███ 4.6 Lista de canciones ███
              - Muestra las canciones del bloque seleccionado
              - Permite seleccionar canciones para reproducir */}
          <MusicaCancionesLista 
            songs={filteredSongs}
            currentSong={currentSong}
            onPlaySong={handlePlaySong}
          />
          
          {/* ███ 4.7 Alertas temporales ███
              - Muestra mensajes de feedback al usuario
              - Se autodesactiva después de 3 segundos */}
          {showAlert && (
            <div className="alert-message">
              {alertMessage}
            </div>
          )}
        </div>
      </div>
    </MusicaProvider>
  );
}

export default Musica;