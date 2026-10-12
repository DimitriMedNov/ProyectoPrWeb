# Arquitectura del front

Front en React con arquitectura por capas (Clean Architecture) y puertos y adaptadores
(hexagonal: la app declara qué necesita de fuera como interfaz, el "puerto", y una pieza
aparte, el "adaptador", lo implementa). Las dependencias apuntan hacia dentro: lo de dentro
no conoce lo de fuera.

## Capas y carpetas

| Carpeta | Qué contiene | Puede importar |
|---|---|---|
| `src/domain` | Tipos, datos y reglas puras: menú, paquetes, validación, total, datos del sitio | solo `src/domain` |
| `src/application` | Puertos (interfaces), casos de uso y el registro de funcionalidades | `src/domain`, `src/application` |
| `src/infrastructure` | Adaptadores: `fetch`, `localStorage`. Implementan los puertos | `application`, `domain` |
| `src/hooks` | Hooks de aplicación `use*`: llaman casos de uso, leen el router y guardan el estado de la pantalla | `application`, `domain`, `src/app/contexto-dependencias` |
| `src/components` | Interfaz: recibe datos y callbacks por props. Incluye hooks de presentación (`use-*.ts` junto al componente que los usa) | `hooks`, `domain` (tipos y datos) |
| `src/pages` | Una página por ruta (contenedor) | `components`, `hooks`, `domain` |
| `src/lib` | Utilidades de interfaz sin reglas: `utils.ts` (`cn`) y `get-strict-context.tsx` (del registro Animate UI) | paquetes |
| `src/app` | Router, proveedor de dependencias y registro de funcionalidades | todo |
| `src/main.tsx` | Composition root: único sitio donde se crean los adaptadores concretos | todo |

Fuera de `src`: `api/solicitud.ts` (función de Vercel) importa `src/domain/solicitud.js` con ruta
relativa y extensión `.js`; `build/site.ts` reexporta los datos de `src/domain/sitio.ts`.
La interfaz anterior (`src/ts/*` y `src/main.ts`) ya no está en esta rama: se retiró y solo
queda en la rama `main` de git.

```
src/
  domain/
    menu.ts              specials, carta, cateringPackages, cateringRules, money + tipos
    sitio.ts             SITE_NAME, ADDRESS, HOURS, DISCLAIMER, CREDITS, PAGES, NOT_FOUND, pageForPath
    result.ts            Result<T, E>, ok, err
    solicitud.ts         validarSolicitud (reglas y total); la usa también api/solicitud.ts
    carta.ts             filtro por etiqueta, pestañas, conteo: filtrarCarta, resolverPestana…
    catering.ts          formulario: valores, total estimado, meseras, complementos, validarFormulario
    catering-envio.ts    SolicitudEnviada, ErrorEnvio y sus mensajes
    inicio.ts            contenido de la portada + especialidadesDePortada
    nosotros.ts          contenido de Nosotros (historia, galería, datos del negocio)
    nosotros-galeria.ts  cálculo de índice y desplazamiento de la galería
    no-encontrada.ts     contenido de la pantalla 404
    *.test.ts            pruebas de cada archivo
  application/
    puertos.ts           HttpClient, PreferenceStore, Dependencies
    funcionalidad.ts     defineFeature, registerFeature, createContainer
    carta/index.ts       CartaUseCases (verCarta, opcionesDeFiltro), CARTA
    catering/index.ts    puerto SolicitudesApi, caso de uso crearEnviarSolicitud, ResultadoEnvio, CATERING
  infrastructure/
    http-fetch.ts            createFetchHttpClient (HttpClient con fetch)
    preferencias-local.ts    createLocalPreferenceStore (PreferenceStore con localStorage)
    catering/
      solicitudes-http.ts    crearSolicitudesHttp: adaptador de SolicitudesApi sobre HttpClient
      solicitud-mapper.ts    SolicitudDto, RespuestaSolicitudDto y sus mappers
  app/
    App.tsx                    rutas (una por entrada de PAGINAS) dentro de <Suspense>
    paginas.tsx                PAGINAS: cada página con lazy() + precargarPagina (la de la URL, antes de montar)
    CateringConConsultas.tsx   ruta /catering envuelta en su proveedor de react-query
    ProveedorDependencias.tsx  proveedor del contenedor
    contexto-dependencias.ts   contexto de React
    funcionalidades/index.ts   recoge solo los módulos de la carpeta (no se edita)
    funcionalidades/carta.ts   registro de Carta (datos estáticos del dominio, sin adaptador)
    funcionalidades/catering.ts  registro de Catering (caso de uso + adaptador HTTP)
  hooks/
    use-dependencias.ts  use-metadatos-pagina.ts  use-desplazamiento-al-navegar.ts
    use-pagina-actual.ts  use-anio-actual.ts  use-tema.ts  use-menu-movil.ts  use-scroll-pasado.ts
    carta/          use-carta.ts  use-pestana-activa.ts
    catering/       use-solicitud-catering.ts  use-formulario-catering.ts  use-envio-solicitud.ts  use-serie-paquetes.ts
    inicio/         use-inicio.ts
    nosotros/       use-nosotros.ts  use-galeria.ts
    no-encontrada/  use-no-encontrada.ts
    use-auto-height.tsx  use-controlled-state.tsx  use-is-in-view.tsx   (código del registro Animate UI)
  components/
    layout/         armazón común: cabecera, navegación, menú móvil, pie, aviso, esqueleto de página
    shared/         piezas propias reutilizadas: botón, tarjeta, sección, píldora, precio, imagen, estados, icono
    shared/movimiento/  revelar, escalonado, fundido de ruta + use-aparicion.ts, use-inclinacion.ts
    inicio/  carta/  nosotros/  no-encontrada/   componentes de cada pantalla
    catering/pagina/      secciones de la página + use-modal-solicitud.ts
    catering/formulario/  modal y pasos del formulario + sus use-*.ts de presentación
    ui/  animate-ui/  charts/   código de registro (shadcn, Animate UI, Bklit)
  lib/                 utils.ts (cn), get-strict-context.tsx
  pages/               Inicio, Carta, Catering, Nosotros, NoEncontrada
  main.tsx             composition root
```

