import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { HeroErrorStateMatcher } from '../../shared/error-state-matcher';
import { HeroesUtilsService } from '../../services/heroes-utils';

@Component({
  selector: 'app-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters implements OnInit {
  matcher = new HeroErrorStateMatcher();
  // Largo máximo de los filtros de texto.
  readonly FILTER_MAX_LENGTH = 20;
  // Inyeccion de la referencia de destruccion para la desubcripcion
  private destroyRef = inject(DestroyRef);
  private readonly heroesUtilsService = inject(HeroesUtilsService);
  // FormControl para el filtrado por nombre. El debounce (en ngOnInit) evita
  // llamadas redundantes mientras se escribe; no hay mínimo de caracteres.
  readonly nameFilter = new FormControl('', [Validators.maxLength(this.FILTER_MAX_LENGTH)]);
  readonly aliasFilter = new FormControl('', [Validators.maxLength(this.FILTER_MAX_LENGTH)]);

  // Emite hacia el padre el query ya normalizado (trim + >= 3 caracteres o vacio)
  nameFilterApplied = output<string>();
  aliasFilterApplied = output<string>();

  /**
   * Limita la escritura de los inputs a maxLength + 1 caracteres. Al superar el máximo,
   * el validador maxLength invalida el control y la búsqueda no se emite
   * (ver HeroesUtilsService.enforceMaxLength).
   */
  onTextInput(event: Event, control: AbstractControl): void {
    this.heroesUtilsService.enforceMaxLength(event, control, this.FILTER_MAX_LENGTH);
  }

  ngOnInit(): void {
    this.nameFilter.valueChanges
      .pipe(
        debounceTime(1000),
        map((value) => value?.trim() ?? ''),
        // Se emite el query normalizado siempre que el control sea válido.
        filter(() => this.nameFilter.valid),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => {
        this.nameFilterApplied.emit(query);
      });

    this.aliasFilter.valueChanges
      .pipe(
        debounceTime(1000),
        map((value) => value?.trim() ?? ''),
        // Se emite el query normalizado siempre que el control sea válido
        filter(() => this.aliasFilter.valid),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => {
        this.aliasFilterApplied.emit(query);
      });
  }
}
