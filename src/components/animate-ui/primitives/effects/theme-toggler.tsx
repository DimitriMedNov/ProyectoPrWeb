'use client';

/**
 * Animate UI · primitives/effects/theme-toggler, ADAPTADO al proyecto:
 * - ya no toca la clase `dark` por su cuenta: llama a `setTheme` (el de
 *   `useTema()`), que es el único que la pone;
 * - el barrido con `clip-path` se cambió por el fundido por defecto de View
 *   Transitions (solo opacidad) y no hay transición con movimiento reducido.
 */
import * as React from 'react';
import { flushSync } from 'react-dom';

type ThemeSelection = 'light' | 'dark' | 'system';
type Resolved = 'light' | 'dark';

type ChildrenRender =
  | React.ReactNode
  | ((state: {
      resolved: Resolved;
      effective: ThemeSelection;
      toggleTheme: (theme: ThemeSelection) => void;
    }) => React.ReactNode);

type ThemeTogglerProps = {
  theme: ThemeSelection;
  resolvedTheme: Resolved;
  setTheme: (theme: ThemeSelection) => void;
  onImmediateChange?: (theme: ThemeSelection) => void;
  children?: ChildrenRender;
};

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function ThemeToggler({
  theme,
  resolvedTheme,
  setTheme,
  onImmediateChange,
  children,
}: ThemeTogglerProps) {
  const toggleTheme = React.useCallback(
    (next: ThemeSelection) => {
      onImmediateChange?.(next);

      if (!document.startViewTransition || prefersReducedMotion()) {
        setTheme(next);
        return;
      }

      document.startViewTransition(() => {
        flushSync(() => setTheme(next));
      });
    },
    [onImmediateChange, setTheme],
  );

  return (
    <>
      {typeof children === 'function'
        ? children({ effective: theme, resolved: resolvedTheme, toggleTheme })
        : children}
    </>
  );
}

export {
  ThemeToggler,
  type ThemeTogglerProps,
  type ThemeSelection,
  type Resolved,
};
