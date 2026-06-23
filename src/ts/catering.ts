import "../styles/main.css";
import { initMenu } from "./menu";

initMenu();

/** Refleja el valor del slider de meseras junto a la etiqueta. */
function initWaitressSlider(): void {
  const slider = document.querySelector<HTMLInputElement>("#meseras");
  const output = document.querySelector<HTMLOutputElement>("#meseras-value");
  if (!slider || !output) return;

  const sync = () => (output.textContent = slider.value);
  slider.addEventListener("input", sync);
  sync();
}

/** Limita el <select multiple> de complementos a un máximo de opciones. */
function initAddonsLimit(max = 2): void {
  const select = document.querySelector<HTMLSelectElement>("#complementos");
  if (!select) return;

  let lastValid: string[] = [];
  select.addEventListener("change", () => {
    const selected = Array.from(select.selectedOptions);
    if (selected.length > max) {
      Array.from(select.options).forEach((opt) => {
        opt.selected = lastValid.includes(opt.value);
      });
    } else {
      lastValid = selected.map((opt) => opt.value);
    }
  });
}

/**
 * Modal del formulario: se abre desde las tarjetas de paquete o el botón del hero,
 * preselecciona el paquete elegido y gestiona accesibilidad (foco, Escape, scroll).
 */
function initModal(): void {
  const modal = document.querySelector<HTMLElement>("#catering-modal");
  const packageLabel = document.querySelector<HTMLElement>("#modal-package");
  const packageSelect = document.querySelector<HTMLSelectElement>("#catering");
  if (!modal) return;

  let lastTrigger: HTMLElement | null = null;

  const open = (pkg?: string) => {
    if (pkg) {
      if (packageLabel) packageLabel.textContent = pkg;
      if (packageSelect) packageSelect.value = pkg;
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    // Enfoca el primer campo para accesibilidad.
    modal.querySelector<HTMLInputElement>("input, select, textarea")?.focus();
  };

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lastTrigger?.focus();
  };

  document.querySelectorAll<HTMLElement>("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      lastTrigger = btn;
      open(btn.dataset.package);
    });
  });

  modal.querySelectorAll<HTMLElement>("[data-close-modal]").forEach((btn) =>
    btn.addEventListener("click", close),
  );

  // Cerrar al hacer clic en el fondo (fuera del panel).
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
}

/**
 * Envío simulado (no hay backend). Previene el submit, muestra confirmación
 * dentro del modal y resetea el formulario.
 */
function initFormSubmit(): void {
  const form = document.querySelector<HTMLFormElement>("#catering-form");
  const message = document.querySelector<HTMLElement>("#mensaje-enviado");
  if (!form || !message) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    message.textContent =
      "¡Tu solicitud se envió correctamente! Te contactaremos pronto. 🌮";
    message.classList.remove("hidden");
    form.reset();
    initWaitressSlider(); // resincroniza el valor mostrado tras el reset
    message.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

initWaitressSlider();
initAddonsLimit();
initModal();
initFormSubmit();
