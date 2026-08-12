import { Component, effect, inject, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HeroesGridRequest } from '../../../interfaces/heroes.interface';
import { HeroesService } from '../../../services/heroes';
import { HeroGridCard } from '../hero-grid-card/hero-grid-card';
import { HeroesUtilsService } from '../../../services/heroe-utils';

@Component({
  selector: 'app-heroes-grid',
  imports: [HeroGridCard, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './heroes-grid.html',
})
export class HeroesGrid {
  // Services
  readonly heroesService = inject(HeroesService);
  readonly heroesUtilsService = inject(HeroesUtilsService);
  // Signals for pagination state
  currentPage = signal(1);
  itemsPerPage = signal(10);

  // Resource for paginated heroes
  heroesResource = resource({
    params: (): HeroesGridRequest => ({
      page: this.currentPage(),
      size: this.itemsPerPage(),
    }),
    loader: async ({ params }) => {
      return await firstValueFrom(this.heroesService.getHeroPaginated(params.page, params.size));
    },
  });

  constructor() {
    effect(() => {
      this.heroesUtilsService.refreshHeroesGrid();
      this.heroesResource.reload();
    });
  }

  handlePageEvent(e: PageEvent) {
    this.currentPage.set(e.pageIndex + 1);
    this.itemsPerPage.set(e.pageSize);
  }

  refreshHeroes() {
    this.heroesResource.reload();
  }
}
