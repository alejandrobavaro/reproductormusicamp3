import React from "react";
import MusicaCancionItem from "./MusicaCancionItem";
import "../assets/scss/_03-Componentes/_MusicaCancionesLista.scss";

function MusicaCancionesLista({ songs, currentSong, onPlaySong }) {
  return (
    <div className="songs-list-container">
      {songs.length === 0 ? (
        <div className="no-songs">No hay canciones disponibles</div>
      ) : (
        <ul className="songs-list">
          {songs.map((song) => (
            <MusicaCancionItem 
              key={song.id} 
              song={song}
              isCurrent={currentSong?.id === song.id}
              onPlay={() => onPlaySong(song)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default MusicaCancionesLista;