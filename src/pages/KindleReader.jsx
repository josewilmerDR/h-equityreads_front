import React, { useState } from 'react';
import { ReactReader } from 'react-reader';

export const KindleReader = ({ urlLibro }) => {
  // 'location' guarda la posición exacta (capítulo y párrafo)
  const [location, setLocation] = useState(null);

  const handleLocationChange = (epubcifi) => {
    // epubcifi es un string como "epubcfi(/6/4[chap01ref]!/4/2/1:0)"
    setLocation(epubcifi);
    
    // AQUÍ guardarías en tu Backend o LocalStorage para persistencia
    // localStorage.setItem('book-progress', epubcifi);
    // api.post('/save-progress', { location: epubcifi });
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {/* El componente ReactReader se encarga de todo el formato, paginación y estilos */}
      <ReactReader
        url={urlLibro} // La URL pública de Firebase Storage del archivo .epub
        location={location}
        locationChanged={handleLocationChange}
        title="Mi Clon de Kindle"
        epubOptions={{
          flow: "paginated", // "scrolled" para scroll vertical, "paginated" para estilo Kindle
          width: "100%",
          height: "100%",
        }}
        // Puedes inyectar estilos para modo oscuro aquí
        // theme={myDarkThemeObject} 
      />
    </div>
  );
};