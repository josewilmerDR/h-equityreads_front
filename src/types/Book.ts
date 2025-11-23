// src/types/Book.ts
export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    coverUrl?: string; // 👈 importante
    tag: string;
  }
  