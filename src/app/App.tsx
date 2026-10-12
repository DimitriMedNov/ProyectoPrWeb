import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Armazon } from "@/components/layout/armazon";
import { EsqueletoPagina } from "@/components/layout/esqueleto-pagina";
import { FundidoDeRuta } from "@/components/shared/movimiento";
import { useDesplazamientoAlNavegar } from "@/hooks/use-desplazamiento-al-navegar";
import { useMetadatosDePagina } from "@/hooks/use-metadatos-pagina";
import { PAGINAS } from "./paginas";

/**
 * Rutas de la app (una por entrada de `PAGINAS`, en `./paginas.tsx`). El armazón
 * (cabecera, pie) se monta alrededor de <Suspense>.
 */
export function App() {
  useMetadatosDePagina();
  useDesplazamientoAlNavegar();

  return (
    <Armazon>
      {/* El fallback no lleva id="main": el foco espera al <main> de la página. */}
      <Suspense fallback={<EsqueletoPagina />}>
        {/* Dentro de <Suspense>: el fundido empieza cuando la página ya existe. */}
        <FundidoDeRuta>
          <Routes>
            {PAGINAS.map(({ path, Pagina }) => (
              <Route key={path} path={path} element={<Pagina />} />
            ))}
          </Routes>
        </FundidoDeRuta>
      </Suspense>
    </Armazon>
  );
}
