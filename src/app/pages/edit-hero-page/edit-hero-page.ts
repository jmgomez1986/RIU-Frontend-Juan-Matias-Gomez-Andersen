import { Component, inject, input, resource } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  // Services
  readonly heroesService = inject(HeroesService);

  heroeResource = resource({
    params: (): any => ({
      heroId: this.heroId(),
    }),
    loader: async ({ params }) => {
      return await firstValueFrom(this.heroesService.getHeroById(this.heroId()));
    },
  });
}
