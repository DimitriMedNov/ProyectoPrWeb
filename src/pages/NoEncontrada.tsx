import { PantallaNoEncontrada } from "@/components/no-encontrada";
import { useNoEncontrada } from "@/hooks/no-encontrada/use-no-encontrada";

/** Ruta `*`: cualquier dirección que no exista. */
export default function NoEncontrada() {
  const contenido = useNoEncontrada();
  return (
    <main id="main">
      <PantallaNoEncontrada contenido={contenido} />
    </main>
  );
}
