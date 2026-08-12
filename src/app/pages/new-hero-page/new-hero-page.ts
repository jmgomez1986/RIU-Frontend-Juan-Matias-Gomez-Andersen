import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import NewHero from '../../heroes/components/new-hero/new-hero';

@Component({
  selector: 'app-new-hero-page',
  imports: [NewHero],
  templateUrl: './new-hero-page.html',
})
export default class NewHeroPage {}
