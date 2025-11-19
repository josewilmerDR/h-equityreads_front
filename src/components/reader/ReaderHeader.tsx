
// src/components/reader/ReaderHeader.tsx
import React from "react";
import "./ReaderHeader.css";

interface ReaderHeaderProps {
  title: string;
  onToggleTheme: () => void;
  Icons: {
    Library: React.FC;
    Aa: React.FC;
    Search: React.FC;
    Bookmark: React.FC;
    Menu: React.FC;
  };
}

const ReaderHeader: React.FC<ReaderHeaderProps> = ({
  title,
  onToggleTheme,
  Icons,
}) => {
  return (
    <header className="reader-header">
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
        <button className="reader-icon-btn" onClick={onToggleTheme}>
          <Icons.Aa />
        </button>

        <button className="reader-icon-btn">
          <Icons.Search />
        </button>

        <button className="reader-icon-btn">
          <Icons.Bookmark />
        </button>

        <button className="reader-icon-btn">
          <Icons.Menu />
        </button>
      </div>
    </header>
  );
};

export default ReaderHeader;
