import { cn } from "@/utils/cn";

interface Spec {
  label: string;
  value: string | number | null;
}

interface ProductSpecsProps {
  specs: Spec[];
  className?: string;
}

export function ProductSpecs({ specs, className }: ProductSpecsProps) {
  const validSpecs = specs.filter((s) => s.value !== null && s.value !== undefined && s.value !== "");

  if (validSpecs.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {validSpecs.map((spec) => (
        <div key={spec.label} className="flex items-center gap-2">
          <span className="text-sm text-gray-500 w-28 shrink-0">{spec.label}:</span>
          <span className="text-sm text-gray-900">{String(spec.value)}</span>
        </div>
      ))}
    </div>
  );
}
