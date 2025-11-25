// src/components/reader/ReaderHeader.tsx
import React from "react";
import "./ReaderHeader.css";

interface ReaderHeaderProps {
  title: string;
  onToggleTheme: () => void;
  onToggleMenu?: () => void;
  onToggleSearch?: () => void;
  onToggleSpeech?: () => void;
  isSpeaking?: boolean;
  isVisible: boolean; // New prop to control visibility
  Icons: {
    Library: React.FC;
    Aa: React.FC;
    Search: React.FC;
    Bookmark: React.FC;
    Menu: React.FC;
    Headphones?: React.FC;
    Stop?: React.FC;
  };
}

const ReaderHeader: React.FC<ReaderHeaderProps> = ({
  title,
  onToggleTheme,
  onToggleMenu,
  onToggleSearch,
  onToggleSpeech,
  isSpeaking,
  isVisible,
  Icons,
}) => {
  return (
    <header className={`reader-header ${!isVisible ? "hidden" : ""}`}>
      {/* IZQUIERDA: Biblioteca */}
      <div className="reader-header-left">
        <button className="reader-btn-library">
          <Icons.Library /> Biblioteca
        </button>
      </div>

      {/* CENTRO: Título */}
      <div className="reader-header-center">
        <h1 className="reader-title">{title}</h1>
      </div>

      {/* DERECHA: Botones */}
      <div className="reader-header-right">
        {/* Botón de Audio (Lectura en Voz Alta) */}
        {onToggleSpeech && Icons.Headphones && Icons.Stop && (
          <button className="reader-icon-btn" onClick={onToggleSpeech} title="Leer en voz alta">
            {isSpeaking ? <Icons.Stop /> : <Icons.Headphones />}
          </button>
        )}

        <button className="reader-icon-btn" onClick={onToggleTheme} title="Cambiar tema">
          <Icons.Aa />
        </button>

        <button className="reader-icon-btn" onClick={onToggleSearch} title="Buscar">
          <Icons.Search />
        </button>

        <button className="reader-icon-btn">
          <Icons.Bookmark />
        </button>

        {/* Botón de Menú (Tabla de Contenidos) */}
        <button className="reader-icon-btn" onClick={onToggleMenu} title="Tabla de contenidos">
          <Icons.Menu />
        </button>
      </div>
    </header>
  );
};

export default ReaderHeader;
