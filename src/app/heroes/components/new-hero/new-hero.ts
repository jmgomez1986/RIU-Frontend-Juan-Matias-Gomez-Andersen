import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { HeroesService } from '../../../services/heroes';
import { Hero } from '../../../interfaces/heroes.interface';
import { Router } from '@angular/router';

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
  ],
  templateUrl: './new-hero.html',
  styleUrl: './new-hero.scss',
})
export default class NewHero {
  matcher = new HeroErrorStateMatcher();
  // Services
  readonly heroesService = inject(HeroesService);
  private router = inject(Router);

  heroForm: FormGroup = new FormGroup({});
  heroeCategories: HeroeCategory[] = [
    { value: 'Hero', viewValue: 'Héroe' },
    { value: 'Villain', viewValue: 'Villano' },
  ];
  readonly reactivePowersWords = signal<string[]>([]);

  constructor(private fb: FormBuilder) {
    this.buildHeroForm();
  }

  buildHeroForm() {
    this.heroForm = this.fb.group({
      name: ['', { validators: [Validators.required, Validators.maxLength(20)] }],
      alias: ['', { validators: [Validators.required, Validators.maxLength(20)] }],
      status: ['1'],
      category: ['', { validators: [Validators.required, Validators.maxLength(10)] }],
      universe: ['', { validators: [Validators.required, Validators.maxLength(10)] }],
      team: ['', { validators: [Validators.required, Validators.maxLength(20)] }],
      description: ['', { validators: [Validators.required, Validators.maxLength(60)] }],
      powers: [],
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
      console.log('Form Submitted Data:', this.heroForm.value);
      const newHero: Hero = { ...this.heroForm.value };
      this.heroesService.addNewHero(newHero).subscribe((resp) => {
        console.log({ resp });
        this.router.navigate(['/heroes']);
      });
    }
  }

  cancelSubmit() {
    this.router.navigate(['/heroes']);
  }
}
