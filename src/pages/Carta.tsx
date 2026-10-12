import { BarraCategorias } from "@/components/carta/barra-categorias";
import { CierreCarta } from "@/components/carta/cierre-carta";
import { Especialidades } from "@/components/carta/especialidades";
import { HeroCarta } from "@/components/carta/hero-carta";
import { HojaCarta } from "@/components/carta/hoja-carta";
import { useCarta } from "@/hooks/carta/use-carta";
import { usePestanaActiva } from "@/hooks/carta/use-pestana-activa";

/** Ruta `/menu`: la carta completa, con pestañas por categoría y filtro por etiqueta. */
export default function Carta() {
  const { filtro, opciones, cambiarFiltro, limpiarFiltro, carta, textoConteo } = useCarta();
  const { activa, listaRef } = usePestanaActiva(carta.pestanas.map((pestana) => pestana.id));

  return (
    <main id="main">
      <HeroCarta />
      <BarraCategorias
        pestanas={carta.pestanas}
        activa={activa}
        listaRef={listaRef}
        opciones={opciones}
        filtro={filtro}
        onFiltro={cambiarFiltro}
        textoConteo={textoConteo}
      />
      <Especialidades especialidades={carta.especialidades} fueraDelFiltro={carta.especialidadesFueraDelFiltro} />
      <HojaCarta categorias={carta.categorias} vacio={carta.vacio} mensajeVacio={carta.mensajeVacio} onQuitarFiltro={limpiarFiltro} />
      <CierreCarta />
    </main>
  );
}
