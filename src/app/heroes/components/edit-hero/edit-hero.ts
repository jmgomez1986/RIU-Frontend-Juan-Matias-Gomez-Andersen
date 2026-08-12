import { Component, effect, input } from '@angular/core';
import NewHero from '../new-hero/new-hero';
import { Hero } from '../../../interfaces/heroes.interface';

@Component({
  selector: 'app-edit-hero',
  imports: [NewHero],
  templateUrl: './edit-hero.html',
})
export default class EditHero {
  hero = input<Hero>();
}
