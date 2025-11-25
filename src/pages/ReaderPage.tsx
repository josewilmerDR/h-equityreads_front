// src/pages/ReaderPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Reader from "../components/reader/Reader";

interface BookMeta {
  id: string;
  title: string;
  author: string;
  description?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReaderPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [bookMeta, setBookMeta] = useState<BookMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [epubData, setEpubData] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    if (!bookId) {
      setError("ID de libro no especificado");
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchMeta = fetch(`${API_BASE_URL}/api/books/${bookId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar la información del libro");
        return res.json();
      })
      .then((data: BookMeta) => {
        setBookMeta(data);
      });

    const fetchEpub = fetch(`${API_BASE_URL}/api/books/${bookId}/download`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo descargar el archivo del libro");
        return res.arrayBuffer(); 
      })
      .then((buffer) => {
        setEpubData(buffer);
      });

    Promise.all([fetchMeta, fetchEpub])
      .catch((err) => {
        console.error("Error loading book:", err);
        setError("Error al cargar el libro. Por favor intenta más tarde.");
      })
      .finally(() => setLoading(false));

  }, [bookId]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white text-gray-500">
        <span className="animate-pulse">Descargando y abriendo libro...</span>
      </div>
    );
  }

  if (error || !epubData) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-white text-red-500 gap-4">
        <p>{error || "No se pudo cargar el contenido del libro."}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-black transition"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Reader
        title={bookMeta?.title ?? "Libro sin título"}
        author={bookMeta?.author}
        url={epubData as any} 
        bookId={bookId} // Pasamos el ID para la persistencia
      />
    </div>
  );
};

export default ReaderPage;
