# 🌮 El Taquito Gordo Feliz

Sitio web de la taquería **El Taquito Gordo Feliz**, construido como sitio estático
multipágina con un stack moderno.

## Stack

- **[Vite](https://vitejs.dev/)** — servidor de desarrollo y bundler.
- **[TypeScript](https://www.typescriptlang.org/)** — lógica con tipado estricto.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — estilos utilitarios y tema de marca.

## Páginas

| Archivo          | Ruta        | Descripción                                  |
| ---------------- | ----------- | -------------------------------------------- |
| `index.html`     | `/`         | Inicio: hero, menú, delivery y reseñas.      |
| `menu.html`      | `/menu`     | Menú completo por categorías.                |
| `catering.html`  | `/catering` | Paquetes y formulario de solicitud.          |
| `about.html`     | `/about`    | Historia de la taquería y galería de fotos.  |

## Desarrollo

```bash
npm install      # instala dependencias
npm run dev      # servidor local con hot-reload (http://localhost:5173)
npm run build    # typecheck + build de producción en dist/
npm run preview  # previsualiza el build de producción
npm run check    # typecheck + build + revisión de dist (lo mismo que corre CI)
```

## Estructura

```
.
├── index.html · menu.html · catering.html · about.html   # páginas (entradas de Vite)
├── build/
│   └── html.ts           # plugin de Vite: cabecera, pie y menú compartidos
├── src/
│   ├── data/menu.ts      # ÚNICA fuente del menú, precios y paquetes de catering
│   ├── main.ts           # entrada compartida (menú, año, galería, revelado)
│   ├── ts/
│   │   ├── menu.ts       # menú móvil + estado de la barra al hacer scroll
│   │   ├── catering.ts   # lógica del formulario de catering
│   │   ├── gallery.ts    # botón de pausa del carrusel de fotos
│   │   ├── menu-page.ts  # filtro y pestañas de la página de menú
│   │   └── reveal.ts     # revelado al entrar en pantalla (nace visible)
│   └── styles/main.css   # Tailwind + tokens de diseño (claro y oscuro)
├── public/
│   ├── photos/           # fotos que usa la web (servidas tal cual)
│   ├── img/              # derivadas: recortes sin fondo, logo ligero, favicon
│   ├── icons.svg         # iconos dibujados a mano (sprite SVG)
│   ├── og.png            # imagen para compartir (1200×630)
│   └── apple-touch-icon.png
├── assets-src/           # originales de las imágenes optimizadas (no se publican)
├── docs/                 # material del proyecto (no se publica)
├── vite.config.ts        # configuración multipágina
└── vercel.json           # configuración de despliegue
```

## Cómo cambiar contenido compartido

- **Menú, precios o paquetes:** edita `src/data/menu.ts`. La portada, `/menu` y
  `/catering` se generan desde ahí al compilar.
- **Cabecera o pie:** edita `build/html.ts`. En los HTML solo hay marcadores como
  `<!--#header current="menu"-->`.

## Despliegue (Vercel)

El proyecto incluye `vercel.json`. Para publicarlo:

1. Sube el repositorio a GitHub.
2. En [vercel.com](https://vercel.com) importa el repo.
3. Vercel detecta `vite` automáticamente (`npm run build` → `dist/`).

También funciona en **Netlify** (build: `npm run build`, publish: `dist`).

## Notas

- El formulario de catering se envía a `api/solicitud.ts`, una función de Vercel
  que vuelve a validar los datos, recalcula el total con los precios de
  `src/data/menu.ts` y registra la solicitud en los logs de Vercel (sin correo ni
  teléfono). **Pendiente:** enviarla por correo o guardarla en una base de datos.
  No se cobra en línea ni se piden datos de tarjeta.
- En `npm run dev`, `/api/solicitud` la sirve `build/api-dev.ts` con el mismo archivo.
- Las imágenes viven en `public/photos/` y se referencian con rutas absolutas (`/photos/...`).
- El tema claro u oscuro sigue la preferencia del sistema; no hay interruptor.
- Después de tocar el bloque `@theme` de `main.css` o `vite.config.ts`, reinicia `npm run dev`
  (y borra `node_modules/.vite` si algo se ve raro): la caché puede quedarse con la config vieja.
