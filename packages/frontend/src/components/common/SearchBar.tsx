import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";

interface SearchBarProps {
  className?: string;
  defaultValue?: string;
  placeholder?: string;
}

export function SearchBar({ className, defaultValue = "", placeholder = "Buscar productos..." }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/catalogo?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/catalogo");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </form>
  );
}
