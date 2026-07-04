import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

const LoginPage = lazy(() =>
  import("@/pages/public/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("@/pages/public/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const GoogleCallbackPage = lazy(() =>
  import("@/pages/public/GoogleCallbackPage").then((m) => ({ default: m.GoogleCallbackPage }))
);
const HomePage = lazy(() =>
  import("@/pages/public/HomePage").then((m) => ({ default: m.HomePage }))
);
const CatalogPage = lazy(() =>
  import("@/pages/public/CatalogPage").then((m) => ({ default: m.CatalogPage }))
);
const ProductPage = lazy(() =>
  import("@/pages/public/ProductPage").then((m) => ({ default: m.ProductPage }))
);

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full" />
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<PageLoader />}>
              <RegisterPage />
            </Suspense>
          }
        />
        <Route
          path="/auth/google/callback"
          element={
            <Suspense fallback={<PageLoader />}>
              <GoogleCallbackPage />
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/catalogo"
          element={
            <Suspense fallback={<PageLoader />}>
              <CatalogPage />
            </Suspense>
          }
        />
        <Route
          path="/producto/:slug"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-6">Página no encontrada</p>
                <a href="/" className="text-sky-600 hover:text-sky-700 font-medium">
                  Volver al Inicio
                </a>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
