import { Component, input } from '@angular/core';
import NewHero from '../../heroes/components/new-hero/new-hero';
import { Mode } from '../../interfaces/shared.interface';

@Component({
  selector: 'app-new-hero-page',
  imports: [NewHero],
  templateUrl: './new-hero-page.html',
})
export default class NewHeroPage {
  mode = input<Mode>('create');
}
