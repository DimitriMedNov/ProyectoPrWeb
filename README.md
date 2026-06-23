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
| `catering.html`  | `/catering` | Formulario de solicitud de catering.         |
| `about.html`     | `/about`    | Historia de la taquería y galería de fotos.  |

## Desarrollo

```bash
npm install      # instala dependencias
npm run dev      # servidor local con hot-reload (http://localhost:5173)
npm run build    # typecheck + build de producción en dist/
npm run preview  # previsualiza el build de producción
```

## Estructura

```
.
├── index.html · catering.html · about.html   # páginas (entradas de Vite)
├── src/
│   ├── main.ts          # entrada compartida (menú, año del footer)
│   ├── ts/
│   │   ├── menu.ts       # menú móvil + sombra del header
│   │   └── catering.ts   # lógica del formulario de catering
│   └── styles/main.css   # Tailwind + tema (colores de marca)
├── public/photos/        # imágenes (servidas tal cual desde la raíz)
├── vite.config.ts        # configuración multipágina
└── vercel.json           # configuración de despliegue
```

## Despliegue (Vercel)

El proyecto incluye `vercel.json`. Para publicarlo:

1. Sube el repositorio a GitHub.
2. En [vercel.com](https://vercel.com) importa el repo.
3. Vercel detecta `vite` automáticamente (`npm run build` → `dist/`).

También funciona en **Netlify** (build: `npm run build`, publish: `dist`).

## Notas

- El formulario de catering es una **demostración**: no procesa ni guarda datos reales.
- Las imágenes viven en `public/photos/` y se referencian con rutas absolutas (`/photos/...`).
