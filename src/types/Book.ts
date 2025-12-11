// src/types/Book.ts
export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    coverUrl?: string;
    tag: string;
    category?: string; // Comma separated string e.g. "misterio, terror"
  }
  