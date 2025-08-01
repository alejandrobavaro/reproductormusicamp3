import React from "react";
import "../assets/scss/_03-Componentes/_MusicaCancionItem.scss";

function MusicaCancionItem({ song, isCurrent, onPlay }) {
  return (
    <li 
      className={`song-item ${isCurrent ? 'current' : ''}`}
      onClick={onPlay}
    >
      <img 
        src={song.imagen} 
        alt={`Portada de ${song.nombre}`} 
        className="song-cover"
      />
      
      <div className="song-main-info">
        <span className="song-name">{song.nombre}</span>
        <span className="song-artist">{song.artista}</span>
      </div>
      
      <div className="play-indicator">
        {isCurrent ? '▶' : '►'}
      </div>
    </li>
  );
}

export default MusicaCancionItem;