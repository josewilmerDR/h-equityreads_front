// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ReaderPage from "./pages/ReaderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<LandingPage />} />

        {/* Reader con parámetros: bookId y chapter */}
        <Route path="/reader/:bookId/:chapter" element={<ReaderPage />} />

        {/* Si alguien entra a /reader/ sin parámetros, lo redirigimos a inicio */}
        <Route path="/reader" element={<Navigate to="/" replace />} />

        {/* Cualquier otra ruta desconocida también va al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ReaderPage from "./pages/ReaderPage";
// import LandingPage from "./pages/LandingPage";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/reader/:bookId/:chapter" element={<ReaderPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
