import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody } from "@/components/ui/Card";
import { GoogleAuthButton } from "@/components/common/GoogleAuthButton";
import type { RegisterInput } from "@/types/user";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState<RegisterInput>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
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

    if (!form.first_name.trim()) {
      newErrors.first_name = "El nombre es obligatorio";
    }

    if (!form.last_name.trim()) {
      newErrors.last_name = "El apellido es obligatorio";
    }

    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 8) {
      newErrors.password = "Mínimo 8 caracteres";
    } else if (!/(?=.*[a-z])/.test(form.password)) {
      newErrors.password = "Debe incluir una minúscula";
    } else if (!/(?=.*[A-Z])/.test(form.password)) {
      newErrors.password = "Debe incluir una mayúscula";
    } else if (!/(?=.*\d)/.test(form.password)) {
      newErrors.password = "Debe incluir un número";
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
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al registrar usuario";
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
            <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
            <p className="text-gray-600 mt-2">
              Regístrate para empezar a comprar
            </p>
          </div>

          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Juan"
                error={errors.first_name}
                autoComplete="given-name"
              />

              <Input
                label="Apellido"
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Pérez"
                error={errors.last_name}
                autoComplete="family-name"
              />
            </div>

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
              autoComplete="new-password"
            />

            {form.password && (
              <div className="text-xs text-gray-500 space-y-1">
                <p className={form.password.length >= 8 ? "text-green-600" : ""}>
                  {form.password.length >= 8 ? "✓" : "○"} Mínimo 8 caracteres
                </p>
                <p className={/(?=.*[a-z])/.test(form.password) ? "text-green-600" : ""}>
                  {/(?=.*[a-z])/.test(form.password) ? "✓" : "○"} Una minúscula
                </p>
                <p className={/(?=.*[A-Z])/.test(form.password) ? "text-green-600" : ""}>
                  {/(?=.*[A-Z])/.test(form.password) ? "✓" : "○"} Una mayúscula
                </p>
                <p className={/(?=.*\d)/.test(form.password) ? "text-green-600" : ""}>
                  {/(?=.*\d)/.test(form.password) ? "✓" : "○"} Un número
                </p>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              Crear Cuenta
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">O regístrate con</span>
            </div>
          </div>

          <GoogleAuthButton isLoading={isLoading} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="text-sky-600 hover:text-sky-700 font-medium"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
