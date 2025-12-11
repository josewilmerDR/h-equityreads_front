// src/components/home/CategoryBooksSection.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../../types/Book";
import { 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Map as MapIcon, 
  Search, 
  Wand2, 
  Rocket, 
  BookOpen, 
  Hourglass, 
  Smile, 
  Coffee, 
  Ghost, 
  Moon 
} from "lucide-react";
import "./CategoryBooksSection.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";

interface CategoryData {
  name: string;
  slug: string;
  count: number;
  coverUrl: string;
  color: string;
  icon: React.ElementType;
}

const CATEGORY_METADATA: Record<string, { name: string; color: string; icon: any }> = {
    "romance": { name: "Romance", color: "from-rose-400 to-red-500", icon: Heart },
    "aventura": { name: "Aventura", color: "from-amber-400 to-orange-500", icon: MapIcon },
    "misterio": { name: "Misterio", color: "from-blue-400 to-indigo-500", icon: Search },
    "terror": { name: "Terror", color: "from-slate-700 to-black", icon: Ghost },
    "dark-romance": { name: "Dark Romance", color: "from-purple-900 to-rose-950", icon: Moon },
    "fantasia": { name: "Fantasía", color: "from-purple-400 to-pink-500", icon: Wand2 },
    "ciencia-ficcion": { name: "Ciencia ficción", color: "from-emerald-400 to-green-500", icon: Rocket },
    "clasicos": { name: "Clásicos", color: "from-slate-300 to-slate-600", icon: BookOpen },
    "drama-historico": { name: "Drama histórico", color: "from-orange-300 to-amber-500", icon: Hourglass },
    "humor": { name: "Humor", color: "from-yellow-300 to-lime-500", icon: Smile },
    "cuentos-cortos": { name: "Cuentos cortos", color: "from-cyan-300 to-sky-500", icon: Coffee },
    "juvenil": { name: "Juvenil", color: "from-fuchsia-400 to-purple-500", icon: Sparkles },
};

const DEFAULT_CATEGORY = { name: "General", color: "from-slate-500 to-slate-700", icon: BookOpen };

const CategoryBooksSection: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = BASE_URL ? `${BASE_URL}/api/books` : "/api/books"; 
        
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const books: Book[] = await res.json();
        
        const catMap = new Map<string, { count: number; cover: string }>();

        books.forEach(book => {
            if (!book.category) return;
            const cats = book.category.split(',').map(c => c.trim().toLowerCase().replace(/\s+/g, '-'));
            
            // Resolve cover URL
            let coverUrl = book.coverUrl || "/covers/placeholder.jpg";
            if (!coverUrl.startsWith("http")) {
                let cleanPath = coverUrl;
                if (cleanPath.startsWith("public/")) cleanPath = cleanPath.replace("public/", "");
                if (!cleanPath.startsWith("/")) cleanPath = `/${cleanPath}`;
                 if (BASE_URL && !cleanPath.includes("/covers/")) {
                    coverUrl = `${BASE_URL}${cleanPath}`;
                } else {
                    coverUrl = cleanPath;
                }
            }

            cats.forEach(slug => {
                if (!slug) return;
                if (!catMap.has(slug)) {
                    catMap.set(slug, { count: 0, cover: coverUrl });
                }
                const entry = catMap.get(slug)!;
                entry.count++;
                // We keep the first found cover as representative
            });
        });

        const sortedSlugs = Array.from(catMap.keys()).sort((a, b) => {
             return catMap.get(b)!.count - catMap.get(a)!.count;
        });

        const topCategories = sortedSlugs.slice(0, 10).map(slug => {
            const meta = CATEGORY_METADATA[slug] || { ...DEFAULT_CATEGORY, name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') };
            const data = catMap.get(slug)!;
            return {
                name: meta.name,
                slug,
                count: data.count,
                coverUrl: data.cover,
                color: meta.color,
                icon: meta.icon
            };
        });

        setCategories(topCategories);
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
        setError(err.message ?? "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Duplicamos para asegurar un scroll infinito fluido
  const scrollingCategories = categories.length > 0 
    ? [...categories, ...categories, ...categories]
    : [];

  return (
    <section className="relative w-full border-b border-slate-800 bg-slate-950 overflow-hidden py-24">
      
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
                    <Sparkles size={14} />
                </span>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Explora por Temáticas</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Encuentra tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">género favorito</span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl text-base leading-relaxed">
              Desde el romance más dulce hasta el terror más profundo.
              Nuestra biblioteca está organizada para cada lector.
            </p>
          </div>
          
          <Link
            to="/categories"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-all bg-slate-900/80 px-6 py-3 rounded-full border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-amber-500/10 backdrop-blur-sm self-start md:self-end"
          >
            Ver todas las categorías <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 text-amber-500" />
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mx-auto w-full max-w-[1400px] px-6 flex gap-8 overflow-hidden opacity-50">
           {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="min-w-[220px] h-[300px] bg-slate-800/50 rounded-2xl animate-pulse" />
           ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mx-auto w-full max-w-[1400px] px-6 text-center py-10">
           <p className="text-red-400 bg-red-950/20 inline-block px-4 py-2 rounded-lg border border-red-900/50">{error}</p>
        </div>
      )}

      {/* Infinite Scroll Carousel */}
      {!loading && !error && scrollingCategories.length > 0 && (
        <div className="scrolling-wrapper-categories relative z-10">
          <div className="scrolling-track-categories py-10">
            {scrollingCategories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={`${cat.slug}-${index}`}
                  to={`/category/${cat.slug}`}
                  className="carrouselItem-categories group block relative mx-5"
                >
                  <div className="w-[220px] transition-all duration-500 ease-out group-hover:-translate-y-4">
                    
                    {/* Glow Effect */}
                    <div className={`absolute -inset-1 bg-gradient-to-br ${cat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                    
                    {/* Card Container */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-xl border border-slate-800 group-hover:border-slate-600/50 transition-colors">
                      
                      {/* Background Image (Cover with overlay) */}
                      <img
                        src={cat.coverUrl}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110 opacity-50 grayscale group-hover:grayscale-0"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (!target.src.includes("placeholder")) target.src = "/covers/placeholder.jpg";
                        }}
                      />
                      
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90" />

                      {/* Icon */}
                      <div className="absolute top-4 right-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${cat.color} text-white shadow-lg`}>
                              <Icon size={20} />
                          </div>
                      </div>

                      {/* Content Bottom */}
                      <div className="absolute bottom-0 left-0 p-5 w-full">
                          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                            {cat.name}
                          </h3>
                          <p className="text-sm text-slate-400 font-medium">
                            {cat.count} libros
                          </p>
                      </div>
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

export default CategoryBooksSection;
