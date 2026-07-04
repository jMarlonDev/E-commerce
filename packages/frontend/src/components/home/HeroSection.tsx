import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-sky-600 via-sky-700 to-sky-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Los mejores productos
            <br />
            <span className="text-sky-200">al mejor precio</span>
          </h1>
          <p className="text-lg text-sky-100 mb-8 max-w-lg">
            Descubrí nuestra selección de productos de calidad. Envíos a todo el
            país y pago seguro garantizado.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/catalogo">
              <Button size="lg" className="bg-white text-sky-700 hover:bg-sky-50">
                Ver Catálogo
              </Button>
            </Link>
            <Link to="/catalogo?is_featured=true">
              <Button
                size="lg"
                variant="ghost"
                className="text-white border border-white/30 hover:bg-white/10"
              >
                Destacados
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 w-1/3 h-full bg-gradient-to-l from-sky-900/20 to-transparent" />
    </section>
  );
}
