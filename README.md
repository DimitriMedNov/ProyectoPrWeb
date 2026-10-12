# 🌮 El Taquito Gordo Feliz

Sitio web de una taquería **ficticia**, hecho como proyecto universitario y
rediseñado con un sistema de diseño inspirado en las páginas de producto de Apple.

**En vivo:** https://taquito.vercel.app

> Proyecto universitario sin fines comerciales: la taquería, el menú y los
> precios son ficticios. El formulario de catering valida los datos de punta a
> punta, pero no guarda ni envía nada.

| Portada | La carta (tema oscuro) | Catering en móvil |
| --- | --- | --- |
| ![Portada](docs/capturas/portada.webp) | ![Carta del menú en tema oscuro](docs/capturas/carta.webp) | ![Formulario de catering en móvil](docs/capturas/catering-movil.webp) |

## Qué tiene

- **Cuatro páginas:** inicio, menú, catering y nosotros, más una 404 propia.
- **Claro y oscuro** según la preferencia del sistema, con contrastes medidos
  (texto ≥ 4.5:1, iconos y bordes ≥ 3:1) en los dos temas.
- **Accesible:** áreas táctiles de 44px, navegación completa con teclado, foco
  retenido en el modal, enlace para saltar al contenido, y respeto a
  `prefers-reduced-motion`, `prefers-contrast` y `prefers-reduced-transparency`.
- **Hecho con React:** cada ruta tiene su HTML y todas montan la misma app
  (`src/main.tsx`); el formulario de catering, el filtro del menú y la galería
  son componentes de React.
- **Menú** con filtro por etiquetas (vegetariano, vegano, picante) y pestañas
  que siguen la sección visible.
- **Catering** con paquetes como tarjetas, total estimado y validación en el
  navegador y en el servidor.
- **Imágenes en WebP** con `srcset`.

## Stack

- **[React](https://react.dev/)** con **[React Router](https://reactrouter.com/)** y **[shadcn/ui](https://ui.shadcn.com/)**.
- **[Vite](https://vitejs.dev/)** — servidor de desarrollo y build multipágina.
- **[TypeScript](https://www.typescriptlang.org/)** — tipado estricto en todo el proyecto.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — estilos con tokens de diseño propios.
- **Función de Vercel** (`api/`) — validación del formulario en el servidor, sin dependencias.
- **[Vitest](https://vitest.dev/)** y **[ESLint](https://eslint.org/)** — tests y lint.
- **GitHub Actions** — `npm run check` en cada push a `main` y en cada PR.

## Páginas

| Archivo          | Ruta        | Descripción                                          |
| ---------------- | ----------- | ---------------------------------------------------- |
| `index.html`     | `/`         | Inicio: portada, especialidades y delivery.          |
| `menu.html`      | `/menu`     | La carta completa, con filtro y pestañas.            |
| `catering.html`  | `/catering` | Paquetes y formulario de solicitud.                  |
| `about.html`     | `/about`    | Historia de la taquería y galería de fotos.          |
| `404.html`       | —           | Página no encontrada (Vercel la sirve sola).         |

## Desarrollo

Necesitas Node 24 (está en `.nvmrc`).

```bash
npm install      # instala dependencias
npm run dev      # servidor local (http://localhost:5173), /api/solicitud incluido
npm run check    # lint + typecheck + arquitectura + tests + build + revisión de dist (igual que CI)
npm run preview  # previsualiza el build de producción
```

Otros: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`.

## Estructura

```
.
├── index.html · menu.html · catering.html · about.html · 404.html   # una por ruta; todas montan src/main.tsx
├── api/
│   └── solicitud.ts      # función de Vercel: POST /api/solicitud
├── build/
│   ├── html.ts           # plugin de Vite: fuentes, SEO, sitemap y 404 en desarrollo
│   ├── api-dev.ts        # sirve /api/solicitud en npm run dev
│   └── site.ts           # URL del sitio y datos para SEO
├── src/
│   ├── main.tsx          # entrada: crea los adaptadores y monta la app
│   ├── domain/           # reglas y datos puros (menu.ts: ÚNICA fuente del menú, precios y paquetes; solicitud.ts; sitio.ts)
│   ├── application/      # casos de uso y puertos
│   ├── infrastructure/   # adaptadores (único sitio con fetch y localStorage)
│   ├── app/              # armazón de la app, rutas y dependencias
│   ├── hooks/            # hooks use*
│   ├── pages/            # una página por ruta
│   ├── components/       # ui (shadcn, Animate UI), charts (Bklit), layout, shared y uno por pantalla
│   ├── lib/utils.ts      # cn()
│   └── styles/main.css  # Tailwind + tokens de diseño (claro y oscuro)
├── public/
│   ├── photos/           # imágenes de los platillos
│   ├── img/              # derivadas: WebP, recortes sin fondo, logo, favicon
│   ├── icons.svg         # iconos dibujados a mano (sprite SVG)
│   ├── og.png            # imagen para compartir (1200×630)
│   ├── robots.txt
│   └── apple-touch-icon.png
├── tests/                # tests de la función de Vercel (fuera de api/ a propósito)
├── scripts/              # check-dist.mjs (revisión del build) y check-arch.mjs (capas)
├── ARCHITECTURE.md       # capas y reglas del front
├── assets-src/           # originales de las imágenes optimizadas (no se publican)
├── docs/                 # capturas y material del proyecto (no se publica)
├── vite.config.ts
└── vercel.json
```

## Cómo cambiar contenido compartido

- **Menú, precios o paquetes:** edita `src/domain/menu.ts`. La portada, `/menu`,
  `/catering` y la validación del servidor salen de ahí.
- **Cabecera o pie:** edita `src/components/layout/` (`cabecera.tsx`, `pie.tsx`).
- **Dirección, horario, aviso o títulos de página:** edita `src/domain/sitio.ts`.

## Despliegue

Vercel publica `main` automáticamente (`npm run build` → `dist/`, y `api/` como
funciones). La URL del sitio para SEO se puede cambiar con la variable de
entorno `SITE_URL`.

## Notas

- **Formulario de catering:** `api/solicitud.ts` vuelve a validar los datos,
  recalcula el total con los precios de `src/domain/menu.ts`, descarta el spam con
  un campo trampa y registra un resumen en los logs de Vercel (sin correo ni
  teléfono). No se guarda ni se envía a nadie, y no se piden datos de tarjeta.
- **No pongas tests dentro de `api/`:** Vercel publica cada archivo de esa
  carpeta como función. `npm run check` falla si encuentra uno.
- **Tema:** sigue la preferencia del sistema y hay un interruptor de tema; la elección se guarda.
- **Caché de Vite:** después de tocar `@theme` en `main.css` o `vite.config.ts`,
  reinicia `npm run dev` (y borra `node_modules/.vite` si algo se ve raro).

## Créditos

Carpool Venom · D'mitri Medina Novelo y William Moran Ramírez.
