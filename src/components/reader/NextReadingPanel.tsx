// src/components/NextReadingPanel.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ApiBook {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  tag: string;
}

interface NextReadingPanelProps {
  // opcional: si no recibes nada, el componente se encarga de pedirlos al backend
  featuredBooks?: Book[];
}

// idealmente esto debería ir en un archivo de config/env
const API_BASE_URL =
  "https://5000-firebase-hreads-back-1763343106367.cluster-dwvm25yncracsxpd26rcd5ja3m.cloudworkstations.dev";

const NextReadingPanel: React.FC<NextReadingPanelProps> = ({
  featuredBooks = [],
}) => {
  const [books, setBooks] = useState<Book[]>(featuredBooks);
  const [loading, setLoading] = useState(featuredBooks.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si ya nos pasaron libros por props, no hace falta ir al backend
    if (featuredBooks.length > 0) {
      setBooks(featuredBooks);
      setLoading(false);
      return;
    }

    // Si no, los traemos del backend
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/books`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar la lista de libros");
        return res.json();
      })
      .then((data: ApiBook[]) => {
        // Por ahora, inventamos un tag básico. Más adelante puedes meter
        // difficulty, genre, etc. en el backend y mapearlo aquí.
        const mapped: Book[] = data.map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author || "Autor desconocido",
          tag: "Clásico recomendado",
        }));

        // Si quieres solo 3 destacados:
        setBooks(mapped.slice(0, 3));
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar las lecturas recomendadas.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [featuredBooks]);

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-4 rounded-3xl bg-amber-400/10 blur-2xl" />
        <div className="relative rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_40px_rgba(15,23,42,1)]">
          {/* encabezado */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-400 to-rose-400" />
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-slate-200">
                  Tu próxima lectura
                </span>
                <span className="text-[11px] text-slate-400">
                  Seleccionada para ti
                </span>
              </div>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-medium text-amber-200">
              1 mes gratis
            </span>
          </div>

          {/* estado de carga / error */}
          {loading && (
            <div className="py-6 text-center text-xs text-slate-400">
              Cargando recomendaciones...
            </div>
          )}

          {error && !loading && (
            <div className="py-6 text-center text-xs text-red-400">
              {error}
            </div>
          )}

          {/* lista de libros */}
          {!loading && !error && books.length > 0 && (
            <div className="space-y-3">
              {books.map((book) => (
                <Link
                  key={book.id}
                  to={`/reader/${book.id}/1`}
                  state={{ book }}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-3 py-3
                           hover:border-amber-300/70 hover:bg-slate-900/80 transition-colors cursor-pointer"
                >
                  <div
                    className="flex h-14 w-10 flex-shrink-0 items-center justify-center overflow-hidden
                                rounded-md bg-gradient-to-b from-slate-700 to-slate-900"
                  >
                    <span className="text-[10px] font-semibold tracking-tight text-amber-200">
                      {book.title
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")}
                    </span>
                  </div>

                  <div className="flex-1">
                    <p className="text-[13px] font-semibold leading-snug text-slate-50">
                      {book.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {book.author}
                    </p>
                    <span
                      className="mt-1 inline-flex max-w-max rounded-full bg-amber-400/10 px-2 py-0.5
                                   text-[10px] font-medium text-amber-200"
                    >
                      {book.tag}
                    </span>
                  </div>

                  <span
                    className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1
                               text-[11px] font-medium text-slate-200
                               group-hover:border-amber-300 group-hover:text-amber-200"
                  >
                    Leer
                  </span>
                </Link>
              ))}
            </div>
          )}

          {!loading && !error && books.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-500">
              Aún no hay libros disponibles. Pronto agregaremos tus primeras
              lecturas.
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-3 text-[11px] text-slate-300">
            <p className="font-medium text-slate-200">
              ¿Y si la lectura clásica fuera tan cómoda como una app de música?
            </p>
            <p className="mt-1">
              En h-equity reads abres, eliges un título y sigues leyendo justo
              donde te quedaste. Sin anuncios, sin distracciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextReadingPanel;



// import React from "react";
// import { Link } from "react-router-dom";

// interface Book {
//   id: number;
//   title: string;
//   author: string;
//   tag: string;
// }

// interface NextReadingPanelProps {
//   featuredBooks: Book[];
// }

// const NextReadingPanel: React.FC<NextReadingPanelProps> = ({ featuredBooks = [] }) => {
//   return (
//     <div className="flex items-center justify-center">
//       <div className="relative w-full max-w-md">
//         <div className="absolute -inset-4 rounded-3xl bg-amber-400/10 blur-2xl" />
//         <div className="relative rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_40px_rgba(15,23,42,1)]">
//           {/* encabezado */}
//           <div className="mb-4 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-400 to-rose-400" />
//               <div className="flex flex-col leading-tight">
//                 <span className="text-xs font-semibold text-slate-200">
//                   Tu próxima lectura
//                 </span>
//                 <span className="text-[11px] text-slate-400">
//                   Seleccionada para ti
//                 </span>
//               </div>
//             </div>
//             <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-medium text-amber-200">
//               1 mes gratis
//             </span>
//           </div>

//           {/* lista de libros */}
//           <div className="space-y-3">
//             {featuredBooks.map((book) => (
//               <Link
//                 key={book.id}
//                 to={`/reader/${book.id}/1`}
//                 state={{ book }} // opcional: pasar el objeto completo
//                 className="group flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-3 py-3
//                            hover:border-amber-300/70 hover:bg-slate-900/80 transition-colors cursor-pointer"
//               >
//                 <div
//                   className="flex h-14 w-10 flex-shrink-0 items-center justify-center overflow-hidden
//                                 rounded-md bg-gradient-to-b from-slate-700 to-slate-900"
//                 >
//                   <span className="text-[10px] font-semibold tracking-tight text-amber-200">
//                     {book.title
//                       .split(" ")
//                       .slice(0, 2)
//                       .map((w) => w[0])
//                       .join("")}
//                   </span>
//                 </div>

//                 <div className="flex-1">
//                   <p className="text-[13px] font-semibold leading-snug text-slate-50">
//                     {book.title}
//                   </p>
//                   <p className="text-[11px] text-slate-400 mt-0.5">
//                     {book.author}
//                   </p>
//                   <span
//                     className="mt-1 inline-flex max-w-max rounded-full bg-amber-400/10 px-2 py-0.5
//                                    text-[10px] font-medium text-amber-200"
//                   >
//                     {book.tag}
//                   </span>
//                 </div>

//                 <span
//                   className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1
//                              text-[11px] font-medium text-slate-200
//                              group-hover:border-amber-300 group-hover:text-amber-200"
//                 >
//                   Leer
//                 </span>
//               </Link>
//             ))}
//           </div>

//           <div className="mt-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-3 text-[11px] text-slate-300">
//             <p className="font-medium text-slate-200">
//               ¿Y si la lectura clásica fuera tan cómoda como una app de música?
//             </p>
//             <p className="mt-1">
//               En h-equity reads abres, eliges un título y sigues leyendo justo
//               donde te quedaste. Sin anuncios, sin distracciones.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NextReadingPanel;
