// src/pages/CategoriesPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { 
  Heart, 
  Map as MapIcon, 
  Search, 
  Wand2, 
  Rocket, 
  BookOpen, 
  Hourglass, 
  Smile, 
  Coffee, 
  Sparkles,
  Ghost,
  Moon
} from "lucide-react";

interface ApiBook {
  id: string;
  title: string;
  category?: string;
  coverUrl?: string;
}

interface Category {
  name: string;
  slug: string;
  color: string;
  icon: React.ElementType;
  booksCount: number;
  description: string;
  sampleCovers: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback covers
  const localCovers = {
    placeholder: "/covers/placeholder.jpg"
  };

  // Configuración de UI para categorías conocidas
  // Si llega una categoría nueva del backend, usará el estilo "default"
  const CATEGORY_METADATA: Record<string, Omit<Category, "booksCount" | "sampleCovers">> = {
    "romance": {
      name: "Romance",
      slug: "romance",
      color: "from-rose-400 to-red-500",
      icon: Heart,
      description: "Historias de amor clásicas y segundas oportunidades.",
    },
    "aventura": {
      name: "Aventura",
      slug: "aventura",
      color: "from-amber-400 to-orange-500",
      icon: MapIcon,
      description: "Viajes, desafíos y personajes que no se rinden.",
    },
    "misterio": {
      name: "Misterio",
      slug: "misterio",
      color: "from-blue-400 to-indigo-500",
      icon: Search,
      description: "Crímenes, secretos y giros inesperados.",
    },
    "terror": {
      name: "Terror",
      slug: "terror",
      color: "from-slate-700 to-black",
      icon: Ghost,
      description: "Pesadillas hechas realidad y oscuridad.",
    },
    "dark-romance": {
      name: "Dark Romance",
      slug: "dark-romance",
      color: "from-purple-900 to-rose-950",
      icon: Moon,
      description: "Pasiones prohibidas y sombras peligrosas.",
    },
    "fantasia": {
      name: "Fantasía",
      slug: "fantasia",
      color: "from-purple-400 to-pink-500",
      icon: Wand2,
      description: "Mundos imposibles, magia y mitologías reinventadas.",
    },
    "ciencia-ficcion": {
      name: "Ciencia ficción",
      slug: "ciencia-ficcion",
      color: "from-emerald-400 to-green-500",
      icon: Rocket,
      description: "Futuros posibles, tecnología y dilemas humanos.",
    },
    "clasicos": {
      name: "Clásicos",
      slug: "clasicos",
      color: "from-slate-300 to-slate-600",
      icon: BookOpen,
      description: "Obras que han sobrevivido al tiempo, ahora adaptadas.",
    },
    "drama-historico": {
      name: "Drama histórico",
      slug: "drama-historico",
      color: "from-orange-300 to-amber-500",
      icon: Hourglass,
      description: "Épocas pasadas vistas desde adentro, con emoción.",
    },
    "humor": {
      name: "Humor",
      slug: "humor",
      color: "from-yellow-300 to-lime-500",
      icon: Smile,
      description: "Lecturas ligeras para sonreír y desconectar.",
    },
    "cuentos-cortos": {
      name: "Cuentos cortos",
      slug: "cuentos-cortos",
      color: "from-cyan-300 to-sky-500",
      icon: Coffee,
      description: "Historias breves que puedes leer en una sentada.",
    },
    "juvenil": {
      name: "Juvenil",
      slug: "juvenil",
      color: "from-fuchsia-400 to-purple-500",
      icon: Sparkles,
      description: "Tramas ágiles, emociones intensas y personajes jóvenes.",
    },
    // Configuración por defecto para categorías desconocidas
    "default": {
        name: "General",
        slug: "general",
        color: "from-slate-500 to-slate-700",
        icon: BookOpen,
        description: "Explora esta colección de libros.",
     }
  };

