import { Link } from "react-router-dom";
import { SITE_NAME } from "@/domain/sitio";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  onClick?: () => void;
}

/** Logo + nombre: un solo enlace al inicio. La imagen es decorativa (el nombre va al lado). */
export function Logo({ className, onClick }: LogoProps) {
  return (
    <Link to="/" onClick={onClick} className={cn("flex min-h-11 min-w-0 items-center gap-2.5 text-arc no-underline", className)}>
      <img src="/img/logo-120.webp" alt="" width={40} height={40} className="size-10 shrink-0 rounded-full" />
      <span className="text-label leading-tight font-semibold sm:text-body">{SITE_NAME}</span>
    </Link>
  );
}
