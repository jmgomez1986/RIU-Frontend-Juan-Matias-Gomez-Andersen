import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { Hero } from '../../../interfaces/heroes.interface';
import { HeroesService } from '../../../services/heroes';

@Component({
  selector: 'app-hero-grid-card',
  imports: [MatCardModule, MatButtonModule, MatChipsModule],
  templateUrl: './hero-grid-card.html',
})
export class HeroGridCard {
  hero = input.required<Hero>();
  heroDeleted = output<void>();
  // Services
  readonly heroesService = inject(HeroesService);
  private router = inject(Router);

  deleteHero() {
    console.log({ heroId: this.hero().id });

    Swal.fire({
      title: '¿Está seguro que desea eliminar el héroe',
      text: 'Se eliminará de la base de datos el héroe elegido',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.heroesService.deleteHero(this.hero().id).subscribe({
          next: (resp) => {
            console.log({ resp });
            Swal.fire({
              title: 'Se eliminó el héroe con éxito',
              text: 'Tú nuevo Héroe ha sido creado.',
              icon: 'success',
            });
            this.heroDeleted.emit();
          },
          error: (err) => {
            console.error('No se pudo eliminar el héroe:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el héroe. Intente nuevamente.',
              icon: 'error',
            });
          },
        });
      }
    });
  }

  editHero() {
    this.router.navigate([`/edit-hero/${this.hero().id}`], { state: { mode: 'edit' } });
  }
  viewHero() {
    this.router.navigate([`/view-hero/${this.hero().id}`], { state: { mode: 'view' } });
  }
}
