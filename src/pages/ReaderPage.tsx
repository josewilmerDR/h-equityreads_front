// src/pages/ReaderPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Reader from "../components/reader/Reader";

interface ChapterResponse {
  bookId: string;
  number: number;
  title: string;
  contentHtml: string;
}

// Idealmente sacar esto a un archivo de config/env, pero por ahora aquí:
const API_BASE_URL =
  "https://5000-firebase-hreads-back-1763343106367.cluster-dwvm25yncracsxpd26rcd5ja3m.cloudworkstations.dev";

const ReaderPage: React.FC = () => {
  // Asegúrate de que tu ruta en App.tsx sea:  /reader/:bookId/:chapter
  const { bookId, chapter } = useParams<{ bookId: string; chapter: string }>();

  const [chapterData, setChapterData] = useState<ChapterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId || !chapter) {
      setError("Libro o capítulo no especificado.");
      setLoading(false);
      return;
    }

    const chapterNumber = parseInt(chapter, 10);
    if (Number.isNaN(chapterNumber)) {
      setError("Capítulo inválido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Ahora apunta al backend real, no al mismo host del front
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
  }, [bookId, chapter]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="flex-grow">
        {loading && (
          <div className="flex h-full items-center justify-center text-slate-300">
            Cargando capítulo...
          </div>
        )}

        {error && !loading && (
          <div className="flex h-full items-center justify-center text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && chapterData && (
          <Reader
            title={chapterData.title}
            content={chapterData.contentHtml}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ReaderPage;




// // src/pages/ReaderPage.tsx
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Navbar from "../components/layout/Navbar";
// import Footer from "../components/layout/Footer";
// import Reader from "../components/reader/Reader";

// interface ChapterResponse {
//   bookId: string;
//   number: number;
//   title: string;
//   contentHtml: string; // ajusta el nombre si tu API devuelve otro campo
// }

// const ReaderPage: React.FC = () => {
//   const { bookId, chapter } = useParams<{ bookId: string; chapter: string }>();

//   const [chapterData, setChapterData] = useState<ChapterResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!bookId || !chapter) {
//       setError("Libro o capítulo no especificado.");
//       setLoading(false);
//       return;
//     }

//     const chapterNumber = parseInt(chapter, 10);
//     if (Number.isNaN(chapterNumber)) {
//       setError("Capítulo inválido.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     // Si tu backend está en otro host/puerto, ajusta la URL o usa proxy
//     fetch(`/api/books/${bookId}/chapters/${chapterNumber}`)
//       .then((res) => {
//         if (!res.ok) throw new Error("No se pudo cargar el capítulo");
//         return res.json();
//       })
//       .then((data: ChapterResponse) => {
//         setChapterData(data);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Hubo un problema al cargar este capítulo.");
//       })
//       .finally(() => setLoading(false));
//   }, [bookId, chapter]);

//   return (
//     <div className="flex flex-col min-h-screen bg-slate-950 text-white">
//       <Navbar />
//       <main className="flex-grow">
//         {loading && (
//           <div className="flex h-full items-center justify-center text-slate-300">
//             Cargando capítulo...
//           </div>
//         )}

//         {error && !loading && (
//           <div className="flex h-full items-center justify-center text-red-400">
//             {error}
//           </div>
//         )}

//         {!loading && !error && chapterData && (
//           <Reader
//             // 🔴 IMPORTANTE:
//             // Adapta estos nombres de props a cómo tengas definido tu componente Reader.
//             // La idea es que en vez de usar un dummyText interno,
//             // reciba el contenido como prop.
//             title={chapterData.title}
//             content={chapterData.contentHtml}
//           />
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default ReaderPage;



// import React from 'react';
// import Navbar from '../components/layout/Navbar';
// import Footer from '../components/layout/Footer';
// import Reader from '../components/reader/Reader';

// const ReaderPage: React.FC = () => {
//   return (
//     <div className="flex flex-col min-h-screen bg-slate-950 text-white">
//       <Navbar />
//       <main className="flex-grow">
//         <Reader />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default ReaderPage;