# Correcciones post-evaluación — Mindata Challenge

Backlog de mejoras derivado de la devolución del proceso de evaluación.

## 1. Requerimientos funcionales (enunciado)

- [x] **Búsqueda con coincidencia parcial en el servicio**
  - `HeroesService.getHeroesPaginated(page, size, query)`: filtra en memoria por nombre
    (y alias) con coincidencia parcial, case-insensitive y trim. La lógica de búsqueda
    ya no se delega al mock, pero se **preserva el contrato de respuesta paginada** de
    json-server (`HeroesResponsePaginated`: first/prev/next/pages/items/data).
  - Se conserva `getHeroesPaginated` como método único de búsqueda+paginación (filtra
    nombre/alias y pagina preservando el contrato json-server).
  - Unit tests de comportamiento: parcial, case-insensitive, trim, sin resultados,
    query vacía, paginación (prev/next/pages/items) y filtro por alias.
- [x] **Quitar el mínimo de 3 caracteres**
  - Se eliminó `Validators.minLength(3)` y la condición `query.length >= 3` de Filters.
  - El debounce de 1000 ms ya controla la cantidad de llamadas.
  - Tests actualizados: 1-2 caracteres ahora sí disparan la búsqueda; el control
    inválido (sup >= 20) sigue sin emitir.
  - Se eliminaron los `mat-error` de "al menos 3 caracteres" de filters.html.
- [ ] **Tests de casos límite de la grilla**
  - Test del estado vacío: `@empty` → "No se encontraron resultados.".
  - Al borrar el último elemento estando en página > 1, retroceder de página.

## 2. Accesibilidad

- [x] `mat-label` dentro de cada `<mat-form-field>` (Filters y NewHero) para que
      Material asocie programáticamente la etiqueta con el input.
- [x] Revisar `aria-label` del paginador y textos de botones.

## 3. Arquitectura y rendering

- [ ] `changeDetection: ChangeDetectionStrategy.OnPush` en todos los componentes.
- [ ] Corregir ruta comodín: `path: '*'` → `path: '**'` en `app.routes.ts`.
- [ ] Eliminar código muerto restante e imports huérfanos.
- [ ] Configurar ESLint (Angular ESLint) para detectar esto automáticamente.

## 4. Rendimiento

- [ ] **NgOptimizedImage** en las cards: `ngSrc` para imágenes de archivo (`/images/*`).
      Las imágenes base64 (subidas) se excluyen de la directiva (data URLs no soportadas).

## 5. Estilos

- [ ] Reemplazar overrides con `!important` (styles.scss, clases `!bg-*`, `!shadow-*`,
      `!text-*`) por tokens de Material (`--mat-*`) o theming.
- [ ] Responsive de filtros (`grid-cols-5` → breakpoints) y formulario (`grid-cols-2`).

## Orden de implementación

1. Búsqueda en servicio + tests → 2) min. 3 caracteres → 3) tests grilla → 4) labels →
2. OnPush → 6) ruta `**` → 7) limpieza + ESLint → 8) NgOptimizedImage → 9) estilos/responsive.
