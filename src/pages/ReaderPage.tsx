// src/pages/ReaderPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Reader from "../components/reader/Reader";

// Tipos de respuesta de tu API
interface ChapterResponse {
  bookId: string;
  number: number;
  title: string;
  contentHtml: string;
}

interface BookMeta {
  id: string;
  title: string;
  author: string;
  chapters: { number: number; title: string }[];
}

// URL base (idealmente mover a .env)
const API_BASE_URL =
  "https://5000-firebase-hreads-back-1763343106367.cluster-dwvm25yncracsxpd26rcd5ja3m.cloudworkstations.dev";

const ReaderPage: React.FC = () => {
  const { bookId, chapter } = useParams<{ bookId: string; chapter: string }>();
  const navigate = useNavigate();

  const [chapterData, setChapterData] = useState<ChapterResponse | null>(null);
  const [bookMeta, setBookMeta] = useState<BookMeta | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chapterNumber = chapter ? parseInt(chapter, 10) : NaN;

  // 1. Cargar metadatos del libro
  useEffect(() => {
    if (!bookId) return;

    fetch(`${API_BASE_URL}/api/books/${bookId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el libro");
        return res.json();
      })
      .then((data: BookMeta) => {
        setBookMeta(data);
      })
      .catch((err) => {
        console.error("Error fetching book meta:", err);
      });
  }, [bookId]);

  // 2. Cargar contenido del capítulo
  useEffect(() => {
    if (!bookId || !chapter) {
      setError("Libro o capítulo no especificado.");
      setLoading(false);
      return;
    }

    if (Number.isNaN(chapterNumber)) {
      setError("Capítulo inválido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/books/${bookId}/chapters/${chapterNumber}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el capítulo");
        return res.json();
      })
      .then((data: ChapterResponse) => {
        setChapterData(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Hubo un problema al cargar este capítulo.");
      })
      .finally(() => setLoading(false));
  }, [bookId, chapterNumber]);

  // Lógica de navegación entre capítulos
  const totalChapters = bookMeta?.chapters?.length ?? undefined;

  const hasPrevChapter = !Number.isNaN(chapterNumber) && chapterNumber > 1;
  const hasNextChapter =
    !Number.isNaN(chapterNumber) &&
    (totalChapters ? chapterNumber < totalChapters : true); // Si no sabemos el total, asumimos true hasta fallar

  const handleNextChapter = () => {
    if (!bookId || Number.isNaN(chapterNumber)) return;
    if (totalChapters && chapterNumber >= totalChapters) return;
    navigate(`/reader/${bookId}/${chapterNumber + 1}`);
  };

  const handlePrevChapter = () => {
    if (!bookId || Number.isNaN(chapterNumber)) return;
    if (chapterNumber <= 1) return;
    navigate(`/reader/${bookId}/${chapterNumber - 1}`);
  };

  // --- ESTADOS DE CARGA Y ERROR ---
  
  // Usamos un fondo blanco simple o skeleton loader mientras carga
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white text-gray-500">
        <span className="animate-pulse">Cargando contenido...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-white text-red-500 gap-4">
        <p>{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-black transition"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  if (!chapterData) return null;

  // --- RENDERIZADO DEL LECTOR ---
  return (
    // Nota: Quitamos Navbar y Footer globales para modo inmersivo
    // El componente Reader ocupa el 100% de width y height
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Reader
        // Datos del libro
        title={bookMeta?.title ?? "Libro Desconocido"}
        chapterTitle={chapterData.title}
        author={bookMeta?.author}
        
        // Contenido
        contentHtml={chapterData.contentHtml}
        
        // Configuración inicial
        initialLocation={0} 
        
        // Navegación entre capítulos
        onRequestNextChapter={handleNextChapter}
        onRequestPrevChapter={handlePrevChapter}
        hasNextChapter={hasNextChapter}
        hasPrevChapter={hasPrevChapter}
      />
    </div>
  );
};

export default ReaderPage;
