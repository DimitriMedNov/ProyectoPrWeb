import { Galeria } from "@/components/nosotros/galeria";
import { Historia } from "@/components/nosotros/historia";
import { useNosotros } from "@/hooks/nosotros/use-nosotros";

/** Ruta `/about`: historia de la taquería y galería de fotos. Datos fijos: solo estado de éxito. */
export default function Nosotros() {
  const { historia, galeria } = useNosotros();
  return (
    <main id="main">
      <Historia historia={historia} />
      <Galeria galeria={galeria} />
    </main>
  );
}
