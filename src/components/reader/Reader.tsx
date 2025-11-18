// src/components/reader/Reader.tsx
import React, {
    useEffect,
    useMemo,
    useState,
    KeyboardEvent,
    useRef,
    useLayoutEffect,
  } from "react";
import "./Reader.css";

type FontSize = "sm" | "md" | "lg" | "xl";
type Theme = "light" | "sepia" | "dark";

interface ReaderProps {
    title: string;
    author?: string;
    content: string;
    initialLocation?: number;
    onLocationChange?: (location: number) => void;
}
  
const Reader: React.FC<ReaderProps> = ({
    title,
    author,
    content,
    initialLocation = 0,
    onLocationChange,
  }) => {
    const [fontSize, setFontSize] = useState<FontSize>("md");
    const [theme, setTheme] = useState<Theme>("dark");
    const [pageIndex, setPageIndex] = useState(0);
    const [pages, setPages] = useState<string[]>([""]);
  
    const pageContainerRef = useRef<HTMLDivElement | null>(null);
    const measureRef = useRef<HTMLDivElement | null>(null);
  
    // Para recalcular al cambiar el tamaño de la ventana
    const [viewportKey, setViewportKey] = useState(0);
    useEffect(() => {
      const handleResize = () => setViewportKey((k) => k + 1);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    // Normalizamos saltos de línea
    const normalizedContent = useMemo(
      () => (content || "").replace(/\r\n/g, "\n"),
      [content]
    );
  
    // PAGINADO REAL
    useLayoutEffect(() => {
      const pageEl = pageContainerRef.current;
      const measureEl = measureRef.current;
      if (!pageEl || !measureEl) return;
  
      const height = pageEl.clientHeight;
      const width = pageEl.clientWidth;
      if (height === 0 || width === 0) return;
  
      // Configuramos el medidor con el mismo ancho que la página
      measureEl.style.width = `${width}px`;
      measureEl.style.height = "auto";
      measureEl.textContent = "";
  
      const text = normalizedContent;
      const totalLength = text.length;
      const newPages: string[] = [];
  
      let start = 0;
  
      while (start < totalLength) {
        let low = start + 1;
        let high = totalLength;
        let best = low;
  
        // Binary search para encontrar el máximo número de caracteres
        // que caben en la altura disponible
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const slice = text.slice(start, mid);
          measureEl.textContent = slice;
  
          if (measureEl.scrollHeight <= height) {
            best = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
  
        let end = best;
  
        // Intentamos cortar en un lugar razonable
        const lastParagraphBreak = text.lastIndexOf("\n\n", best - 1);
        if (lastParagraphBreak > start + 200) {
          end = lastParagraphBreak + 2;
        } else {
          const lastSpace = text.lastIndexOf(" ", best - 1);
          if (lastSpace > start + 200 && best - lastSpace < 40) {
            end = lastSpace + 1;
          }
        }
  
        if (end <= start) {
          end = best; // fallback
        }
  
        newPages.push(text.slice(start, end));
        start = end;
      }
  
      setPages(newPages);
      setPageIndex((prev) =>
        newPages.length === 0 ? 0 : Math.min(prev, newPages.length - 1)
      );
    }, [normalizedContent, fontSize, viewportKey]);
  
    // Ajustar página inicial según initialLocation
    useEffect(() => {
      if (pages.length === 0) return;
      const total = pages.length;
      const targetPage = Math.min(
        total - 1,
        Math.max(0, Math.floor(initialLocation * (total - 1)))
      );
      setPageIndex(targetPage);
    }, [pages.length, initialLocation]);
  
    // Notificar avance al padre
    useEffect(() => {
      if (!onLocationChange || pages.length === 0) return;
      const location =
        pages.length === 1 ? 1 : pageIndex / (pages.length - 1 || 1);
      onLocationChange(location);
    }, [pageIndex, pages.length, onLocationChange]);
  
    const handleNextPage = () => {
      setPageIndex((prev) => Math.min(prev + 1, pages.length - 1));
    };
  
    const handlePrevPage = () => {
      setPageIndex((prev) => Math.max(prev - 1, 0));
    };
  
    const handleFontIncrease = () => {
      setFontSize((prev) => {
        if (prev === "sm") return "md";
        if (prev === "md") return "lg";
        if (prev === "lg") return "xl";
        return "xl";
      });
    };
  
    const handleFontDecrease = () => {
      setFontSize((prev) => {
        if (prev === "xl") return "lg";
        if (prev === "lg") return "md";
        if (prev === "md") return "sm";
        return "sm";
      });
    };
  
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        handleNextPage();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevPage();
      }
    };
  
    const progressPercent =
      pages.length <= 1 ? 100 : Math.round((pageIndex / (pages.length - 1)) * 100);
  
    const currentText = pages[pageIndex] ?? "";
  
    return (
      <div
        className={`reader reader--${theme}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* HEADER */}
        <header className="reader-header">
          <div className="reader-header-left">
            <div className="reader-book-meta">
              <h1 className="reader-title">{title}</h1>
              {author && <p className="reader-author">{author}</p>}
            </div>
          </div>
  
          <div className="reader-header-right">
            <div className="reader-progress">
              <div className="reader-progress-bar">
                <div
                  className="reader-progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="reader-progress-label">
                {progressPercent}% leído
              </span>
            </div>
          </div>
        </header>
  
        {/* CONTENEDOR PRINCIPAL */}
        <main className="reader-main">
          <div
            className={`reader-page reader-page--font-${fontSize}`}
            ref={pageContainerRef}
          >
            <div className="reader-page-inner">
              <p className="reader-text">{currentText}</p>
            </div>
  
            <button
              className="reader-page-tap reader-page-tap-left"
              onClick={handlePrevPage}
              aria-label="Página anterior"
            />
            <button
              className="reader-page-tap reader-page-tap-right"
              onClick={handleNextPage}
              aria-label="Página siguiente"
            />
          </div>
        </main>
  
        {/* FOOTER */}
        <footer className="reader-footer">
          <div className="reader-footer-group">
            <span className="reader-footer-label">Tamaño de letra</span>
            <div className="reader-footer-buttons">
              <button onClick={handleFontDecrease} className="reader-btn">
                A-
              </button>
              <button onClick={handleFontIncrease} className="reader-btn">
                A+
              </button>
            </div>
          </div>
  
          <div className="reader-footer-group">
            <span className="reader-footer-label">Tema</span>
            <div className="reader-footer-buttons">
              <button
                className={`reader-btn ${
                  theme === "light" ? "reader-btn--active" : ""
                }`}
                onClick={() => setTheme("light")}
              >
                Claro
              </button>
              <button
                className={`reader-btn ${
                  theme === "sepia" ? "reader-btn--active" : ""
                }`}
                onClick={() => setTheme("sepia")}
              >
                Sepia
              </button>
              <button
                className={`reader-btn ${
                  theme === "dark" ? "reader-btn--active" : ""
                }`}
                onClick={() => setTheme("dark")}
              >
                Oscuro
              </button>
            </div>
          </div>
  
          <div className="reader-footer-group">
            <span className="reader-footer-label">
              Página {pages.length === 0 ? 0 : pageIndex + 1} / {pages.length || 1}
            </span>
          </div>
        </footer>
  
        {/* MEDIDOR OCULTO */}
        <div
          ref={measureRef}
          className={`reader-measure reader-page--font-${fontSize}`}
          aria-hidden="true"
        />
      </div>
    );
  };
  
  export default Reader;
  