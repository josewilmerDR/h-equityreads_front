import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../../types/Book";
import "./TopReadBooksSection.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TopReadBooksSection: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
        const url = base ? `${base}/api/books` : "/api/books"; 
        
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Book[] = await res.json();
        setBooks(data);
      } catch (err: any) {
        console.error("Failed to fetch books:", err);
        setError(err.message ?? "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const topBooks = books.slice(0, 10);
  // Eliminamos duplicación innecesaria ya que usamos scroll manual
  const scrollingBooks = topBooks.length > 0 ? [...topBooks, ...topBooks] : [];

  return (
    <section className="w-full border-b border-slate-800 bg-slate-950 overflow-hidden">
      <div className="w-full py-16">
        
        <div className="mx-auto w-full max-w-[1400px] px-6 mb-8">
            <div className="flex items-end justify-between border-b border-slate-800/60 pb-4">
            <div>
                <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
                Top 10 Más Leídos
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                Tendencias actuales en h-equity reads
                </p>
            </div>
            <Link
                to="/catalog"
                className="text-sm font-semibold text-amber-500 hover:text-amber-400 transition-colors"
            >
                Ver catálogo completo &rarr;
            </Link>
            </div>
        </div>

        {loading && (
             <div className="mx-auto w-full max-w-[1400px] px-6">
                <div className="h-64 w-full animate-pulse bg-slate-900/50 rounded-xl"></div>
             </div>
        )}
        
        {error && (
             <div className="mx-auto w-full max-w-[1400px] px-6">
                <div className="text-red-400">Error cargando libros: {error}</div>
             </div>
        )}

        {!loading && !error && scrollingBooks.length > 0 && (
          <div className="scrolling-wrapper mt-6">
            <div className="scrolling-track">
              
              {scrollingBooks.map((book, index) => {
                const rank = (index % topBooks.length) + 1;
                return (
                  <Link 
                    key={`${book.id}-${index}`} 
                    to={`/reader/${book.id}/1`}
                    className="carrouselItem group block"
                  >
                    <div className="relative">
                        
                        <span 
                            className="absolute -left-4 bottom-0 z-0 text-[160px] font-black leading-[0.8] tracking-tighter text-slate-950 select-none font-serif"
                            style={{ 
                                WebkitTextStroke: '4px #475569', 
                                textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                            }}
                        >
                            {rank}
                        </span>

                        {/* Contenedor de la Portada */}
                        {/* Eliminé las clases de transformación aquí para que el CSS padre controle el scale uniforme */}
                        <div className="relative z-10 ml-[80px] w-[130px] sm:w-[150px] shadow-2xl transition-shadow duration-300 group-hover:shadow-amber-500/20">
                            <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-slate-800 relative">
                                <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                    onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = "/covers/placeholder.jpg";
                                    }}
                                />
                                
                                {/* Gradiente original */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                                {/* NUEVO: Overlay oscuro + Botón 'Leer ahora' */}
                                <div className="book-overlay">
                                    <span className="read-now-btn">
                                        Leer ahora
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pl-[80px] text-left transition-opacity duration-300 opacity-70 group-hover:opacity-100">
                      <h3 className="text-sm font-bold leading-tight text-slate-200 line-clamp-2 group-hover:text-amber-400">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                        {book.author}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopReadBooksSection;
