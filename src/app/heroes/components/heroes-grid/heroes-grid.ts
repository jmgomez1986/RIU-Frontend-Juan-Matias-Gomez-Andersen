import { Component, DestroyRef, inject, OnInit, resource, signal } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { debounceTime, distinctUntilChanged, filter, firstValueFrom, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ErrorStateMatcher } from '@angular/material/core';
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

// Se crea este error matcher sacado de la documentacion, porque solo se mostraba uno de los mat-error,
// porque no evaluaba todos los casos (sirty, touche, submitted)
export class HeroErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = !!(form && form.submitted);
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-heroes-grid',
  imports: [
    HeroGridCard,
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
export class HeroesGrid implements OnInit {
  matcher = new HeroErrorStateMatcher();
  // Inyeccion de la referencia de destruccion para la desubcripcion
  private destroyRef = inject(DestroyRef);
  // FormControl para el filtrado por nombre. Minimo 3 caracteres para disparar la busqueda.
  readonly nameFilter = new FormControl('', [Validators.minLength(3), Validators.maxLength(20)]);
  readonly aliasFilter = new FormControl('', [Validators.minLength(3), Validators.maxLength(20)]);

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

  ngOnInit(): void {
    this.nameFilter.valueChanges
      .pipe(
        debounceTime(1000),
        map((value) => value?.trim() ?? ''),
        // Solo se hace la peticion si el form control es valido y el query tiene >= 3 caracteres
        // (o esta vacio, en cuyo caso se listan todos los heroes).
        filter((query) => this.nameFilter.valid && (query.length === 0 || query.length >= 3)),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => {
        // Al filtrar desde una pagina avanzada, volvemos a la primera
        this.currentPage.set(1);
        this.searchName.set(query);
      });

    this.aliasFilter.valueChanges
      .pipe(
        debounceTime(1000),
        map((value) => value?.trim() ?? ''),
        // Solo se hace la peticion si el form control es valido y el query tiene >= 3 caracteres
        // (o esta vacio, en cuyo caso se listan todos los heroes).
        filter((query) => this.aliasFilter.valid && (query.length === 0 || query.length >= 3)),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => {
        // Al filtrar desde una pagina avanzada, volvemos a la primera
        this.currentPage.set(1);
        this.searchAlias.set(query);
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
