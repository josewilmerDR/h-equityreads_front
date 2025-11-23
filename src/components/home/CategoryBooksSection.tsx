import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../../types/Book";
import "./CategoryBooksSection.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CategoryBooksSection: React.FC = () => {
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

  // Tomamos algunos libros para la sección de categorías (simulada por ahora)
  const categoryBooks = books.slice(0, 10);
  // Duplicamos para el scroll infinito si hay suficientes elementos
  const scrollingBooks = categoryBooks.length > 0 ? [...categoryBooks, ...categoryBooks] : [];

  return (
    <section className="w-full border-b border-slate-800 bg-slate-950 overflow-hidden">
      <div className="w-full py-16">
        
        <div className="mx-auto w-full max-w-[1400px] px-6 mb-8">
            <div className="flex items-end justify-between border-b border-slate-800/60 pb-4">
            <div>
                <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
                Explora por Categorías
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                Encuentra tu próxima gran historia
                </p>
            </div>
            <Link
                to="/categories"
                className="text-sm font-semibold text-amber-500 hover:text-amber-400 transition-colors"
            >
                Ver todas las categorías &rarr;
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
          <div className="scrolling-wrapper-categories mt-6">
            <div className="scrolling-track-categories">
              
              {scrollingBooks.map((book, index) => {
                return (
                  <Link 
                    key={`${book.id}-${index}`} 
                    to={`/reader/${book.id}/1`}
                    className="carrouselItem-categories group block"
                  >
                    <div className="relative">
                        
                        {/* Contenedor de la Portada */}
                        <div className="relative z-10 w-[150px] shadow-2xl transition-shadow duration-300 group-hover:shadow-amber-500/20 mx-auto">
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

                                {/* Overlay oscuro + Botón 'Leer ahora' */}
                                <div className="book-overlay-categories">
                                    <span className="read-now-btn-categories">
                                        Leer ahora
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-center transition-opacity duration-300 opacity-70 group-hover:opacity-100">
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

export default CategoryBooksSection;
