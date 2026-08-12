import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroesUtilsService {
  private readonly refreshHeroesGridTrigger = signal<number>(0);
  readonly refreshHeroesGrid = this.refreshHeroesGridTrigger.asReadonly();

  /**
   * Dispara el refresco del grid de héroes.
   * Se usa un contador y no un booleano para que en cada llamada a refreshLoad() se incremente el valor,
   * por lo que SIEMPRE se produce un cambio de valor (y por ende el effect/consumidor reacciona).
   * Con un booleano, dos o más refreshLoad() en el mismo tick se cancelan entre sí (false -> true -> false)
   * y el valor final puede quedar igual que el inicial, con lo que el cambio de señal se pierde y el grid
   * podría no recargar.
   */
  refreshLoad(): void {
    this.refreshHeroesGridTrigger.update((val) => val + 1);
  }
}
