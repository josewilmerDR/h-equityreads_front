// src/pages/CategoriesPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

interface Category {
  name: string;
  slug: string;
  color: string;
  booksCount: number;
  description: string;
}

const CategoriesPage: React.FC = () => {
  // Por ahora todo simulado en el frontend
  const categories: Category[] = [
    {
      name: "Romance",
      slug: "romance",
      color: "from-rose-400 to-red-500",
      booksCount: 18,
      description: "Historias de amor clásicas y segundas oportunidades.",
    },
    {
      name: "Aventura",
      slug: "aventura",
      color: "from-amber-400 to-orange-500",
      booksCount: 14,
      description: "Viajes, desafíos y personajes que no se rinden.",
    },
    {
      name: "Misterio",
      slug: "misterio",
      color: "from-blue-400 to-indigo-500",
      booksCount: 16,
      description: "Crímenes, secretos y giros inesperados.",
    },
    {
      name: "Fantasía",
      slug: "fantasia",
      color: "from-purple-400 to-pink-500",
      booksCount: 12,
      description: "Mundos imposibles, magia y mitologías reinventadas.",
    },
    {
      name: "Ciencia ficción",
      slug: "ciencia-ficcion",
      color: "from-emerald-400 to-green-500",
      booksCount: 10,
      description: "Futuros posibles, tecnología y dilemas humanos.",
    },
    {
      name: "Clásicos",
      slug: "clasicos",
      color: "from-slate-300 to-slate-600",
      booksCount: 22,
      description: "Obras que han sobrevivido al tiempo, ahora adaptadas.",
    },
    {
      name: "Drama histórico",
      slug: "drama-historico",
      color: "from-orange-300 to-amber-500",
      booksCount: 9,
      description: "Épocas pasadas vistas desde adentro, con emoción.",
    },
    {
      name: "Humor",
      slug: "humor",
      color: "from-yellow-300 to-lime-500",
      booksCount: 7,
      description: "Lecturas ligeras para sonreír y desconectar.",
    },
    {
      name: "Cuentos cortos",
      slug: "cuentos-cortos",
      color: "from-cyan-300 to-sky-500",
      booksCount: 11,
      description: "Historias breves que puedes leer en una sentada.",
    },
    {
      name: "Juvenil",
      slug: "juvenil",
      color: "from-fuchsia-400 to-purple-500",
      booksCount: 8,
      description: "Tramas ágiles, emociones intensas y personajes jóvenes.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />

      <main className="flex-1 border-t border-slate-800 bg-slate-950">
        {/* Hero */}
        <section className="border-b border-slate-800 bg-radial-at-t from-amber-400/10 via-slate-950 to-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Explora por categorías
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Elige según tu estado de ánimo, tu curiosidad o el tipo de historia
              que quieres hoy. Siempre podrás volver y cambiar de rumbo.
            </p>
          </div>
        </section>

        {/* Grid de categorías */}
        <section className="border-b border-slate-800 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-amber-400/70 hover:bg-slate-900 transition-colors"
                >
                  {/* Icono / color */}
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-slate-950 font-bold text-sm`}
                    >
                      {cat.name[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-50">
                        {cat.name}
                      </span>
                      <span className="text-xs text-slate-300">
                        {cat.booksCount} libros
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 flex-1">
                    {cat.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Edición adaptada</span>
                    <span className="group-hover:text-amber-300">
                      Ver libros →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CategoriesPage;
