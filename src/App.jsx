// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ReaderPage from "./pages/ReaderPage";
import CatalogPage from "./pages/CatalogPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/CategoryDetailPage";

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

        <Route path="/catalog" element={<CatalogPage />} />
        
        <Route path="/categories" element={<CategoriesPage />} />
        
        {/* Nueva ruta dinámica para categorías */}
        <Route path="/category/:categorySlug" element={<CategoryDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
