import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HeroesGrid } from '../../heroes/components/heroes-grid/heroes-grid';

@Component({
  selector: 'app-heroes-page',
  imports: [HeroesGrid, MatButtonModule, RouterOutlet],
  templateUrl: './heroes-page.html',
})

// Para que funcione el import del lazyLoading en el ruteo, la clase hay que exportrla por 'default'
export default class HeroesPage {
  private router = inject(Router);

  navigateToNewHero() {
    this.router.navigate(['/new-hero']);
  }
}
