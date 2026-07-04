import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SearchBar } from "@/components/common/SearchBar";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold text-sky-600">MiTienda</span>
          </Link>

          <SearchBar className="hidden sm:block flex-1 max-w-md" />

          <nav className="flex items-center gap-3 shrink-0">
            <Link
              to="/catalogo"
              className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
            >
              Catálogo
            </Link>

            <button className="relative p-2 text-gray-600 hover:text-sky-600 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden md:inline">
                  Hola, {user?.first_name}
                </span>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/mi-cuenta"
                  className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors hidden md:inline"
                >
                  Mi Cuenta
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </nav>
        </div>

        <div className="sm:hidden pb-3">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