## Reglas duras

- `fetch`, `localStorage` e `import.meta.env` solo en `src/infrastructure`, `src/app` y `src/main.tsx`.
- `src/infrastructure` solo se importa desde `src/app` y `src/main.tsx`. Hooks y componentes ven
  los adaptadores por su puerto, a través del contenedor.
- Lo que devuelve la API (DTO) no llega a los componentes: lo traduce un mapper en `infrastructure`.
- Las reglas de negocio no viven en el JSX ni en un hook: van a `domain` o a un caso de uso.
- Un caso de uso por acción del usuario; recibe sus puertos, no importa adaptadores concretos.

## Cómo añade una pantalla su caso de uso

Ningún paso toca un archivo de otra pantalla (ejemplo con `catering`):

1. `src/application/catering/index.ts`: el puerto, los casos de uso y la clave tipada.
   ```ts
   import { defineFeature } from "../funcionalidad";
   export interface SolicitudesApi { enviar(valores: ValoresFormulario, opciones?: OpcionesEnvio): Promise<ResultadoEnvio> }
   export interface CateringUseCases { enviarSolicitud: EnviarSolicitud }
   export const CATERING = defineFeature<CateringUseCases>("catering");
   ```
2. `src/infrastructure/catering/…`: el adaptador del puerto y su mapper, construido sobre
   `HttpClient` (no llama a `fetch` directo).
3. `src/app/funcionalidades/catering.ts` (el nombre del archivo es el de la clave):
   ```ts
   import { registerFeature } from "@/application/funcionalidad";
   import { CATERING, crearEnviarSolicitud } from "@/application/catering";
   import { crearSolicitudesHttp } from "@/infrastructure/catering/solicitudes-http";
   export default registerFeature(CATERING, (deps) => ({ enviarSolicitud: crearEnviarSolicitud(crearSolicitudesHttp(deps.http)) }));
   ```
   `src/app/funcionalidades/index.ts` lo recoge solo con `import.meta.glob`; no se edita.
4. `src/hooks/catering/use-envio-solicitud.ts`: `const { enviarSolicitud } = useCasosDeUso(CATERING)` y,
   como es estado de servidor, `useMutation` de react-query.

Si falta el paso 3, `useCasosDeUso` lanza "Funcionalidad sin registrar: catering".

## Cómo se declara una página nueva

1. Entrada en `PAGES` de `src/domain/sitio.ts` (archivo, ruta, etiqueta, título, descripción).
   De ahí salen la navegación, el `document.title`, el canonical y el sitemap.
2. Su HTML en la raíz (copia de otro, con su `<title>` y metadatos) y su entrada en
   `build.rollupOptions.input` de `vite.config.ts`.
3. `src/pages/<Nombre>.tsx` con `export default` y un `<main id="main">`.
4. En `src/app/paginas.tsx`: una línea en `PAGINAS`, `pagina("/ruta", () => import("@/pages/<Nombre>"))`.
   `App.tsx` saca de ahí sus `<Route>`.
5. Si tiene una imagen en el primer pantallazo: su entrada en `ROUTE_IMAGES` de `build/html.ts`.

`build/html.test.ts` falla si el título o la descripción del HTML no coinciden con `PAGES`.

## Rutas y HTML

