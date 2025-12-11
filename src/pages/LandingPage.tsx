// src/pages/LandingPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import NextReadingPanel from "../components/home/NextReadingPanel";
import TopReadBooksSection from "../components/home/TopReadBooksSection";
import CategoryBooksSection from "../components/home/CategoryBooksSection";
import { BookOpen, Moon, ShieldCheck } from "lucide-react";

// Tipos
interface Book {
  id: string;
  title: string;
  author: string;
  tag: string;
  coverUrl?: string;
}

interface ApiBook {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LandingPage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);

  // Carga inicial solo para el panel de "Próxima lectura"
  useEffect(() => {
    const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
    
    fetch(`${base}/api/books`)
      .then((res) => res.json())
      .then((data: ApiBook[]) => {
        // Mapeamos y tomamos algunos aleatorios o los primeros para el panel
        const mapped: Book[] = data.slice(0, 3).map((b) => {
             // Lógica de URL segura (igual que en los otros componentes)
             let finalCover = b.coverUrl;
             if(finalCover && !finalCover.startsWith("http")) {
                 finalCover = base ? `${base}${finalCover.startsWith('/') ? '' : '/'}${finalCover}` : finalCover;
             }
             
             return {
                id: b.id,
                title: b.title,
                author: b.author || "Autor clásico",
                tag: "Recomendado",
                coverUrl: finalCover,
             };
        });
        setFeaturedBooks(mapped);
      })
      .catch((err) => console.error("Error cargando destacados:", err));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50 font-sans selection:bg-amber-500/30">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden border-b border-slate-800 pt-10 pb-20 md:pt-20 md:pb-24">
          {/* Efectos de fondo */}
          <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[100px]" />

          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              
              {/* Texto Hero */}
              <div className="max-w-2xl">
                <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-amber-400 mr-2 animate-pulse"></span>
                  Nueva colección disponible
                </div>
                
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6 leading-[1.1]">
                  Los clásicos que amas, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                    adaptados para ti.
                  </span>
                </h1>
                
                <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
                  H-EQUITY READS reúne obras maestras de la literatura universal, 
                  cuidadosamente editadas al español moderno. Lee sin distracciones, 
                  cuando quieras y donde quieras.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/catalog"
                    className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-amber-400 hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  >
                    Explorar Catálogo
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 px-8 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                  >
                    Saber más
                  </Link>
                </div>

                {/* Social Proof chiquito */}
                <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
                   <div className="flex -space-x-2">
                      {[1,2,3,4].map(i => (
                          <div key={i} className="h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] text-slate-400">User</div>
                      ))}
                   </div>
                   <p>Únete a +1,000 lectores</p>
                </div>
              </div>

              {/* Componente Visual (NextReadingPanel) */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full opacity-20 transform translate-x-10 translate-y-10" />
                <div className="relative z-10 scale-100 md:scale-110 transition-transform hover:scale-[1.12]">
                    <NextReadingPanel featuredBooks={featuredBooks} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. TOP LEÍDOS (Diseño Apple Style) */}
        <TopReadBooksSection />

        {/* 3. FEATURES (Propuesta de Valor) */}
        <section className="border-b border-slate-800 bg-slate-950/50 py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Feature 1 */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-amber-500/30">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Lectura Adaptada</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Textos revisados y modernizados para una comprensión fluida sin perder la esencia del clásico original.
                        </p>
                    </div>
                    {/* Feature 2 */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-blue-500/30">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Sin Distracciones</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Una interfaz limpia, sin publicidad ni pop-ups molestos. Solo tú y la historia.
                        </p>
                    </div>
                    {/* Feature 3 */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-purple-500/30">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                            <Moon size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Modo Lectura</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Personaliza tu experiencia con modo oscuro real, tamaños de fuente ajustables y guardado de progreso.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* 4. CATEGORÍAS (Exploración) */}
        <CategoryBooksSection />
        
        {/* CTA FINAL */}
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-amber-950/20" />
            <div className="relative mx-auto max-w-4xl px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                    ¿Listo para empezar tu viaje?
                </h2>
                <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                    Accede a toda nuestra biblioteca de clásicos adaptados hoy mismo.
                </p>
                <Link 
                    to="/catalog"
                    className="inline-flex items-center gap-2 rounded-full bg-white text-slate-950 px-8 py-4 font-bold hover:bg-slate-200 transition-colors"
                >
                    Ver biblioteca completa
                </Link>
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;


// // src/pages/LandingPage.tsx
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// // Componentes de la página de inicio
// import Footer from "../components/layout/Footer";
// import Navbar from "../components/layout/Navbar";
// import NextReadingPanel from "../components/home/NextReadingPanel";
// import TopReadBooksSection from "../components/home/TopReadBooksSection";
// import CategoryBooksSection from "../components/home/CategoryBooksSection";


// // Import CSS
// import "./style/LandingPage.css";

// interface Book {
//   id: string;      // ahora string, viene del backend (ej: "orgullo-y-prejuicio")
//   title: string;
//   author: string;
//   tag: string;
//   coverUrl: string;
//   content?: string; // opcional, por si luego quieres usarlo
// }

// interface ApiBook {
//   id: string;
//   title: string;
//   author: string;
//   description: string;
//   coverUrl: string;
// }

// interface HomeMainProps {
//   featuredBooks: Book[];
// }

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
//               H-EQUITY READS reúne los clásicos que amas y cientos que te encantará descubrir,
//               cuidadosamente adaptadas a al español moderno. Lee cuando quieras, donde quieras,
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
//                 <p>Párrafos cortos, legibles, y modo oscuro.</p>
//               </div>
//               {/* <div className="flex items-start gap-2">
//                 <span className="mt-0.5 h-5 w-5 rounded-full bg-rose-500/20 text-center text-xs font-bold text-rose-300">
//                   ✓
//                 </span>
//                 <p>Lista de lectura, progreso guardado y modo oscuro.</p>
//               </div> */}
//               {/* <div className="flex items-start gap-2">
//                 <span className="mt-0.5 h-5 w-5 rounded-full bg-amber-500/20 text-center text-xs font-bold text-amber-300">
//                   ✓
//                 </span>
//                 <p>Precios claros, sin anuncios ni sorpresas.</p>
//               </div> */}
//             </div>
//           </div>

//           {/* Right: visual block */}
//           <NextReadingPanel featuredBooks={featuredBooks} />
//         </div>
//       </section>


//       {/* SECCIÓN DE MÁS LEIDOS */}
  

//       {/* Featured catalog – Top 10 más leídos (simulado) */}
      
//       <TopReadBooksSection />


      

//       {/* SECCIÓN DE CATEGORÍAS */}


//       {/* Featured categories (simulado) */}
//       <section className="border-b border-slate-800 bg-slate-950">
//         <div className="px-4 py-10 md:py-12">
//           <div className="flex items-center justify-between gap-4">
//           </div>


//                 <CategoryBooksSection/>


//           {/* CTA inferior para pantallas pequeñas */}
//           <div className="mt-6 text-center md:hidden">
//             <Link
//               to="/categories"
//               className="inline-block rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900"
//             >
//               Ver todas las categorías
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
//   const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     fetch(`${API_BASE_URL}/api/books`)
//       .then((res) => {
//         if (!res.ok) throw new Error("No se pudo cargar el catálogo");
//         return res.json();
//       })
//       .then((data: ApiBook[]) => {
//         const mapped: Book[] = data.map((b) => ({
//           id: b.id,
//           title: b.title,
//           author: b.author || "Autor desconocido",
//           tag: "Clásico recomendado", // luego lo puedes hacer más fino
//           coverUrl:
//             b.coverUrl && b.coverUrl.trim().length > 0
//               ? b.coverUrl
//               : "https://www.elejandria.com/covers/El_principe-Nicolas_Maquiavelo-md.png",
//         }));

//         // si quieres solo algunos destacados:
//         setFeaturedBooks(mapped.slice(0, 6));
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Hubo un problema al cargar el catálogo.");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <>
//       <Navbar />

//       {loading && (
//         <div className="flex flex-1 items-center justify-center bg-slate-950 text-slate-300 py-10">
//           Cargando tu biblioteca...
//         </div>
//       )}

//       {!loading && error && (
//         <div className="flex flex-1 items-center justify-center bg-slate-950 text-red-400 py-10">
//           {error}
//         </div>
//       )}

//       {!loading && !error && <HomeMain featuredBooks={featuredBooks} />}

//       <Footer />
//     </>
//   );
// };

// export default LandingPage;
