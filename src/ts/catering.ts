import { initMenu } from "./menu";

initMenu();

/** Ejecuta fn después de que form.reset() haya restaurado los valores. */
function onFormReset(el: Element | null, fn: () => void): void {
  el?.closest("form")?.addEventListener("reset", () => window.setTimeout(fn));
}

/**
 * Contador de meseras: botones − / + sobre un input numérico (min 3, max 7).
 * Los botones usan aria-disabled en los extremos en vez de disabled, para no
 * perder el foco al llegar al límite.
 */
function initWaitressStepper(): void {
  const input = document.querySelector<HTMLInputElement>("#meseras");
  const output = document.querySelector<HTMLOutputElement>("#meseras-value");
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-step]"));
  if (!input) return;

  const min = Number(input.min);
  const max = Number(input.max);

  const sync = () => {
    const value = Number(input.value);
    buttons.forEach((btn) => {
      const atEdge = Number(btn.dataset.step) < 0 ? value <= min : value >= max;
      btn.setAttribute("aria-disabled", String(atEdge));
    });
    if (output) output.textContent = `${input.value} meseras`;
  };

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (btn.getAttribute("aria-disabled") === "true") return;
      const next = (Number(input.value) || min) + Number(btn.dataset.step);
      input.value = String(Math.min(max, Math.max(min, next)));
      sync();
    }),
  );
  input.addEventListener("input", sync);
  onFormReset(input, sync);
  sync();
}

/** Limita las casillas de complementos: al llegar al máximo, el resto se deshabilita. */
function initAddonsLimit(max = 2): void {
  const group = document.querySelector<HTMLElement>("#complementos");
  const hint = document.querySelector<HTMLElement>("#complementos-hint");
  if (!group) return;

  const boxes = Array.from(group.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));

  const sync = () => {
    const count = boxes.filter((box) => box.checked).length;
    boxes.forEach((box) => {
      box.disabled = !box.checked && count >= max;
    });
    if (hint) {
      hint.textContent =
        count >= max ? `Ya elegiste ${max}. Quita uno para cambiarlo.` : `Elige hasta ${max}.`;
    }
  };

  boxes.forEach((box) => box.addEventListener("change", sync));
  onFormReset(group, sync);
  sync();
}

/**
 * Paquete elegido (radios name="catering"): lo refleja en la cabecera del modal
 * y calcula el total estimado con el precio por persona de cada paquete.
 */
function initPackagePicker(): void {
  const radios = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="catering"]'));
  const label = document.querySelector<HTMLElement>("#modal-package");
  const guests = document.querySelector<HTMLInputElement>("#invitados");
  const total = document.querySelector<HTMLElement>("#total-estimado");
  const detail = document.querySelector<HTMLElement>("#total-detalle");
  if (!radios.length) return;

  const money = (n: number) => `$${n.toLocaleString("en-US")}`;
  const minGuests = Number(guests?.min) || 0;

  const sync = () => {
    const pkg = radios.find((radio) => radio.checked);
    if (!pkg) return;
    if (label) label.textContent = pkg.value;
    if (!total || !detail) return;

    const price = Number(pkg.dataset.price);
    const count = Number(guests?.value);
    if (Number.isInteger(count) && count >= minGuests) {
      total.textContent = money(count * price);
      detail.textContent = `${count} invitados × ${money(price)}`;
    } else {
      total.textContent = "—";
      detail.textContent = `${money(price)} por persona · mínimo ${minGuests} invitados`;
    }
  };

  radios.forEach((radio) => radio.addEventListener("change", sync));
  guests?.addEventListener("input", sync);
  onFormReset(radios[0] ?? null, sync);
  sync();
}

/**
 * Modal del formulario: se abre desde las tarjetas de paquete o el botón del hero,
 * preselecciona el paquete elegido y gestiona accesibilidad (foco, Escape, scroll).
 */
function initModal(): void {
  const modal = document.querySelector<HTMLElement>("#catering-modal");
  const packageLabel = document.querySelector<HTMLElement>("#modal-package");
  if (!modal) return;

  let lastTrigger: HTMLElement | null = null;

  const open = (pkg?: string) => {
    if (pkg) {
      if (packageLabel) packageLabel.textContent = pkg;
      const radio = Array.from(
        modal.querySelectorAll<HTMLInputElement>('input[name="catering"]'),
      ).find((r) => r.value === pkg);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    // Enfoca el paquete elegido (las flechas cambian de paquete) para accesibilidad.
    (
      modal.querySelector<HTMLInputElement>('input[name="catering"]:checked') ??
      modal.querySelector<HTMLInputElement>("input, select, textarea")
    )?.focus();
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

  // Mantiene el foco dentro del modal mientras está abierto: Tab en el último
  // control vuelve al primero, y Mayús+Tab en el primero salta al último.
  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !modal.classList.contains("is-open")) return;

    const focusable = Array.from(
      modal.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/**
 * Envío real: valida en el navegador, manda la solicitud a /api/solicitud
 * (que vuelve a validar y recalcula el total) y muestra el resultado dentro del
 * modal. Mientras envía, ignora clics repetidos sin deshabilitar el botón, para
 * no perder el foco.
 */
function initFormSubmit(): void {
  const form = document.querySelector<HTMLFormElement>("#catering-form");
  const message = document.querySelector<HTMLElement>("#mensaje-enviado");
  const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!form || !message || !submit) return;

  const label = submit.textContent ?? "";
  let sending = false;

  const show = (text: string, state: "ok" | "error") => {
    message.textContent = text;
    message.dataset.state = state;
    message.classList.remove("hidden");
    message.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending || !form.reportValidity()) return;

    const data = new FormData(form);
    const payload: Record<string, unknown> = Object.fromEntries(data);
    payload.complementos = data.getAll("complementos");

    sending = true;
    submit.setAttribute("aria-disabled", "true");
    submit.textContent = "Enviando…";
    try {
      const res = await fetch("/api/solicitud", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        mensaje?: string;
        errores?: Record<string, string>;
      };

      if (res.ok && body.ok) {
        show("¡Tu solicitud se envió correctamente! Te contactaremos pronto. 🌮", "ok");
        form.reset(); // cada control se resincroniza escuchando el evento "reset"
      } else {
        const detalle = body.errores ? ` ${Object.values(body.errores).join(" ")}` : "";
        show(`${body.mensaje ?? "No pudimos enviar tu solicitud."}${detalle}`, "error");
      }
    } catch {
      show("No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.", "error");
    } finally {
      sending = false;
      submit.removeAttribute("aria-disabled");
      submit.textContent = label;
    }
  });
}

initWaitressStepper();
initAddonsLimit();
initPackagePicker();
initModal();
initFormSubmit();
