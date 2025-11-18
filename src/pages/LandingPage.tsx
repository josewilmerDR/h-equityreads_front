// src/pages/LandingPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Componentes de la página de inicio
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import NextReadingPanel from "../components/reader/NextReadingPanel";

// Import CSS
import "./LandingPage.css";

interface Book {
  id: string;      // ahora string, viene del backend (ej: "orgullo-y-prejuicio")
  title: string;
  author: string;
  tag: string;
  cover: string;
  content?: string; // opcional, por si luego quieres usarlo
}

interface ApiBook {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
}

interface HomeMainProps {
  featuredBooks: Book[];
}

const API_BASE_URL =
  "https://5000-firebase-hreads-back-1763343106367.cluster-dwvm25yncracsxpd26rcd5ja3m.cloudworkstations.dev";

function HomeMain({ featuredBooks = [] }: HomeMainProps) {
  return (
    <main className="flex-1">
      {/* HERO */}
      <section className="border-b border-slate-800 bg-radial-at-t from-amber-400/10 via-slate-950 to-slate-950">
        <div className="grid gap-10 px-4 py-10 md:grid-cols-2 md:py-16 lg:py-20">
          {/* Left: text */}
          <div className="flex flex-col justify-center gap-6">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Tu biblioteca de{" "}
              <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-sky-300 bg-clip-text text-transparent">
                clásicos adaptados
              </span>{" "}
              en un solo lugar.
            </h1>

            <p className="text-sm text-slate-300 sm:text-base">
              h-equity reads reúne novelas clásicas de dominio público,
              cuidadosamente adaptadas a un español moderno, en una plataforma
              ligera y sin complicaciones. Lee cuando quieras, donde quieras,
              por una sola suscripción.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/40 hover:bg-amber-300"
              >
                Empieza tu mes gratis
              </Link>
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900"
              >
                Ver catálogo
              </Link>
            </div>

            <p className="text-xs text-slate-400">
              Sin permanencias. Si te gusta, te quedas. Si no, cancelas con un
              clic.
            </p>

            <div className="mt-2 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-emerald-500/20 text-center text-xs font-bold text-emerald-300">
                  ✓
                </span>
                <p>Textos revisados, sin errores de OCR ni maquetado roto.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-sky-500/20 text-center text-xs font-bold text-sky-300">
                  ✓
                </span>
                <p>Párrafos cortos, legibles, pensados para el lector actual.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-rose-500/20 text-center text-xs font-bold text-rose-300">
                  ✓
                </span>
                <p>Lista de lectura, progreso guardado y modo oscuro.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-amber-500/20 text-center text-xs font-bold text-amber-300">
                  ✓
                </span>
                <p>Precios claros, sin anuncios ni sorpresas.</p>
              </div>
            </div>
          </div>

          {/* Right: visual block */}
          <NextReadingPanel featuredBooks={featuredBooks} />
        </div>
      </section>

      {/* Featured catalog */}
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="px-4 py-10 md:py-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight md:text-xl">
                Un catálogo pensado para leer de verdad
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Empezamos con los clásicos que la mayoría dice querer leer, pero
                casi nadie termina. Aquí los haces tuyos.
              </p>
            </div>
            <Link
              to="/catalog"
              className="hidden rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900 md:inline-block"
            >
              Ver todos los libros
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-amber-400/60"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="mb-3 h-48 w-full rounded-xl object-cover"
                />
                <h3 className="text-sm font-semibold text-slate-50">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-300">{book.author}</p>
                <p className="mt-2 text-xs text-amber-200/90">{book.tag}</p>
                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Edición adaptada</span>
                  <span>Lectura fluida</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link
              to="/catalog"
              className="inline-flex items-center rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900"
            >
              Ver todos los libros
            </Link>
          </div>
        </div>
      </section>

      {/* Plan simple */}
      <section className="bg-slate-950">
        <div className="px-4 py-10 md:py-12">
          <div className="grid gap-8 md:grid-cols-[2fr,3fr] md:items-center">
            <div>
              <h2 className="text-lg font-semibold tracking-tight md:text-xl">
                Un único plan, sin letra pequeña.
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Nada de veinte tipos de suscripción. Empiezas gratis, lees y
                decides. Si te aporta valor, te quedas. Si no, cancelas.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>• Acceso a todo el catálogo disponible.</li>
                <li>• Nuevos títulos añadidos de forma regular.</li>
                <li>• Lectura web optimizada para móvil y escritorio.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5 shadow-[0_0_40px_rgba(251,191,36,0.15)]">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
                Plan lector
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-slate-50">
                  $7.99
                </span>
                <span className="text-sm text-slate-300">/ mes</span>
              </div>
              <p className="mt-2 text-sm text-slate-200">
                Primer mes gratis. Después, menos que una salida a comer al mes.
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Puedes cancelar en cualquier momento antes de que acabe el
                período de prueba y no se te cobrará nada.
              </p>
              <Link
                to="/register"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300"
              >
                Crear cuenta y empezar a leer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const LandingPage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/books`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el catálogo");
        return res.json();
      })
      .then((data: ApiBook[]) => {
        const mapped: Book[] = data.map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author || "Autor desconocido",
          tag: "Clásico recomendado", // luego lo puedes hacer más fino
          cover:
            b.coverUrl && b.coverUrl.trim().length > 0
              ? b.coverUrl
              : "https://www.elejandria.com/covers/El_principe-Nicolas_Maquiavelo-md.png",
        }));

        // si quieres solo algunos destacados:
        setFeaturedBooks(mapped.slice(0, 6));
      })
      .catch((err) => {
        console.error(err);
        setError("Hubo un problema al cargar el catálogo.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      {loading && (
        <div className="flex flex-1 items-center justify-center bg-slate-950 text-slate-300 py-10">
          Cargando tu biblioteca...
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-1 items-center justify-center bg-slate-950 text-red-400 py-10">
          {error}
        </div>
      )}

      {!loading && !error && <HomeMain featuredBooks={featuredBooks} />}

      <Footer />
    </>
  );
};

export default LandingPage;





// // src/pages/LandingPage.tsx
// import React from "react";
// import { Link } from "react-router-dom";

// // Componentes de la página de inicio
// import Footer from "../components/layout/Footer";
// import Navbar from "../components/layout/Navbar";
// import NextReadingPanel from "../components/reader/NextReadingPanel";

// // Import CSS
// import "./LandingPage.css";

// interface Book {
//   id: number;
//   title: string;
//   author: string;
//   tag: string;
//   cover: string;
//   content: string;
// }

// interface HomeMainProps {
//   featuredBooks: Book[];
// }

// function HomeMain({ featuredBooks = [] }: HomeMainProps) {
//   return (
//     <main className="flex-1">
//       {/* HERO */}
//       <section className="border-b border-slate-800 bg-radial-at-t from-amber-400/10 via-slate-950 to-slate-950">
//         <div className="grid gap-10 px-4 py-10 md:grid-cols-2 md:py-16 lg:py-20">
//           {/* Left: text */}
//           <div className="flex flex-col justify-center gap-6">
//             <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
//               Tu biblioteca de{" "}
//               <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-sky-300 bg-clip-text text-transparent">
//                 clásicos adaptados
//               </span>{" "}
//               en un solo lugar.
//             </h1>

//             <p className="text-sm text-slate-300 sm:text-base">
//               h-equity reads reúne novelas clásicas de dominio público,
//               cuidadosamente adaptadas a un español moderno, en una plataforma
//               ligera y sin complicaciones. Lee cuando quieras, donde quieras,
//               por una sola suscripción.
//             </p>

//             <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//               <Link
//                 to="/register"
//                 className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/40 hover:bg-amber-300"
//               >
//                 Empieza tu mes gratis
//               </Link>
//               <Link
//                 to="/catalog"
//                 className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900"
//               >
//                 Ver catálogo
//               </Link>
//             </div>

//             <p className="text-xs text-slate-400">
//               Sin permanencias. Si te gusta, te quedas. Si no, cancelas con un
//               clic.
//             </p>

//             <div className="mt-2 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
//               <div className="flex items-start gap-2">
//                 <span className="mt-0.5 h-5 w-5 rounded-full bg-emerald-500/20 text-center text-xs font-bold text-emerald-300">
//                   ✓
//                 </span>
//                 <p>Textos revisados, sin errores de OCR ni maquetado roto.</p>
//               </div>
//               <div className="flex items-start gap-2">
//                 <span className="mt-0.5 h-5 w-5 rounded-full bg-sky-500/20 text-center text-xs font-bold text-sky-300">
//                   ✓
//                 </span>
//                 <p>Párrafos cortos, legibles, pensados para el lector actual.</p>
//               </div>
//               <div className="flex items-start gap-2">
//                 <span className="mt-0.5 h-5 w-5 rounded-full bg-rose-500/20 text-center text-xs font-bold text-rose-300">
//                   ✓
//                 </span>
//                 <p>Lista de lectura, progreso guardado y modo oscuro.</p>
//               </div>
//               <div className="flex items-start gap-2">
//                 <span className="mt-0.5 h-5 w-5 rounded-full bg-amber-500/20 text-center text-xs font-bold text-amber-300">
//                   ✓
//                 </span>
//                 <p>Precios claros, sin anuncios ni sorpresas.</p>
//               </div>
//             </div>
//           </div>

//           {/* Right: visual block */}
//           <NextReadingPanel featuredBooks={featuredBooks} />
//         </div>
//       </section>

//       {/* Featured catalog */}
//       <section className="border-b border-slate-800 bg-slate-950">
//         <div className="px-4 py-10 md:py-12">
//           <div className="flex items-center justify-between gap-4">
//             <div>
//               <h2 className="text-lg font-semibold tracking-tight md:text-xl">
//                 Un catálogo pensado para leer de verdad
//               </h2>
//               <p className="mt-1 text-sm text-slate-300">
//                 Empezamos con los clásicos que la mayoría dice querer leer, pero
//                 casi nadie termina. Aquí los haces tuyos.
//               </p>
//             </div>
//             <Link
//               to="/catalog"
//               className="hidden rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900 md:inline-block"
//             >
//               Ver todos los libros
//             </Link>
//           </div>

//           <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
//             {featuredBooks.map((book) => (
//               <div
//                 key={book.id}
//                 className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-amber-400/60"
//               >
//                 <img
//                   src={book.cover}
//                   alt={book.title}
//                   className="mb-3 h-48 w-full rounded-xl object-cover"
//                 />
//                 <h3 className="text-sm font-semibold text-slate-50">
//                   {book.title}
//                 </h3>
//                 <p className="text-xs text-slate-300">{book.author}</p>
//                 <p className="mt-2 text-xs text-amber-200/90">{book.tag}</p>
//                 <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
//                   <span>Edición adaptada</span>
//                   <span>Lectura fluida</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6 text-center md:hidden">
//             <Link
//               to="/catalog"
//               className="inline-flex items-center rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900"
//             >
//               Ver todos los libros
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Plan simple */}
//       <section className="bg-slate-950">
//         <div className="px-4 py-10 md:py-12">
//           <div className="grid gap-8 md:grid-cols-[2fr,3fr] md:items-center">
//             <div>
//               <h2 className="text-lg font-semibold tracking-tight md:text-xl">
//                 Un único plan, sin letra pequeña.
//               </h2>
//               <p className="mt-2 text-sm text-slate-300">
//                 Nada de veinte tipos de suscripción. Empiezas gratis, lees y
//                 decides. Si te aporta valor, te quedas. Si no, cancelas.
//               </p>
//               <ul className="mt-4 space-y-2 text-sm text-slate-300">
//                 <li>• Acceso a todo el catálogo disponible.</li>
//                 <li>• Nuevos títulos añadidos de forma regular.</li>
//                 <li>• Lectura web optimizada para móvil y escritorio.</li>
//               </ul>
//             </div>

//             <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5 shadow-[0_0_40px_rgba(251,191,36,0.15)]">
//               <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
//                 Plan lector
//               </p>
//               <div className="mt-2 flex items-baseline gap-2">
//                 <span className="text-3xl font-semibold text-slate-50">
//                   $7.99
//                 </span>
//                 <span className="text-sm text-slate-300">/ mes</span>
//               </div>
//               <p className="mt-2 text-sm text-slate-200">
//                 Primer mes gratis. Después, menos que una salida a comer al mes.
//               </p>
//               <p className="mt-2 text-xs text-slate-400">
//                 Puedes cancelar en cualquier momento antes de que acabe el
//                 período de prueba y no se te cobrará nada.
//               </p>
//               <Link
//                 to="/register"
//                 className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300"
//               >
//                 Crear cuenta y empezar a leer
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// const LandingPage: React.FC = () => {
//   const featuredBooks: Book[] = [
//     {
//       id: 1,
//       title: "Meditaciones de Marco Aurelio",
//       author: "Marco Aurelio",
//       tag: "Estoicismo",
//       cover:
//         "https://www.elejandria.com/covers/El_principe-Nicolas_Maquiavelo-md.png",
//       content: "El universo es cambio, nuestra vida es lo que nuestros pensamientos hacen de ella.\n\nNo te dejes arrastrar por la imaginación. No esperes la República de Platón; conténtate con el más pequeño progreso, y no consideres este resultado como de poca importancia.\n\nLa mejor manera de vengarse de un enemigo es no parecerse a él."
//     },
//     {
//       id: 2,
//       title: "El arte de la guerra",
//       author: "Sun Tzu",
//       tag: "Estrategia",
//       cover:
//         "https://www.elejandria.com/covers/El_principe-Nicolas_Maquiavelo-md.png",
//       content: "El arte de la guerra se basa en el engaño.\n\nPor lo tanto, cuando eres capaz, finge incapacidad; cuando estás activo, inactividad.\n\nSi está cerca, haz que parezca que está lejos; si está lejos, que está cerca."
//     },
//     {
//       id: 3,
//       title: "El Príncipe",
//       author: "Nicolás Maquiavelo",
//       tag: "Política",
//       cover:
//         "https://www.elejandria.com/covers/El_principe-Nicolas_Maquiavelo-md.png",
//       content: "Es mejor ser temido que amado, si no puedes ser ambos.\n\nLos hombres ofenden antes al que aman que al que temen.\n\nEl fin justifica los medios."
//     },
//   ];

//   return (
//     <>
//       <Navbar />
//       <HomeMain featuredBooks={featuredBooks} />
//       <Footer />
//     </>
//   );
// };

// export default LandingPage;
