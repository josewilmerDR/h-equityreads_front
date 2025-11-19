import React, {
  useEffect,
  useMemo,
  useState,
  KeyboardEvent,
  useRef,
  useLayoutEffect,
} from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import ReaderFooter from "./ReaderFooter";
import "./Reader.css";
import ReaderHeader from "./ReaderHeader";

const Icons = {
  Library: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Aa: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20h16" />
      <path d="M12 4v16" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Bookmark: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  ),
};

function htmlToPlainText(html: string): string {
  if (!html) return "";
  let text = html;
  text = text.replace(
    /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi,
    (_, inner) => `\n\n${inner.trim()}\n\n`
  );
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/\r\n/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ANIMACIONES
const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const pageTransition: Transition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.8,
};

interface ReaderProps {
  /** Título del LIBRO (para el header y fallback) */
  title: string;
  author?: string;
  contentHtml?: string;
  content?: string;
  initialLocation?: number;
  onLocationChange?: (location: number) => void;

  /** Título del CAPÍTULO (lo que quieres mostrar dentro del Reader) */
  chapterTitle?: string;

  /** Pedir capítulo siguiente/anterior al padre */
  onRequestNextChapter?: () => void;
  onRequestPrevChapter?: () => void;

  /** Indica si hay capítulo anterior/siguiente (para mostrar/ocultar flechas) */
  hasNextChapter?: boolean;
  hasPrevChapter?: boolean;
}