Hay un HTML por ruta (`index`, `menu`, `catering`, `about`, `404`); todos montan `src/main.tsx`
y cada uno lleva su `<head>` (título, descripción, Open Graph). `build/html.ts` añade al
servirlos Inter, la precarga de la imagen principal de la ruta, `og:image` absoluta, canonical
y `og:url` (no en 404), y genera `sitemap.xml`.
Una ruta desconocida sirve `404.html` con código 404: en Vercel de forma nativa (`cleanUrls`),
y en `npm run dev` / `npm run preview` por el middleware de `build/html.ts`. `/api/*` nunca se reescribe.

## Qué se carga y cuándo

Lo que no hace falta para el primer pintado no viaja en el trozo principal (`main`, el que
cargan los 5 HTML). Dónde se decide cada cosa:

| Qué | Cuándo se baja | Dónde |
|---|---|---|
| Página de la ruta | La de la URL, antes de montar React (se pinta entera, sin esqueleto). Las demás, al navegar, con `lazy()` y el esqueleto de `<Suspense>` | `src/app/paginas.tsx` (`PAGINAS`, `precargarPagina`), `src/main.tsx` |
| react-query | Con la ruta `/catering`, la única con estado de servidor | `src/app/CateringConConsultas.tsx` |
| Modal de solicitud (formulario, gráfica Bklit, casillas de Radix) | 2,5 s después de pintar `/catering`, o al pulsar "Solicitar" | `src/pages/Catering.tsx` |
| Panel del menú móvil (Sheet + Radix Dialog) | 2,5 s después de pintar, o al pulsar el botón; hasta entonces el botón es uno sencillo, igual al real | `src/components/layout/menu-movil-diferido.tsx` |
| Piezas compartidas por varias páginas (`components/shared`, `shared/movimiento`) | En `main`: se importan en `src/app/paginas.tsx` y `sharedInMain` (`build/html.ts`) impide que el empaquetador las separe en cinco archivos de menos de 2 kB | `src/app/paginas.tsx`, `build/html.ts` |
| Imagen principal de cada ruta | `<link rel="preload" as="image" fetchpriority="high">` en su HTML (`ROUTE_IMAGES`), con el mismo `srcset` y `sizes` que su `<img>` (la mascota de la portada tiene versión de 720 px; la foto de catering, de 640 y 720 px); `build/html.test.ts` falla si deja de coincidir con la que pinta la pantalla. En `/about` solo desde 640 px de ancho (`media`): por debajo la mascota queda bajo el texto, fuera del primer pantallazo, y por eso su `<img>` tampoco lleva prioridad | `build/html.ts`, `src/components/inicio/mascota-hero.tsx`, `src/components/nosotros/historia.tsx` |
| Imágenes de debajo del primer pantallazo (especialidades y delivery de la portada, galería de Nosotros) | Cuando quedan a menos de 200 px de la ventana. El `<img>` está desde el principio con su `alt` y su hueco; solo `src`/`srcset` llegan después. En la galería se piden la foto visible y la siguiente. No basta `loading="lazy"`: Chrome pide lo que esté a menos de unos 1250 px, es decir, al cargar. Sin `IntersectionObserver`, carga normal | `src/components/shared/imagen-diferida.tsx`, `src/components/shared/use-cerca-de-ventana.ts` |
| Inter (Google Fonts) | Al compilar, sus reglas `@font-face` (`font-display: swap`) se traen y van dentro del HTML: el primer pintado no espera a un servidor de terceros. Sin red al compilar, y en `npm run dev`, queda la hoja enlazada con `preconnect` | `build/html.ts` (`fetchFontCss`, `inlineableFontCss`) |

`<link rel="modulepreload">` del trozo de cada página se probó y se descartó: con el método de
medida del proyecto (Lighthouse móvil simulado sobre `vite preview`, HTTP/1.1) da igual o peor
en 4 de las 5 rutas, porque cada petición en paralelo le quita ancho de banda al trozo principal.

## Patrones en uso

Solo los que tienen código, con el archivo donde están.

