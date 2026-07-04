export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">MiTienda</h3>
            <p className="text-sm">
              Tu tienda en línea de confianza. Los mejores productos al mejor
              precio.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/catalogo" className="hover:text-white transition-colors">
                  Catálogo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm">
              <li>contacto@mitienda.com</li>
              <li>+54 11 1234-5678</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
          <p>© {new Date().getFullYear()} MiTienda. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
