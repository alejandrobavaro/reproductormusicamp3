import React, { useState, useEffect } from "react";
import "../assets/scss/_03-Componentes/_MusicaReproductor.scss";

function MusicaReproductor({ 
  currentSong,     // Canción actualmente seleccionada
  isPlaying,       // Estado de reproducción (true/false)
  volume,          // Volumen actual (0-1)
  onPlayPause,     // Función para play/pause
  onNext,          // Función para siguiente canción
  onPrev,          // Función para canción anterior
  onVolumeChange,  // Función para cambiar volumen
  onMute,          // Función para silenciar
  bloqueActual,    // ID del bloque actual
  bloques,         // Objeto con todos los bloques
  audioRef         // Referencia al elemento de audio
}) {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS DEL REPRODUCTOR ███
  // ████████████████████████████████████████████
  
  // [Estado] Tiempo transcurrido de la canción actual
  const [currentTime, setCurrentTime] = useState(0);
  
  // [Estado] Duración total de la canción actual
  const [duration, setDuration] = useState(0);
  
  // [Estado] Si está activo el efecto de fade
  const [fadeActive, setFadeActive] = useState(false);

  // █████████████████████████████████████████████████████████████████████
  // ███ 2. EFECTOS SECUNDARIOS ███
  // █████████████████████████████████████████████████████████████████████

  // [Efecto] Maneja la actualización del tiempo y el fade
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Función para fade out al final de la canción
    const startFadeOut = () => {
      if (audio.duration - audio.currentTime < 3) {
        setFadeActive(true);
        const fadeInterval = setInterval(() => {
          if (audio.volume > 0.1) {
            audio.volume = Math.max(0, audio.volume - 0.05);
          } else {
            clearInterval(fadeInterval);
            onNext();
          }
        }, 100);
      }
    };

    // Función para fade in al inicio
    const handleLoaded = () => {
      setDuration(audio.duration || 0);
      if (isPlaying) {
        audio.volume = 0;
        audio.play().then(() => {
          let vol = 0;
          const fadeInInterval = setInterval(() => {
            vol = Math.min(volume, vol + 0.05);
            audio.volume = vol;
            if (vol >= volume) {
              clearInterval(fadeInInterval);
              setFadeActive(false);
            }
          }, 100);
        });
      }
    };

    // Event listeners
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      if (!fadeActive) startFadeOut();
    });

    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('ended', onNext);

    // Limpieza
    return () => {
      audio.removeEventListener('timeupdate', startFadeOut);
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('ended', onNext);
    };
  }, [audioRef, isPlaying, volume, fadeActive, onNext]);

  // █████████████████████████████████████████████████████████████████████
  // ███ 3. FUNCIONES AUXILIARES ███
  // █████████████████████████████████████████████████████████████████████

  // [Función] Formatea el tiempo a mm:ss
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // [Función] Maneja el seek en la barra de progreso
  const handleSeek = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime = e.target.value;
    }
  };

  // [Función] Obtiene el nombre del bloque actual
  const getBlockName = () => {
    if (bloqueActual === "todo") return "Todo el evento";
    return bloques[bloqueActual]?.bloque_musical || "";
  };

  // █████████████████████████████████████████████████████████████████████
  // ███ 4. RENDERIZADO DEL REPRODUCTOR ███
  // █████████████████████████████████████████████████████████████████████
  return (
    <div className="player-container">
      {/* ███ 4.1 Información de la canción actual ███ */}
      <div className="now-playing">
        {currentSong ? (
          <>
            <img 
              src={currentSong.imagen} 
              alt="Portada actual" 
              className="now-playing-cover"
            />
            <div className="now-playing-info">
              <div className="now-playing-name">{currentSong.nombre}</div>
              <div className="now-playing-artist">{currentSong.artista}</div>
              <div className="now-playing-block">{getBlockName()}</div>
              <div className="now-playing-duration">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </>
        ) : (
          <div className="no-song">Selecciona una canción</div>
        )}
      </div>
      
      {/* ███ 4.2 Barra de progreso ███ */}
      <div className="progress-container">
        <input 
          type="range" 
          min="0" 
          max={duration || 100} 
          value={currentTime} 
          onChange={handleSeek}
          className="progress-bar"
        />
      </div>
      
      {/* ███ 4.3 Controles de reproducción ███ */}
      <div className="player-controls">
        <button className="control-btn prev-btn" onClick={onPrev}>⏮</button>
        <button className="control-btn play-btn" onClick={onPlayPause}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="control-btn next-btn" onClick={onNext}>⏭</button>
      </div>
      
      {/* ███ 4.4 Controles de volumen ███ */}
      <div className="volume-controls">
        <button className="volume-btn" onClick={onMute}>
          {volume === 0 ? '🔇' : '🔊'}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={onVolumeChange}
          className="volume-slider"
        />
      </div>
    </div>
  );
}

export default MusicaReproductor;