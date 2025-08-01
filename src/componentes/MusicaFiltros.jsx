import React from "react";
import "../assets/scss/_03-Componentes/_MusicaFiltros.scss";

function MusicaFiltros({ bloques, bloqueActual, setBloqueActual }) {
  return (
    <div className="filters-container">
<h6>Bloques Guión</h6>
      <div className="quick-buttons">
        <button 
          className={bloqueActual === "todo" ? "active" : ""}
          onClick={() => setBloqueActual("todo")}
        >
          Todo
        </button>
        
        {Object.keys(bloques).map((bloqueKey) => (
          <button
            key={bloqueKey}
            className={bloqueActual === bloqueKey ? "active" : ""}
            onClick={() => setBloqueActual(bloqueKey)}
          >
            {bloques[bloqueKey].bloque_musical.split(" ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MusicaFiltros;