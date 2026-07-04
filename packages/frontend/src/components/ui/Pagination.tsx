import { Button } from "./Button";
import { cn } from "@/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
    .reduce<(number | "...")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className={cn("flex items-center justify-center gap-2 mt-10", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        ← Anterior
      </Button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <Button
            key={p}
            variant={p === currentPage ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(p as number)}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Siguiente →
      </Button>
    </div>
  );
}
