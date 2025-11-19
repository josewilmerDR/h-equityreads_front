// src/pages/CatalogPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const API_BASE_URL =
  "https://5000-firebase-hreads-back-1763343106367.cluster-dwvm25yncracsxpd26rcd5ja3m.cloudworkstations.dev";

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
  reads: number;   // simulado
  isFree: boolean; // simulado
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

    fetch(`${API_BASE_URL}/api/books`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el catálogo");
        return res.json();
      })
      .then((data: ApiBook[]) => {
        const mapped: Book[] = data.map((b, index) => ({
          id: b.id,
          title: b.title,
          author: b.author || "Autor desconocido",
          description: b.description,
          coverUrl: `${API_BASE_URL}${b.coverUrl}`, // asumiendo que coverUrl empieza con "/"
          tag: "Clásico adaptado",
          // simulamos popularidad y “gratis”
          reads: 150 + (data.length - index) * 17,
          isFree: index % 4 === 0, // 1 de cada 4 como gratis
        }));
        setBooks(mapped);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar el catálogo completo.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredBooks = (() => {
    if (filter === "gratis") {
      return books.filter((b) => b.isFree);
    }
    if (filter === "populares") {
      // ordenamos por lecturas descendente
      return [...books].sort((a, b) => b.reads - a.reads);
    }
    return books;
  })();

  const getFilterButtonClasses = (active: boolean) =>
    [
      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
      active
        ? "bg-amber-400 text-slate-950"
        : "border border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-900",
    ].join(" ");

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />

      <main className="flex-1 border-t border-slate-800 bg-slate-950">
        <section className="border-b border-slate-800 bg-radial-at-t from-amber-400/10 via-slate-950 to-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Catálogo completo
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Todos los libros de h-equity reads en un solo lugar. Encuentra tu
              próxima lectura y continúa justo donde la dejaste.
            </p>

            {/* Filtros */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilter("todos")}
                className={getFilterButtonClasses(filter === "todos")}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFilter("populares")}
                className={getFilterButtonClasses(filter === "populares")}
              >
                Más populares
              </button>
              <button
                type="button"
                onClick={() => setFilter("gratis")}
                className={getFilterButtonClasses(filter === "gratis")}
              >
                Gratis
              </button>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            {/* Estados de carga / error */}
            {loading && (
              <div className="py-12 text-center text-sm text-slate-300">
                Cargando catálogo...
              </div>
            )}

            {error && !loading && (
              <div className="py-12 text-center text-sm text-red-400">
                {error}
              </div>
            )}

            {!loading && !error && filteredBooks.length === 0 && (
              <div className="py-12 text-center text-sm text-slate-400">
                No encontramos libros para este filtro. Prueba con otra opción.
              </div>
            )}

            {/* Grid de libros */}
            {!loading && !error && filteredBooks.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredBooks.map((book) => (
                  <Link
                    key={book.id}
                    to={`/reader/${book.id}/1`}
                    state={{ book }}
                    className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-3 hover:border-amber-400/70 hover:bg-slate-900 transition-colors"
                  >
                    <div className="relative mb-3">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="h-48 w-full rounded-xl object-cover"
                      />
                      {book.isFree && (
                        <span className="absolute left-2 top-2 rounded-full bg-emerald-400 px-2 py-0.5 text-[11px] font-semibold text-slate-950">
                          Gratis
                        </span>
                      )}
                    </div>

                    <h2 className="text-sm font-semibold text-slate-50 line-clamp-2">
                      {book.title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-300 line-clamp-1">
                      {book.author}
                    </p>

                    <p className="mt-2 text-[11px] text-amber-200/90 line-clamp-2">
                      {book.tag}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Edición adaptada</span>
                      <span>{book.reads} lecturas</span>
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
