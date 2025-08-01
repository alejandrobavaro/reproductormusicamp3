import React, { Suspense } from "react";
import Musica from './Musica';

import "../assets/scss/_03-Componentes/_HomeMainContent.scss";

// Carga diferida con manejo de errores
const HomePublicidadSlider = React.lazy(() => 
  import("./HomePublicidadSlider")
    .catch(() => ({ 
      default: () => <div className="slider-placeholder">Publicidad no disponible</div> 
    }))
);

const HomeMainContent = () => {
  return (
    <main className="cyberpunk-main">

<Musica />
{/* 
      <section className="cyberpunk-section cyberpunk-section--alt">
        <Suspense fallback={<div className="slider-loading">Cargando publicidad...</div>}>
          <HomePublicidadSlider />
        </Suspense>
      </section> */}

      <section className="cyberpunk-section">

 
      
      </section>
    </main>
  );
};

export default HomeMainContent;