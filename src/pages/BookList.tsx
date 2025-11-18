// Ejemplo: lista de libros
import React, { useEffect, useState } from "react";
import { fetchBooks } from "../services/api";

const BookList: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks()
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando libros...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title} — {book.author}</li>
      ))}
    </ul>
  );
};

export default BookList;
