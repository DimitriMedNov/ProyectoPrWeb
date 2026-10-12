'use client';

/**
 * Animate UI · components/buttons/theme-toggler, ADAPTADO al proyecto:
 * usa `useTema()` (ya no la librería de temas que traía), tiene nombre accesible en español que
 * dice el tema actual y a cuál cambia, y mide 44×44 px.
 */
import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

import {
  ThemeToggler as ThemeTogglerPrimitive,
  type ThemeTogglerProps as ThemeTogglerPrimitiveProps,
  type ThemeSelection,
} from '@/components/animate-ui/primitives/effects/theme-toggler';
import { siguienteTema, useTema } from '@/hooks/use-tema';
import { cn } from '@/lib/utils';

const NOMBRE: Record<ThemeSelection, string> = {
  light: 'claro',
  dark: 'oscuro',
  system: 'del sistema',
};

const ICONO: Record<ThemeSelection, React.ReactNode> = {
  light: <Sun aria-hidden="true" />,
  dark: <Moon aria-hidden="true" />,
  system: <Monitor aria-hidden="true" />,
};

type ThemeTogglerButtonProps = Omit<
  React.ComponentProps<'button'>,
  'children' | 'aria-label' | 'type'
> & {
  onImmediateChange?: ThemeTogglerPrimitiveProps['onImmediateChange'];
};

function ThemeTogglerButton({
  onImmediateChange,
  onClick,
  className,
  ...props
}: ThemeTogglerButtonProps) {
  const { tema, resuelto, sistema, setTema } = useTema();

  return (
    <ThemeTogglerPrimitive
      theme={tema}
      resolvedTheme={resuelto}
      setTheme={setTema}
      onImmediateChange={onImmediateChange}
    >
      {({ effective, toggleTheme }) => {
        const next = siguienteTema(effective, sistema);
        return (
          <button
            type="button"
            data-slot="theme-toggler-button"
            data-tema={effective}
            aria-label={`Tema ${NOMBRE[effective]}. Cambiar a tema ${NOMBRE[next]}`}
            title={`Cambiar a tema ${NOMBRE[next]}`}
            className={cn(
              'inline-grid size-11 shrink-0 place-items-center rounded-full text-txt transition-colors hover:bg-panel-2 [&_svg]:pointer-events-none [&_svg]:size-5',
              className,
            )}
            onClick={(e) => {
              onClick?.(e);
              toggleTheme(next);
            }}
            {...props}
          >
            {ICONO[effective]}
          </button>
        );
      }}
    </ThemeTogglerPrimitive>
  );
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps };
