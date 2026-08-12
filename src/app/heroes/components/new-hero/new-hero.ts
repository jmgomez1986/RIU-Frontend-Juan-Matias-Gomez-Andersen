import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { HeroesService } from '../../../services/heroes';
import { Hero } from '../../../interfaces/heroes.interface';
import {
  CustomUploadImage,
  CustomUploadImageSelection,
} from '../../../components/custom-upload-image';
import { Observable } from 'rxjs';
import { HeroesUtilsService } from '../../../services/heroe-utils';

interface HeroeCategory {
  value: string;
  viewValue: string;
}

// Se crea este error matcher sacado de la documentacion, porque solo se mostraba uno de los mat-error,
// porque no evaluaba todos los casos (sirty, touche, submitted)
export class HeroErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = !!(form && form.submitted);
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-new-hero',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatChipsModule,
    MatIconModule,
    CustomUploadImage,
  ],
  templateUrl: './new-hero.html',
})
export default class NewHero {
  matcher = new HeroErrorStateMatcher();
  // Signals
  hero = input<Hero>();
  mode = signal<string>('create');
  // Services
  readonly heroesService = inject(HeroesService);
  readonly heroesUtilsService = inject(HeroesUtilsService);
  private router = inject(Router);

  heroForm: FormGroup = new FormGroup({});
  heroeCategories: HeroeCategory[] = [
    { value: 'Hero', viewValue: 'Héroe' },
    { value: 'Villain', viewValue: 'Villano' },
  ];
  readonly reactivePowersWords = signal<string[]>([]);

  constructor(private fb: FormBuilder) {
    // Se obtiene el valor de mode del state del roter
    const state = this.router.currentNavigation()?.extras?.state as { mode?: string } | null;
    this.mode.set(state?.mode ?? 'create');
    this.buildHeroForm();
    effect(() => {
      const heroData = this.hero();

      if (heroData) {
        this.heroForm.patchValue(heroData);
        this.reactivePowersWords.set(heroData.powers);
        if (this.mode() === 'view') {
          this.heroForm.disable();
        }
      }
    });
  }

  buildHeroForm() {
    this.heroForm = this.fb.group({
      name: ['', { validators: [Validators.required, Validators.maxLength(20)] }],
      alias: ['', { validators: [Validators.required, Validators.maxLength(20)] }],
      status: ['Active'],
      category: ['', { validators: [Validators.required, Validators.maxLength(10)] }],
      universe: ['', { validators: [Validators.required, Validators.maxLength(10)] }],
      team: ['', { validators: [Validators.required, Validators.maxLength(20)] }],
      description: ['', { validators: [Validators.required, Validators.maxLength(150)] }],
      powers: [],
      image: ['', { validators: [Validators.required] }],
    });
  }

  removeReactivePowers(newPower: string): void {
    // Creamos la nueva lista conservando todos los poderes menos el que se quiere eliminar
    // Se usa filter y no splice, para crear un arreglo nuevo, si no se cambiaria el arreglo
    // y el signal no lo detecta al cambio
    const powerFiltered = this.reactivePowersWords().filter((power) => power !== newPower);
    // Se setea el signal con la nueva lista de poderes
    this.reactivePowersWords.set(powerFiltered);
    // Se actualiza el formControl
    this.heroForm.get('powers')?.setValue(powerFiltered);
  }

  addReactivePowers(event: MatChipInputEvent): void {
    // Se eliminan espacios extras en el nuevo poder a agregar
    const value = (event.value || '').trim();
    // Agregamos el nuevo poder
    if (value) {
      this.addPower(value);
    }
    // Se limpia el input
    event.chipInput!.clear();
  }

  addPower(value: string): void {
    // Se agrega el nuevo poder a la lista
    const newPowersList = [...this.reactivePowersWords(), value];
    // Se setea el signal con la nueva lista de poderes
    this.reactivePowersWords.set(newPowersList);
    // Se actualiza el formControl
    this.heroForm.get('powers')?.setValue(newPowersList);
  }

  onSubmit(): void {
    if (this.heroForm.valid) {
      Swal.fire({
        title: `¿Está seguro que desea guardar los cambios realizados?`,
        text:
          this.mode() === 'create'
            ? 'Se creará un nuevo Héroe con los datos cargados.'
            : 'Se guardaran los cambios realizados.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${this.mode() === 'create' ? 'Crear' : 'Editar'}`,
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          const newHero: Hero = { ...this.heroForm.value };
          const heroId = this.hero()?.id ?? '';
          const heroesServiceObservable$: Observable<any> =
            this.mode() === 'create'
              ? this.heroesService.addNewHero(newHero)
              : this.heroesService.editHero(heroId, newHero);
          heroesServiceObservable$.subscribe({
            next: (resp) => {
              Swal.fire({
                title: 'Se guardó con éxito',
                text:
                  this.mode() === 'create'
                    ? 'Tú nuevo Héroe ha sido creado.'
                    : 'El Héeroe ha sido editado',
                icon: 'success',
              });
              this.heroesUtilsService.refreshLoad();
              this.router.navigate(['/heroes']);
            },
            error: (err) => {
              console.error(
                `No se pudo ${this.mode() === 'create' ? 'guardar' : 'editar'} el héroe:`,
                err,
              );
              Swal.fire({
                title: 'Error',
                text: `No se pudo ${this.mode() === 'create' ? 'guardar' : 'editar'} el héroe. Intente nuevamente.`,
                icon: 'error',
              });
            },
          });
        }
      });
    }
  }

  cancelSubmit() {
    this.router.navigate(['/heroes']);
  }

  /** Se ejecuta cuando el componente de carga de imagen emite una selección. */
  onImageChanged(selection: CustomUploadImageSelection): void {
    this.heroForm.get('image')?.setValue(selection.base64 ?? '');
  }
}
