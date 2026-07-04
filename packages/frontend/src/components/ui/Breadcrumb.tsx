import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <Link to="/" className="hover:text-sky-600 transition-colors">
        Inicio
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <span>/</span>
          {item.href ? (
            <Link to={item.href} className="hover:text-sky-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
