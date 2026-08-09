import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroesGrid } from './heroes/components/heroes-grid/heroes-grid';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeroesGrid],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('mindata-challenge');
}