  useEffect(() => {
    const fetchCategoriesAndBooks = async () => {
        try {
            setLoading(true);
            const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
            const res = await fetch(`${base}/api/books`);
            if (!res.ok) throw new Error("Error fetching books");
            const books: ApiBook[] = await res.json();

            // 1. Agrupar libros por categoría
            const categoryMap = new Map<string, { count: number; covers: string[] }>();

            books.forEach(book => {
                if (!book.category) return;
                
                // Normalizar y separar categorías
                // Ejemplo: "Misterio, Terror, Dark Romance" -> ["misterio", "terror", "dark-romance"]
                const cats = book.category.split(',').map(c => c.trim().toLowerCase().replace(/\s+/g, '-'));
                
                // Procesar URL de portada
                let coverUrl = book.coverUrl;
                if (coverUrl && !coverUrl.startsWith("http")) {
                     coverUrl = base ? `${base}/${coverUrl.replace(/^\//, '')}` : `/covers/${coverUrl.replace(/^\//, '')}`;
                }
                if(coverUrl && coverUrl.includes("public/")) {
                    coverUrl = coverUrl.replace("public/", "");
                }
                if (!coverUrl) coverUrl = localCovers.placeholder;

                cats.forEach(slug => {
                    // Ignoramos categorías vacías si las hay
                    if(!slug) return;

                    if (!categoryMap.has(slug)) {
                        categoryMap.set(slug, { count: 0, covers: [] });
                    }
                    
                    const entry = categoryMap.get(slug)!;
                    entry.count += 1;
                    if (entry.covers.length < 3 && coverUrl) {
                        entry.covers.push(coverUrl);
                    }
                });
            });

            const processedCategories: Category[] = [];

            // 2. Procesar primero las categorías con metadatos conocidos (para mantener orden visual bonito)
            Object.keys(CATEGORY_METADATA).forEach(slug => {
                if (slug === 'default') return;
                
                const data = categoryMap.get(slug);
                if (data && data.count > 0) {
                     // Rellenar covers
                     while(data.covers.length < 3) {
                         data.covers.push(localCovers.placeholder);
                     }
                     
                     processedCategories.push({
                         ...CATEGORY_METADATA[slug],
                         booksCount: data.count,
                         sampleCovers: data.covers,
                         slug: slug // Asegurar slug correcto
                     });
                     
                     // Borramos del mapa para saber cuáles quedan (las desconocidas)
                     categoryMap.delete(slug); 
                }
            });

            // 3. Procesar el resto (categorías dinámicas sin config específica)
            categoryMap.forEach((data, slug) => {
                 // Generar nombre bonito: "dark-romance" -> "Dark Romance"
                 const niceName = slug
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                 // Rellenar covers
                 while(data.covers.length < 3) {
                     data.covers.push(localCovers.placeholder);
                 }

                 processedCategories.push({
                     ...CATEGORY_METADATA["default"], // Usar estilos default
                     name: niceName,
                     slug: slug,
                     booksCount: data.count,
                     sampleCovers: data.covers,
                     description: `Explora nuestra colección de ${niceName}.`
                 });
            });

            setCategories(processedCategories);

        } catch (error) {
            console.error("Failed to load categories", error);
        } finally {
            setLoading(false);
        }
    };

    fetchCategoriesAndBooks();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50 font-sans selection:bg-amber-500/30">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative mx-auto max-w-6xl px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Explora por <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">Categorías</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
              Sumérgete en mundos diseñados para cada estado de ánimo. 
              Desde clásicos atemporales hasta nuevas tendencias.
            </p>
          </div>
        </section>

        {/* Grid de categorías */}
        <section className="bg-slate-950 py-16">
          <div className="mx-auto max-w-7xl px-6">
            
            {loading && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="h-[280px] rounded-3xl bg-slate-900 animate-pulse border border-slate-800"></div>
                    ))}
                </div>
            )}

            {!loading && categories.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((cat) => (
                    <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-amber-500/5 h-[280px]"
                    >
                    <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${cat.color} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />

                    <div className="relative z-10">
                        <div className="mb-4 flex items-start justify-between">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} shadow-lg shadow-black/20 ring-1 ring-white/10`}
                        >
                            <cat.icon className="h-6 w-6 text-white" strokeWidth={2} />
                        </div>
                        <span className="rounded-full bg-slate-800/50 px-3 py-1 text-[10px] font-medium text-slate-400 ring-1 ring-slate-700/50 backdrop-blur-sm">
                            {cat.booksCount} libros
                        </span>
                        </div>

                        <h3 className="mb-2 text-xl font-bold text-slate-100 group-hover:text-amber-100 transition-colors">
                        {cat.name}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 pr-4">
                        {cat.description}
                        </p>
                    </div>

                    {/* Collage de Portadas */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute bottom-[-10px] right-2 w-16 h-24 rounded-md overflow-hidden shadow-lg border border-slate-700/50 transform rotate-12 translate-x-4 group-hover:translate-x-6 group-hover:rotate-[15deg] transition-transform duration-500 origin-bottom-left bg-slate-800">
                            <img src={cat.sampleCovers[2]} alt="" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                        </div>
                        <div className="absolute bottom-[-5px] right-8 w-18 h-26 rounded-md overflow-hidden shadow-xl border border-slate-700/50 transform rotate-6 translate-x-2 group-hover:translate-x-3 group-hover:rotate-[8deg] transition-transform duration-500 origin-bottom-left bg-slate-800 z-10">
                            <img src={cat.sampleCovers[1]} alt="" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div className="absolute bottom-4 right-14 w-20 h-28 rounded-md overflow-hidden shadow-2xl border border-slate-600/50 transform -rotate-3 group-hover:-rotate-6 group-hover:-translate-y-2 transition-transform duration-500 bg-slate-800 z-20">
                            <img src={cat.sampleCovers[0]} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-900/90 to-transparent z-0 pointer-events-none" />

                    <div className="relative z-10 mt-auto flex items-center pt-4">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-500 opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                        Explorar colección <span aria-hidden="true">&rarr;</span>
                        </span>
                    </div>
                    </Link>
                ))}
                </div>
            )}

            {!loading && categories.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-slate-500">No se encontraron categorías.</p>
                </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CategoriesPage;
