import { Badge } from "@/components/ui/badge";
import { DISCLAIMER } from "@/domain/sitio";
import { cn } from "@/lib/utils";

export interface AvisoFicticioProps {
  className?: string;
}

/** Aviso de proyecto universitario ficticio. Va en el pie de todas las páginas. */
export function AvisoFicticio({ className }: AvisoFicticioProps) {
  return (
    <p className={cn("flex flex-col items-start gap-2 rounded-control border border-ink-mut/40 px-4 py-3 text-label text-ink-txt sm:flex-row sm:items-center", className)}>
      <Badge variant="outline" className="h-auto shrink-0 rounded-full border-ink-mut px-2.5 py-0.5 text-caption font-semibold text-ink-txt">
        Aviso
      </Badge>
      <span>{DISCLAIMER}</span>
    </p>
  );
}
