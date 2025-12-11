// src/pages/CatalogPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { BookOpen, Star, Tag, Clock, Search } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  description: string;
  coverUrl: string;
  tag: string;
  reads: number;
  isFree: boolean;
}

type CatalogFilter = "todos" | "populares" | "gratis";

const CatalogPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<CatalogFilter>("todos");

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Normalizar base URL
    const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
    const url = base ? `${base}/api/books` : "/api/books";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el catálogo");
        return res.json();
      })
      .then((data: ApiBook[]) => {
        const mapped: Book[] = data.map((b, index) => {
           // Normalización de URL de portada
           let finalCoverUrl = b.coverUrl;
           
           if (finalCoverUrl && !finalCoverUrl.startsWith("http")) {
               // Si no es absoluta
               if (!finalCoverUrl.startsWith("/")) {
                   // Si no empieza con /, agregamos base/
                   finalCoverUrl = base ? `${base}/${finalCoverUrl}` : `/covers/${finalCoverUrl}`; 
                   // Fallback a /covers/ si no hay base definida (dev mode sin backend proxy a veces)
               } else if (base) {
                   // Si empieza con /, concatenamos la base
                   finalCoverUrl = `${base}${finalCoverUrl}`;
               }
           }
           
           // Patch rápido por si el backend devuelve rutas relativas a public que no deberían verse
           if (finalCoverUrl && finalCoverUrl.includes("public/")) {
               finalCoverUrl = finalCoverUrl.replace("public/", "");
           }


          return {
            id: b.id,
            title: b.title,
            author: b.author || "Autor desconocido",
            description: b.description,
            coverUrl: finalCoverUrl,
            tag: "Clásico adaptado",
            reads: 150 + (data.length - index) * 17, // Datos simulados para demo
            isFree: index % 4 === 0, // Datos simulados
          };
        });
        setBooks(mapped);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar el catálogo completo.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredBooks = (() => {
    if (filter === "gratis") return books.filter((b) => b.isFree);
    if (filter === "populares") return [...books].sort((a, b) => b.reads - a.reads);
    return books;
  })();

  const getFilterButtonClasses = (active: boolean) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
      active
        ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 ring-2 ring-amber-500/50"
        : "border border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50 font-sans selection:bg-amber-500/30">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 pt-16 pb-20 md:pt-24 md:pb-28">
           {/* Efectos de fondo */}
           <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
           <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-6xl px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Catálogo <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">Completo</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed mb-10">
              Explora nuestra colección completa de clásicos adaptados. 
              Filtra, busca y descubre tu próxima gran aventura literaria.
            </p>

            {/* Filtros */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => setFilter("todos")} className={getFilterButtonClasses(filter === "todos")}>
                <BookOpen size={14} /> Todos
              </button>
              <button onClick={() => setFilter("populares")} className={getFilterButtonClasses(filter === "populares")}>
                <Star size={14} /> Más populares
              </button>
              <button onClick={() => setFilter("gratis")} className={getFilterButtonClasses(filter === "gratis")}>
                <Tag size={14} /> Gratis
              </button>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16">
          <div className="mx-auto max-w-7xl px-6">
            {/* Loading / Error States */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                <p className="text-slate-400 text-sm animate-pulse">Cargando biblioteca...</p>
              </div>
            )}

            {error && !loading && (
              <div className="py-12 text-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                <p className="font-semibold">Error de conexión</p>
                <p className="text-sm mt-1 opacity-80">{error}</p>
              </div>
            )}

            {!loading && !error && filteredBooks.length === 0 && (
              <div className="py-20 text-center">
                 <Search className="w-16 h-16 mx-auto text-slate-700 mb-4" />
                 <p className="text-slate-400 text-lg">No encontramos libros con este filtro.</p>
                 <button onClick={() => setFilter("todos")} className="mt-4 text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors">Ver todos los libros</button>
              </div>
            )}

            {/* Books Grid */}
            {!loading && !error && filteredBooks.length > 0 && (
              <div className="grid gap-x-6 gap-y-12 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filteredBooks.map((book) => (
                  <Link
                    key={book.id}
                    to={`/reader/${book.id}/1`}
                    state={{ book }}
                    className="group relative flex flex-col"
                  >
                    {/* Cover Image Container */}
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-amber-500/20">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (!target.src.includes("placeholder")) {
                                target.src = "/covers/placeholder.jpg"; // Asegura tener un placeholder si falla
                            }
                        }}
                      />
                      
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      
                      {/* Action Button Overlay */}
                      <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                         <span className="bg-amber-500 text-slate-950 px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-amber-400 transition-colors">
                            Leer ahora
                         </span>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                         {book.isFree && (
                            <span className="backdrop-blur-md bg-emerald-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm ring-1 ring-white/20">
                            GRATIS
                            </span>
                         )}
                         {book.reads > 200 && (
                            <span className="backdrop-blur-md bg-amber-500/90 text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm flex items-center gap-1 ring-1 ring-white/20">
                            <Star size={10} fill="currentColor" /> POPULAR
                            </span>
                         )}
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="mt-5 space-y-1.5 px-1">
                      <h2 className="text-lg font-bold text-slate-100 leading-tight line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {book.title}
                      </h2>
                      <p className="text-sm text-slate-400 font-medium">{book.author}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-800">
                            <BookOpen size={12} className="text-slate-400" /> Adaptado
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-800">
                            <Clock size={12} className="text-slate-400" /> {Math.ceil(book.reads / 20)}m
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CatalogPage;
