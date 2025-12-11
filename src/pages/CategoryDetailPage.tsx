// src/pages/CategoryDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { 
  Heart, 
  Map, 
  Search, 
  Wand2, 
  Rocket, 
  BookOpen, 
  Hourglass, 
  Smile, 
  Coffee, 
  Sparkles,
  ArrowLeft,
  AlertCircle
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiBook {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  category?: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  category: string;
}

// Configuración de metadatos de categorías para la UI (colores, iconos)
// Las claves deben coincidir con los slugs que usamos en la URL
const CATEGORY_UI_CONFIG: Record<string, { name: string; color: string; icon: any; description: string }> = {
  "romance": {
    name: "Romance",
    color: "from-rose-400 to-red-500",
    icon: Heart,
    description: "Historias de amor clásicas y segundas oportunidades."
  },
  "aventura": {
    name: "Aventura",
    color: "from-amber-400 to-orange-500",
    icon: Map,
    description: "Viajes, desafíos y personajes que no se rinden."
  },
  "misterio": {
    name: "Misterio",
    color: "from-blue-400 to-indigo-500",
    icon: Search,
    description: "Crímenes, secretos y giros inesperados."
  },
  "terror": {
    name: "Terror",
    color: "from-gray-700 to-black",
    icon: Search, // O un icono más apropiado si hay
    description: "Historias para no dormir."
  },
  "dark-romance": {
    name: "Dark Romance",
    color: "from-purple-900 to-rose-900",
    icon: Heart,
    description: "Amor en las sombras."
  },
  "fantasia": {
    name: "Fantasía",
    color: "from-purple-400 to-pink-500",
    icon: Wand2,
    description: "Mundos imposibles, magia y mitologías reinventadas."
  },
  "ciencia-ficcion": {
    name: "Ciencia ficción",
    color: "from-emerald-400 to-green-500",
    icon: Rocket,
    description: "Futuros posibles, tecnología y dilemas humanos."
  },
  "clasicos": {
    name: "Clásicos",
    color: "from-slate-300 to-slate-600",
    icon: BookOpen,
    description: "Obras que han sobrevivido al tiempo, ahora adaptadas."
  },
  "drama-historico": {
    name: "Drama histórico",
    color: "from-orange-300 to-amber-500",
    icon: Hourglass,
    description: "Épocas pasadas vistas desde adentro, con emoción."
  },
  "humor": {
    name: "Humor",
    color: "from-yellow-300 to-lime-500",
    icon: Smile,
    description: "Lecturas ligeras para sonreír y desconectar."
  },
  "cuentos-cortos": {
    name: "Cuentos cortos",
    color: "from-cyan-300 to-sky-500",
    icon: Coffee,
    description: "Historias breves que puedes leer en una sentada."
  },
  "juvenil": {
    name: "Juvenil",
    color: "from-fuchsia-400 to-purple-500",
    icon: Sparkles,
    description: "Tramas ágiles, emociones intensas y personajes jóvenes."
  }
};

const CategoryDetailPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Obtener config de la categoría o usar valores por defecto
  const categoryConfig = (categorySlug && CATEGORY_UI_CONFIG[categorySlug]) || {
    name: categorySlug ? categorySlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Categoría",
    color: "from-slate-400 to-slate-600",
    icon: BookOpen,
    description: "Explora los libros de esta categoría."
  };

  const Icon = categoryConfig.icon;

  useEffect(() => {
    setLoading(true);
    const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
    
    fetch(`${base}/api/books`)
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching books");
        return res.json();
      })
      .then((data: ApiBook[]) => {
        
        const targetSlug = categorySlug?.toLowerCase() || "";

        const filtered = data.filter((b) => {
            if (!b.category) return false;
            // Convertimos la lista de categorías del libro (string) en array de slugs
            // Ej: "Misterio, Terror" -> ["misterio", "terror"]
            const bookCategories = b.category.toLowerCase().split(",").map(c => 
                c.trim().replace(/\s+/g, '-') // Reemplazamos espacios internos por guiones para matchear slugs
            );
            
            return bookCategories.includes(targetSlug);
        }).map(b => {
             // Lógica de Cover URL (consistente con otros componentes)
             let finalCoverUrl = b.coverUrl;
             if (finalCoverUrl && !finalCoverUrl.startsWith("http")) {
                 if (!finalCoverUrl.startsWith("/")) {
                     finalCoverUrl = base ? `${base}/${finalCoverUrl}` : `/covers/${finalCoverUrl}`; 
                 } else if (base) {
                     finalCoverUrl = `${base}${finalCoverUrl}`;
                 }
             }
             if (finalCoverUrl && finalCoverUrl.includes("public/")) {
                finalCoverUrl = finalCoverUrl.replace("public/", "");
             }

             return {
                 ...b,
                 category: b.category || "",
                 coverUrl: finalCoverUrl
             }
        });

        setBooks(filtered);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [categorySlug]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50 font-sans selection:bg-amber-500/30">
      <Navbar />

      <main className="flex-1">
        {/* Header Section */}
        <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 pt-24 pb-16">
           {/* Background Gradient */}
           <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-gradient-to-b ${categoryConfig.color} opacity-10 blur-[100px] rounded-full pointer-events-none`} />
           
           <div className="relative mx-auto max-w-7xl px-6">
             <Link to="/categories" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm font-medium group">
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Volver a Categorías
             </Link>

             <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${categoryConfig.color} shadow-2xl shadow-black/30 ring-1 ring-white/10`}>
                    <Icon className="h-10 w-10 text-white" strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">{categoryConfig.name}</h1>
                    <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">{categoryConfig.description}</p>
                </div>
             </div>
           </div>
        </section>

        {/* Books Grid */}
        <section className="bg-slate-950 py-16">
          <div className="mx-auto max-w-7xl px-6">
             {loading && (
                 <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <div className="w-10 h-10 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin mb-4" />
                    <p>Buscando libros...</p>
                 </div>
             )}

             {!loading && books.length === 0 && (
                 <div className="text-center py-20 max-w-md mx-auto">
                     <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 mb-6 text-slate-500">
                        <AlertCircle size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-200 mb-2">No se encontraron libros</h3>
                     <p className="text-slate-400 mb-8">
                        No hay libros etiquetados con "{categoryConfig.name}" en este momento. 
                        ¡Explora otras categorías!
                     </p>
                     <Link to="/categories" className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-full transition-colors">
                        Ver todas las categorías
                     </Link>
                 </div>
             )}

             {!loading && books.length > 0 && (
                <div className="grid gap-x-6 gap-y-12 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {books.map((book) => (
                        <Link
                            key={book.id}
                            to={`/reader/${book.id}/1`}
                            className="group relative flex flex-col"
                        >
                            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-amber-500/10 border border-slate-800/50">
                                <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        if (!target.src.includes("placeholder")) {
                                            target.src = "/covers/placeholder.jpg";
                                        }
                                    }}
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            
                            <div className="mt-4 px-1">
                                <h3 className="text-base font-bold text-slate-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
                                    {book.title}
                                </h3>
                                <p className="text-xs text-slate-400 font-medium">{book.author}</p>
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

export default CategoryDetailPage;
