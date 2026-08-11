import { Component, inject, signal } from '@angular/core';
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
  // Previsualización de la imagen seleccionada (data URL generada con FileReader)
  readonly imagePreview = signal<string | null>(null);
  // Nombre del archivo seleccionado (nombre.extension)
  readonly imageFileName = signal<string | null>(null);
  // Control "solo lectura" del campo imagen: muestra el nombre y maneja los errores de validación.
  // Se crea deshabilitado para que no se pueda escribir (solo lo setea onFileSelect).
  readonly imageNameControl = new FormControl<string>({ value: '', disabled: true });

  /** Formatos de imagen permitidos (JPG, JPEG y PNG). */
  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
  /** Tamaño máximo de la imagen original: 1 MB. */
  private readonly MAX_IMAGE_SIZE = 1 * 1024 * 1024;

  constructor(private fb: FormBuilder) {
    this.buildHeroForm();
  }

  buildHeroForm() {
    this.heroForm = this.fb.group({
      name: ['', { validators: [Validators.required, Validators.maxLength(20)] }],
      alias: ['', { validators: [Validators.required, Validators.maxLength(20)] }],
      status: ['Active'],
      category: ['', { validators: [Validators.required, Validators.maxLength(10)] }],
      universe: ['', { validators: [Validators.required, Validators.maxLength(10)] }],
      team: ['', { validators: [Validators.required, Validators.maxLength(20)] }],
      description: ['', { validators: [Validators.required, Validators.maxLength(60)] }],
      powers: [],
      image: [''],
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

      Swal.fire({
        title: '¿Está seguro que desea guardar los cambios?',
        text: 'Se creará un nuevo Héroe con los datos cargados.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          const newHero: Hero = { ...this.heroForm.value };
          this.heroesService.addNewHero(newHero).subscribe({
            next: (resp) => {
              console.log({ resp });
              Swal.fire({
                title: 'Se guardó con éxito',
                text: 'Tú nuevo Héroe ha sido creado.',
                icon: 'success',
              });
              this.router.navigate(['/heroes']);
            },
            error: (err) => {
              console.error('No se pudo guardar el héroe:', err);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo guardar el héroe. Intente nuevamente.',
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

  onFileSelect(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];

    // Si se canceló el cuadro de diálogo no hay archivo que procesar
    if (!file) {
      return;
    }

    // Validación de formato: solo JPG, JPEG y PNG
    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      console.warn('Formato de imagen no permitido:', file.type);
      element.value = '';
      this.resetImage('invalidType');
      return;
    }

    // Validación de tamaño: máximo 1 MB
    if (file.size > this.MAX_IMAGE_SIZE) {
      console.warn(`La imagen supera el tamaño máximo de 1 MB (${file.size} bytes)`);
      element.value = '';
      this.resetImage('maxSize');
      return;
    }

    // Se guarda el nombre del archivo para mostrarlo en la UI
    this.imageFileName.set(file.name);
    this.imageNameControl.setValue(file.name);
    this.imageNameControl.setErrors(null);
    this.imageNameControl.markAsTouched();

    // Se limpia el input para poder volver a seleccionar el mismo archivo
    element.value = '';

    // Se lee la imagen tal cual con FileReader y se guarda el base64 en el formControl
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.imagePreview.set(dataUrl);
      // Se guarda la imagen completa en el formControl (base64, ej: "data:image/png;base64,...")
      this.heroForm.get('image')?.setValue(dataUrl);
    };
    reader.onerror = () => {
      console.error('No se pudo leer el archivo de imagen.');
      this.resetImage(null);
    };
    reader.readAsDataURL(file);
  }

  /**
   * Reinicia el estado de la imagen, opcionalmente marcando un error de validación.
   * @param errorType 'invalidType' (formato no permitido) | 'maxSize' (supera 1 MB) | null (sin error)
   */
  private resetImage(errorType: 'invalidType' | 'maxSize' | null): void {
    this.imageFileName.set(null);
    this.imageNameControl.setValue('');

    if (errorType) {
      this.imageNameControl.setErrors({ [errorType]: true });
      this.imageNameControl.markAsTouched();
    } else {
      this.imageNameControl.setErrors(null);
    }

    this.imagePreview.set(null);
    this.heroForm.get('image')?.setValue('');
  }
}
