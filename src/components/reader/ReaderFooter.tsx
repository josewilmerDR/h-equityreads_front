// src/components/reader/ReaderFooter.tsx
import React from "react";
import "./ReaderFooter.css";

interface ReaderFooterProps {
  progressPercent: number;
  pageIndex: number;
  totalPages: number;
  estimatedMinutes: number;
}

const ReaderFooter: React.FC<ReaderFooterProps> = ({
  progressPercent,
  pageIndex,
  totalPages,
  estimatedMinutes,
}) => {
  return (
    <footer className="reader-footer">
      <div className="reader-progress-bar-container">
        <div
          className="reader-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="reader-footer-info">
        <span>Tiempo restante: {estimatedMinutes} min</span>
        <span>
          Pág. {pageIndex + 1} de {totalPages} &bull; {progressPercent}%
        </span>
      </div>
    </footer>
  );
};

export default ReaderFooter;
