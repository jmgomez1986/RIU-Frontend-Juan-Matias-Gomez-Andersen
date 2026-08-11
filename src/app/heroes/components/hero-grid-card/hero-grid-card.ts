import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { Hero } from '../../../interfaces/heroes.interface';

@Component({
  selector: 'app-hero-grid-card',
  imports: [MatCardModule, MatButtonModule, MatChipsModule],
  templateUrl: './hero-grid-card.html',
})
export class HeroGridCard {
  hero = input.required<Hero>();
}
