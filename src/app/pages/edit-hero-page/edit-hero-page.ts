import { Component, inject, input, resource, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeroesService } from '../../services/heroes';
import { firstValueFrom } from 'rxjs';
import EditHero from '../../heroes/components/edit-hero/edit-hero';

@Component({
  selector: 'app-edit-hero-page',
  imports: [EditHero],
  templateUrl: './edit-hero-page.html',
})
export default class EditHeroPage {
  heroId = input.required<string>();
  mode = signal<string>('edit');
  // Services
  readonly heroesService = inject(HeroesService);
  private router = inject(Router);

  heroeResource = resource({
    params: (): any => ({
      heroId: this.heroId(),
    }),
    loader: async () => {
      return await firstValueFrom(this.heroesService.getHeroById(this.heroId()));
    },
  });

  constructor() {
    // Se obtiene el valor de mode del state del roter
    const state = this.router.currentNavigation()?.extras?.state as { mode?: string } | null;
    this.mode.set(state?.mode ?? 'edit');
    console.log({ Mode: this.mode() });
  }
}
