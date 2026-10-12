/**
 * Composition root: el único sitio donde se crean los adaptadores concretos y
 * se conectan con los casos de uso. Lo cargan los 5 HTML de la raíz.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "@/app/App";
import { ProveedorDependencias } from "@/app/ProveedorDependencias";
import { featureModules } from "@/app/funcionalidades";
import { precargarPagina } from "@/app/paginas";
import { createContainer } from "@/application/funcionalidad";
import { createFetchHttpClient } from "@/infrastructure/http-fetch";
import { createLocalPreferenceStore } from "@/infrastructure/preferencias-local";

const container = createContainer(
  { http: createFetchHttpClient(), preferences: createLocalPreferenceStore() },
  featureModules,
);

const root = document.getElementById("root");
if (!root) throw new Error('Falta <div id="root"> en el HTML.');

const montar = () =>
  createRoot(root).render(
    <StrictMode>
      <ProveedorDependencias container={container}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProveedorDependencias>
    </StrictMode>,
  );

// La página de la URL se baja antes de montar: la primera pantalla se pinta
// entera, sin pasar por el esqueleto. Si la descarga falla, se monta igual y
// `lazy()` lo reintenta.
void precargarPagina(window.location.pathname).then(montar, montar);
