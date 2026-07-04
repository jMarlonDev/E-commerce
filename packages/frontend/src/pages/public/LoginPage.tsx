import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody } from "@/components/ui/Card";
import { GoogleAuthButton } from "@/components/common/GoogleAuthButton";
import type { LoginInput } from "@/types/user";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState<LoginInput>({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
            <p className="text-gray-600 mt-2">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">O continúa con</span>
            </div>
          </div>

          <GoogleAuthButton isLoading={isLoading} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="text-sky-600 hover:text-sky-700 font-medium"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
