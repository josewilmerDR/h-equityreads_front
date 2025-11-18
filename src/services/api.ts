// src/services/api.ts
const API_BASE_URL =
  "https://5000-firebase-hreads-back-1763343106367.cluster-dwvm25yncracsxpd26rcd5ja3m.cloudworkstations.dev";

export async function fetchBooks() {
  const res = await fetch(`${API_BASE_URL}/api/books`);
  if (!res.ok) throw new Error("Error al cargar libros");
  return res.json();
}

export async function fetchChapter(bookId: string, chapterNumber: number | string) {
  const res = await fetch(`${API_BASE_URL}/api/books/${bookId}/chapters/${chapterNumber}`);
  if (!res.ok) throw new Error("Error al cargar el capítulo");
  return res.json();
}
