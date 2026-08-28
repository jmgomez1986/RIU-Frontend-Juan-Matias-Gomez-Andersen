import { MatPaginatorIntl } from '@angular/material/paginator';
import { I18N } from './es';

/**
 * Devuelve una instancia de MatPaginatorIntl con las etiquetas en español.
 * La configuración (lógica de rango) vive acá; los textos salen de es.ts.
 */
export function getSpanishPaginatorIntl(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();
  intl.itemsPerPageLabel = I18N.paginator.itemsPerPageLabel;
  intl.nextPageLabel = I18N.paginator.nextPageLabel;
  intl.previousPageLabel = I18N.paginator.previousPageLabel;
  intl.firstPageLabel = I18N.paginator.firstPageLabel;
  intl.lastPageLabel = I18N.paginator.lastPageLabel;

  intl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 ${I18N.paginator.ofLabel} ${length}`;
    }
    const start = page * pageSize;
    const end = start < length ? Math.min(start + pageSize, length) : start + pageSize;
    return `${start + 1} – ${end} ${I18N.paginator.ofLabel} ${length}`;
  };

  return intl;
}