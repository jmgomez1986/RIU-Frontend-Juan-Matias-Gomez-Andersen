import { Component } from '@angular/core';
import NewHero from '../../heroes/components/new-hero/new-hero';

@Component({
  selector: 'app-new-hero-page',
  imports: [NewHero],
  templateUrl: './new-hero-page.html',
})
export default class NewHeroPage {}
