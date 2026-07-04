import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/api/endpoints/auth";

export function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    const googleError = searchParams.get("error");

    if (googleError) {
      setError("Autenticación cancelada con Google");
      return;
    }

    if (!code) {
      setError("Código de autorización no encontrado");
      return;
    }

    const handleGoogleAuth = async () => {
      try {
        const response = await authApi.loginWithGoogle(code);
        if (response.success && response.data) {
          await loginWithGoogle(response.data);
          navigate("/", { replace: true });
        } else {
          setError(response.error?.message || "Error al autenticar con Google");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al autenticar con Google";
        setError(message);
      }
    };

    handleGoogleAuth();
  }, [searchParams, loginWithGoogle, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Autenticación</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
        <div className="animate-spin w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Autenticando con Google...</h2>
        <p className="text-gray-600">Por favor espera un momento</p>
      </div>
    </div>
  );
}
