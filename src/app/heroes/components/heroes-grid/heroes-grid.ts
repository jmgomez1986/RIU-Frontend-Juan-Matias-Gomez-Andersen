import { Component, DestroyRef, inject, resource, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { firstValueFrom } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HeroesGridResourceParams } from '../../../interfaces/heroes.interface';
import { HeroesService } from '../../../services/heroes';
import { HeroGridCard } from '../hero-grid-card/hero-grid-card';
import { HeroesUtilsService } from '../../../services/heroe-utils';
import { Filters } from '../../../components/filters/filters';

@Component({
  selector: 'app-heroes-grid',
  imports: [
    HeroGridCard,
    Filters,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './heroes-grid.html',
})
export class HeroesGrid {
  // Services
  readonly heroesService = inject(HeroesService);
  readonly heroesUtilsService = inject(HeroesUtilsService);
  // Signals for pagination state
  currentPage = signal(1);
  itemsPerPage = signal(10);
  // Signals for filters
  searchName = signal('');
  searchAlias = signal('');

  // Resource for paginated heroes
  heroesResource = resource({
    params: (): HeroesGridResourceParams => ({
      page: this.currentPage(),
      size: this.itemsPerPage(),
      query: {
        name: this.searchName(),
        alias: this.searchAlias(),
      },
      refreshKey: this.heroesUtilsService.refreshHeroesGrid(),
    }),
    loader: async ({ params }) => {
      return await firstValueFrom(
        this.heroesService.getHeroPaginated(params.page, params.size, params.query),
      );
    },
  });

  handlePageEvent(e: PageEvent) {
    this.currentPage.set(e.pageIndex + 1);
    this.itemsPerPage.set(e.pageSize);
  }

  applyNameFilter(query: string) {
    // Al filtrar desde una pagina avanzada, volvemos a la primera
    this.currentPage.set(1);
    this.searchName.set(query);
  }

  applyAliasFilter(query: string) {
    this.currentPage.set(1);
    this.searchAlias.set(query);
  }

  refreshHeroes() {
    this.heroesResource.reload();
  }
}