| Patrón | Dónde |
|---|---|
| Ports & Adapters | Puertos genéricos `HttpClient` y `PreferenceStore` en `src/application/puertos.ts`; adaptadores en `src/infrastructure/http-fetch.ts` y `src/infrastructure/preferencias-local.ts`. Puerto de pantalla `SolicitudesApi` en `src/application/catering/index.ts` |
| Repository (puerto + adaptador) | Puerto `SolicitudesApi` (`src/application/catering/index.ts`), implementado por `crearSolicitudesHttp` en `src/infrastructure/catering/solicitudes-http.ts`. Es el único: solo tiene `enviar`, porque la app no lee ni lista solicitudes |
| Use Case | Catering: `crearEnviarSolicitud` en `src/application/catering/index.ts` (valida y, si pasa, envía por el puerto). Carta: `crearCasosDeUsoCarta` en `src/application/carta/index.ts` (`verCarta`, `opcionesDeFiltro`; sin puerto, los datos son estáticos) |
| DTO + Mapper | `src/infrastructure/catering/solicitud-mapper.ts`: `SolicitudDto` y `RespuestaSolicitudDto`, con `aSolicitudDto`, `aResultadoEnvio` y `aErrorDeRed` |
| Result (éxito/error tipado) | `src/domain/result.ts`. Lo devuelven `HttpClient.postJson` (`src/application/puertos.ts`, `src/infrastructure/http-fetch.ts`) y el envío de catering: `ResultadoEnvio = Result<SolicitudEnviada, ErrorEnvio>` en `src/application/catering/index.ts` |
| Dependency Injection + Composition Root | `src/main.tsx` crea los adaptadores y el contenedor (`createContainer` de `src/application/funcionalidad.ts`); `src/app/funcionalidades/carta.ts` y `catering.ts` conectan cada caso de uso con lo que necesita; `src/app/ProveedorDependencias.tsx` lo reparte; `src/hooks/use-dependencias.ts` lo lee (`useDependencias`, `useCasosDeUso`) |
| Custom Hook | De aplicación, en `src/hooks`: `carta/use-carta.ts`, `catering/use-envio-solicitud.ts` (los dos que llaman a un caso de uso), `catering/use-solicitud-catering.ts`, `catering/use-formulario-catering.ts`, `use-tema.ts` (usa el puerto `PreferenceStore`), `use-desplazamiento-al-navegar.ts`, `use-metadatos-pagina.ts` y el resto de la carpeta. De presentación, junto a su componente: `src/components/**/use-*.ts` |
| Container / Presentational | Contenedor: `src/pages/*.tsx` llama a los hooks y reparte datos y callbacks. Presentación: `src/components/<pantalla>/` los recibe por props. Excepciones abajo |

### Lo que no hay, o no del todo

- **Inicio, Nosotros y NoEncontrada no tienen caso de uso ni puerto**: no tienen acciones del usuario
  que apliquen una regla ni llamadas al backend; solo muestran contenido fijo. Sus hooks
  (`use-inicio.ts`, `use-nosotros.ts`, `use-no-encontrada.ts`) leen ese contenido directo de
  `src/domain`. Por eso no hay `src/application/<pantalla>` ni `src/app/funcionalidades/<pantalla>.ts` para ellas.
- **Carta tiene caso de uso pero no puerto ni adaptador**: la carta sale de `src/domain/menu.ts`.
- **Estado de servidor (react-query)**: solo `useMutation` en `src/hooks/catering/use-envio-solicitud.ts`.
  El `QueryClient` y su proveedor están en `src/app/CateringConConsultas.tsx` y envuelven solo esa ruta.
  No hay ningún `useQuery`: la app no lee datos del backend.
- **Dos clases de hooks**. En `src/hooks` van los de aplicación (casos de uso, router, estado de la
  pantalla, preferencias). Los de presentación (movimiento, foco, medidas del modal) viven junto al
  componente que los usa: `src/components/carta/use-iman-filtro.ts`, `src/components/nosotros/use-sentido.ts`,
  `src/components/catering/pagina/use-modal-solicitud.ts`, `src/components/catering/formulario/use-*.ts`
  y `src/components/shared/movimiento/use-*.ts`. No llevan reglas de negocio ni llamadas.
- **Componentes que llaman a un hook de `src/hooks` en vez de recibirlo por props** (no son
  presentación pura): el armazón (`src/components/layout/cabecera.tsx`, `menu-movil.tsx`, `pie.tsx`;
  `menu-movil-diferido.tsx` es el botón que lo carga al pulsarlo),
  `src/components/nosotros/galeria.tsx` (`useGaleria`) y
  `src/components/catering/formulario/grafica-paquetes.tsx` (`useSeriePaquetes`).
- `src/pages/Catering.tsx` pasa `cateringPackages` de `src/domain/menu.ts` directo, sin hook.

## Cómo se comprueba

`npm run check:arch` (`scripts/check-arch.mjs`, incluido en `npm run check` y por tanto en el CI). Falla si:

1. `src/domain` importa algo de fuera de `src/domain` (paquetes incluidos; en tests se admite `vitest`).
2. `src/application` importa algo que no sea `src/domain` o `src/application`.
3. `fetch(`, `localStorage` o `import.meta.env` aparecen fuera de `src/infrastructure`, `src/app` y `src/main.tsx`.
4. Algo fuera de `src/app` y `src/main.tsx` importa de `src/infrastructure`.

No revisa el código de registro (`src/components/{ui,animate-ui,charts}`). Los comentarios no cuentan.
