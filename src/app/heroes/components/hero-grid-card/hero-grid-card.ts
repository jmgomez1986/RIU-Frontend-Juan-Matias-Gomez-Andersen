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

  deleteHero(heroId: string) {
    console.log({ heroId });

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
        this.heroesService.deleteHero(heroId).subscribe({
          next: (resp) => {
            console.log({ resp });
            Swal.fire({
              title: 'Se eliminó el héroe con éxito',
              text: 'Tú nuevo Héroe ha sido creado.',
              icon: 'success',
            });
            this.router.navigate(['/heroes']);
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
}
