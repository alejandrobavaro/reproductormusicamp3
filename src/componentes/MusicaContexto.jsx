import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

export const MusicaContexto = createContext();

export function MusicaProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Cargar favoritos desde localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('musicFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Guardar favoritos en localStorage
  useEffect(() => {
    localStorage.setItem('musicFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Reproducir canción específica
  const playSong = useCallback((song) => {
    const songIndex = cart.findIndex(s => s.id === song.id);
    if (songIndex !== -1) {
      setCurrentSongIndex(songIndex);
      setIsPlaying(true);
    }
  }, [cart]);

  // Pausar canción
  const pauseSong = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Siguiente canción
  const skipNext = useCallback(() => {
    setCurrentSongIndex(prev => (prev + 1) % cart.length);
  }, [cart.length]);

  // Canción anterior
  const skipPrev = useCallback(() => {
    setCurrentSongIndex(prev => (prev === 0 ? cart.length - 1 : prev - 1));
  }, [cart.length]);

  // Alternar silencio
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Manejar cambio de volumen
  const handleVolumeChange = useCallback((newVolume) => {
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  }, []);

  // Manejar cambio de progreso
  const handleProgressChange = useCallback((percent) => {
    if (!audioRef.current) return;
    const newTime = (percent / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  // Añadir a favoritos
  const addToFavorites = useCallback((songId) => {
    setFavorites(prev => [...prev, songId]);
  }, []);

  // Quitar de favoritos
  const removeFromFavorites = useCallback((songId) => {
    setFavorites(prev => prev.filter(id => id !== songId));
  }, []);

  // Efecto para manejar la reproducción
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || cart.length === 0) return;

    const currentSong = cart[currentSongIndex];
    if (!currentSong?.url) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => skipNext();

    audio.src = currentSong.url;
    audio.volume = isMuted ? 0 : volume;
    audio.load();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(err => {
        console.error("Error al reproducir:", err);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [currentSongIndex, cart, isPlaying, volume, isMuted, skipNext]);

  return (
    <MusicaContexto.Provider value={{
      cart,
      setCart,
      favorites,
      currentSongIndex,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      playSong,
      pauseSong,
      skipNext,
      skipPrev,
      toggleMute,
      setVolume: handleVolumeChange,
      handleProgressChange,
      addToFavorites,
      removeFromFavorites
    }}>
      {children}
      <audio ref={audioRef} />
    </MusicaContexto.Provider>
  );
}