const Reader: React.FC<ReaderProps> = ({
  title,
  author,
  contentHtml,
  content,
  initialLocation = 0,
  onLocationChange,
  chapterTitle,
  onRequestNextChapter,
  onRequestPrevChapter,
  hasNextChapter = false,
  hasPrevChapter = false,
}) => {
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light");

  const [[pageIndex, direction], setPage] = useState<[number, number]>([0, 0]);
  const [pages, setPages] = useState<string[]>([]);

  const pageContainerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [titleReservedHeight, setTitleReservedHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rawContent = useMemo(
    () => contentHtml || content || "",
    [contentHtml, content]
  );
  const normalizedContent = useMemo(
    () => htmlToPlainText(rawContent),
    [rawContent]
  );

  // Quitar del contenido el título de capítulo si viene repetido dentro del texto.
  const contentForPagination = useMemo(() => {
    if (!chapterTitle) return normalizedContent;

    const heading = chapterTitle.trim();
    if (!heading) return normalizedContent;

    const pattern = new RegExp(
      "^\\s*" + escapeRegExp(heading) + "\\s*\\n+",
      "i"
    );

    return normalizedContent.replace(pattern, "").trimStart();
  }, [normalizedContent, chapterTitle]);

  // Medir dinámicamente cuánto espacio ocupa el título dentro del contenedor
  useLayoutEffect(() => {
    const pageEl = pageContainerRef.current;
    const titleEl = titleRef.current;

    if (!pageEl || !titleEl || pageIndex !== 0) {
      setTitleReservedHeight(0);
      return;
    }

    const pageRect = pageEl.getBoundingClientRect();
    const titleRect = titleEl.getBoundingClientRect();

    // Altura del título (incluyendo su posición relativa dentro del contenedor)
    const bottomWithin = titleRect.bottom - pageRect.top;
    const reserved = Math.min(
      Math.max(bottomWithin, 0),
      pageEl.clientHeight
    );

    setTitleReservedHeight(reserved);
  }, [viewportWidth, chapterTitle, pageIndex]);

  // Reader.tsx (dentro del componente)

  // PAGINACIÓN
  useLayoutEffect(() => {
    const pageEl = pageContainerRef.current;
    const measureEl = measureRef.current;
    if (!pageEl || !measureEl) return;

    const containerHeight = pageEl.clientHeight;
    const containerWidth = pageEl.clientWidth;

    if (containerHeight === 0 || containerWidth === 0) return;

    // Detectar modo columnas (PC/Tablet horizontal)
    const isTwoColumnMode = containerWidth > 850;

    // Altura total "lógica" disponible para texto en una página normal
    // Si hay 2 columnas, cabe el doble de texto (aprox)
    let targetHeight = containerHeight;

    if (isTwoColumnMode) {
      const gap = 60; // Debe coincidir con CSS
      const colWidth = (containerWidth - gap) / 2;
      measureEl.style.width = `${colWidth}px`;
      // Multiplicador un poco menor a 2 para margen de seguridad en columnas
      targetHeight = containerHeight * 1.9;
    } else {
      measureEl.style.width = `${containerWidth}px`;
      targetHeight = containerHeight;
    }

    measureEl.style.height = "auto";

    const text = contentForPagination;
    const totalLength = text.length;

    if (totalLength === 0) {
      setPages([]);
      setPage([0, 0]);
      return;
    }

    if (containerHeight < 50) return;

    const newPages: string[] = [];
    let start = 0;

    // ---------------------------------------------------------
    // 1) CÁLCULO DE LA PRIMERA PÁGINA (SOLUCIÓN AL CORTE)
    // ---------------------------------------------------------
    {
      // Estimamos cuánto ocupa el Título + Margen en píxeles.
      // Es mejor sobreestimar (200px) que quedarse corto.
      const ESTIMATED_TITLE_HEIGHT = 180;

      // Calculamos la altura disponible REAL de una columna en la pág 1
      const availableColHeight = containerHeight - ESTIMATED_TITLE_HEIGHT;

      // Si estamos en 2 columnas, el texto llena la col izquierda Y la derecha
      // reducidas ambas por el título.
      const firstPageCapacity = isTwoColumnMode
        ? (availableColHeight * 2) // Llenamos 2 columnas recortadas
        : availableColHeight;      // Llenamos 1 columna recortada

      // Aplicamos un buffer de seguridad extra (unos 40px para evitar líneas viudas al final)
      const SAFE_FIRST_PAGE_HEIGHT = Math.max(firstPageCapacity - 40, 100);

      let low = start + 1;
      let high = totalLength;
      let best = low;

      // Búsqueda binaria para ver cuánto texto cabe en ese espacio reducido
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        measureEl.textContent = text.slice(start, mid);

        // IMPORTANTE: Comparamos contra la capacidad reducida
        if (measureEl.scrollHeight <= SAFE_FIRST_PAGE_HEIGHT) {
          best = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      // Ajuste fino: no cortar palabras a la mitad
      let end = best;
      if (end < totalLength) {
        const lastSpace = text.lastIndexOf(" ", end);
        // Si el espacio está razonablemente cerca, cortar ahí
        if (lastSpace > start + (end - start) * 0.8) {
          end = lastSpace + 1;
        }
      }
      if (end <= start) end = start + 1;

      newPages.push(text.slice(start, end));
      start = end;
    }

    // ---------------------------------------------------------
    // 2) RESTO DE PÁGINAS (Altura completa)
    // ---------------------------------------------------------
    // Margen de seguridad para páginas normales (evita cortar la última línea)
    const NORMAL_PAGE_SAFETY = 30;
    const normalPageTarget = targetHeight - NORMAL_PAGE_SAFETY;

    while (start < totalLength) {
      let low = start + 1;
      let high = totalLength;
      let best = low;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        measureEl.textContent = text.slice(start, mid);
        if (measureEl.scrollHeight <= normalPageTarget) {
          best = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      let end = best;
      if (end < totalLength) {
        const lastSpace = text.lastIndexOf(" ", end);
        if (lastSpace > start + (end - start) * 0.8) {
          end = lastSpace + 1;
        }
      }
      if (end <= start) end = start + 1;

      newPages.push(text.slice(start, end));
      start = end;
    }

    setPages(newPages);

    // Mantener la página actual válida si cambia el tamaño
    setPage((prev) => {
      const currentP = prev[0];
      if (newPages.length === 0) return [0, 0];
      const newP = Math.min(currentP, newPages.length - 1);
      return [newP, 0];
    });
  }, [contentForPagination, viewportWidth]); // Quitamos titleReservedHeight de dependencias
  // initialLocation
  useEffect(() => {
    if (pages.length === 0) return;
    const total = pages.length;
    const targetPage = Math.floor(initialLocation * (total - 1));
    setPage([Math.min(total - 1, Math.max(0, targetPage)), 0]);
  }, [initialLocation, pages.length]);

  // Notificar progreso
  useEffect(() => {
    if (!onLocationChange || pages.length === 0) return;
    const loc = pages.length === 1 ? 1 : pageIndex / (pages.length - 1);
    onLocationChange(loc);
  }, [pageIndex, pages.length, onLocationChange]);

  // --- CAMBIO DE PÁGINA / CAPÍTULO ---
  const paginate = (newDirection: number) => {
    if (newDirection === 0 || pages.length === 0) return;

    const newIndex = pageIndex + newDirection;

    if (newDirection > 0) {
      if (newIndex < pages.length) {
        setPage([newIndex, newDirection]);
      } else if (onRequestNextChapter) {
        onRequestNextChapter();
      }
    } else {
      if (newIndex >= 0) {
        setPage([newIndex, newDirection]);
      } else if (onRequestPrevChapter) {
        onRequestPrevChapter();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      paginate(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      paginate(-1);
    }
  };

  const progressPercent =
    pages.length <= 1 ? 100 : Math.round((pageIndex / (pages.length - 1)) * 100);
  const currentText = pages[pageIndex] || "";

  const cycleTheme = () =>
    setTheme((t) => (t === "light" ? "sepia" : t === "sepia" ? "dark" : "light"));

  const canGoPrevPage = pageIndex > 0;
  const canGoNextPage = pageIndex < pages.length - 1;

  const showPrevArrow = canGoPrevPage || hasPrevChapter;
  const showNextArrow = canGoNextPage || hasNextChapter;

  const chapterHeading = (chapterTitle || title)?.toUpperCase();

  return (
    <div
      className={`reader reader--${theme}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <ReaderHeader title={title} onToggleTheme={cycleTheme} Icons={Icons} />

      <main className="reader-main">
        <button
          className="reader-nav-btn reader-nav-prev"
          onClick={() => paginate(-1)}
          style={{ visibility: showPrevArrow ? "visible" : "hidden" }}
        >
          <Icons.ChevronLeft />
        </button>

        <div className="reader-page-container" ref={pageContainerRef}>
          {showPrevArrow && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "20%",
                zIndex: 5,
                cursor: "pointer",
              }}
              onClick={() => paginate(-1)}
            />
          )}
          {showNextArrow && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "20%",
                zIndex: 5,
                cursor: "pointer",
              }}
              onClick={() => paginate(1)}
            />
          )}

          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={pageIndex}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="reader-animated-page"
            >
              {pageIndex === 0 && chapterHeading && (
                <h1 ref={titleRef} className="reader-chapter-title">
                  {chapterHeading}
                </h1>
              )}

              <p className="reader-text">{currentText}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          className="reader-nav-btn reader-nav-next"
          onClick={() => paginate(1)}
          style={{ visibility: showNextArrow ? "visible" : "hidden" }}
        >
          <Icons.ChevronRight />
        </button>
      </main>

      <ReaderFooter
        progressPercent={progressPercent}
        pageIndex={pageIndex}
        totalPages={pages.length}
        estimatedMinutes={Math.ceil((pages.length - pageIndex) * 1.5)}
      />

      <div ref={measureRef} className="reader-measure" aria-hidden="true" />
    </div>
  );
};

export default Reader;
