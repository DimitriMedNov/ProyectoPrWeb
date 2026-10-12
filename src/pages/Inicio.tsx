import { DeliveryInicio } from "@/components/inicio/delivery-inicio";
import { HeroInicio } from "@/components/inicio/hero-inicio";
import { MenuInicio } from "@/components/inicio/menu-inicio";
import { useInicio } from "@/hooks/inicio/use-inicio";

/** Ruta `/`: portada, especialidades y delivery. Los datos vienen compilados (solo éxito). */
export default function Inicio() {
  const { hero, menu, delivery } = useInicio();
  return (
    <main id="main">
      <HeroInicio hero={hero} />
      <MenuInicio menu={menu} />
      <DeliveryInicio delivery={delivery} />
    </main>
  );
}
