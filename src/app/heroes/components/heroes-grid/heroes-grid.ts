import { Component, effect, inject, Signal, signal } from '@angular/core';
import { Hero } from '../../../interfaces/heroes.interface';
import { HeroesService } from '../../../services/heroes';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-heroes-grid',
  imports: [],
  templateUrl: './heroes-grid.html',
  styleUrl: './heroes-grid.scss',
})
export class HeroesGrid {
  // Services
  readonly heroesService = inject(HeroesService);
  // Signals
  readonly heroes: Signal<Hero[]> = toSignal(this.heroesService.getHeroes(), {
    initialValue: [] as Hero[],
  });
  readonly logHeroes = effect(() => {
    console.log({ heroes: this.heroes() });
  });
}
