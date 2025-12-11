// src/components/home/TopReadBooksSection.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../../types/Book";
import { Trophy, ArrowRight } from "lucide-react";
import "./TopReadBooksSection.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";

const TopReadBooksSection: React.FC = () => {
        const [books, setBooks] = useState<Book[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
                const fetchBooks = async () => {
                        try {
                                const url = BASE_URL ? `${BASE_URL}/api/books` : "/api/books";
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
        const scrollingBooks = topBooks.length > 0 ? [...topBooks, ...topBooks] : [];

        return (
                <section className="relative w-full border-b border-slate-800 bg-slate-950 overflow-hidden py-24">
                        <div className="absolute inset-0 bg-radial-at-t from-slate-900/50 via-slate-950 to-slate-950 pointer-events-none" />

                        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 mb-12">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/60 pb-6">
                                        <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                        <Trophy className="text-amber-500" size={20} />
                                                        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Ranking Semanal</span>
                                                </div>
                                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                                                        Top 10 Más Leídos
                                                </h2>
                                                <p className="mt-3 text-slate-400 max-w-lg text-base leading-relaxed">
                                                        Los favoritos de la comunidad esta semana.
                                                </p>
                                        </div>
                                        <Link
                                                to="/catalog"
                                                className="group flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/10"
                                        >
                                                Ver catálogo <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 text-amber-500" />
                                        </Link>
                                </div>
                        </div>

                        {loading && (
                                <div className="mx-auto w-full max-w-[1400px] px-6 flex gap-8 opacity-50 overflow-hidden">
                                        {[1, 2, 3, 4, 5].map(n => (
                                                <div key={n} className="h-64 min-w-[200px] animate-pulse bg-slate-900/50 rounded-2xl border border-slate-800"></div>
                                        ))}
                                </div>
                        )}

                        {error && (
                                <div className="mx-auto w-full max-w-[1400px] px-6 text-center">
                                        <div className="text-red-400 bg-red-950/30 px-4 py-2 rounded-lg inline-block border border-red-900/50">{error}</div>
                                </div>
                        )}

                        {!loading && !error && scrollingBooks.length > 0 && (
                                <div className="scrolling-wrapper mt-4 pb-10">
                                        <div className="scrolling-track">

                                                {scrollingBooks.map((book, index) => {
                                                        const rank = (index % topBooks.length) + 1;
                                                        const imageUrl = book.coverUrl
                                                                ? (book.coverUrl.startsWith("http")
                                                                        ? book.coverUrl
                                                                        : `${BASE_URL}${book.coverUrl}`)
                                                                : "/covers/placeholder.jpg";

                                                        return (
                                                                <Link
                                                                        key={`${book.id}-${index}`}
                                                                        to={`/reader/${book.id}/1`}
                                                                        className="carrouselItem group block relative mr-4 w-[180px] md:w-[200px]"
                                                                >
                                                                        <div className="w-full transition-transform duration-300 group-hover:-translate-y-2">

                                                                                {/* Contenedor de la Portada */}
                                                                                <div className="relative aspect-[5/8] w-full shadow-lg transition-all duration-500 group-hover:shadow-amber-500/10 group-hover:shadow-2xl rounded-xl">
                                                                                        <div className="h-full w-full overflow-hidden rounded-xl bg-slate-800 relative border border-slate-700/50 group-hover:border-amber-500/30">
                                                                                                <img
                                                                                                        src={imageUrl}
                                                                                                        alt={book.title}
                                                                                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                                                                        loading="lazy"
                                                                                                        onError={(e) => {
                                                                                                                const target = e.currentTarget as HTMLImageElement;
                                                                                                                if (!target.src.includes("placeholder.jpg")) {
                                                                                                                        target.src = "/covers/placeholder.jpg";
                                                                                                                }
                                                                                                        }}
                                                                                                />
                                                                                                {/* Overlay hover */}
                                                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                                                                        </div>

                                                                                        {/* Badge de Ranking (Círculo superpuesto - Esquina Superior Izquierda y Pequeño) */}
                                                                                        <div className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center shadow-xl z-20 group-hover:border-amber-500/50 group-hover:scale-110 transition-all duration-300">
                                                                                                <span className="font-serif text-lg font-bold text-slate-200 group-hover:text-amber-400">{rank}</span>
                                                                                        </div>
                                                                                </div>

                                                                                {/* Info del libro */}
                                                                                <div className="mt-6 px-1 text-left">
                                                                                        <h3 className="text-base font-bold leading-tight text-slate-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
                                                                                                {book.title}
                                                                                        </h3>
                                                                                        <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-1">
                                                                                                {book.author}
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                </Link>
                                                        );
                                                })}
                                        </div>
                                </div>
                        )}
                </section>
        );
};

export default TopReadBooksSection;
