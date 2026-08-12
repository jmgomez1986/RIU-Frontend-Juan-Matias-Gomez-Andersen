import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { HeroesGrid } from './heroes-grid';
import { HeroesService } from '../../../services/heroes';
import { Hero, HeroesResponsePaginated } from '../../../interfaces/heroes.interface';
import { provideRouter } from '@angular/router';

// Se mockea `HeroesService` por un fake que devuelve un observable __que emite al instante__.
// Entonces hace que el resource se complete, la tarea pendiente se libera y `whenStable()` resuelve.
// No de depende de "timing" del arranque del resource. Si hacer esto, se daba un timeout ya que
// quedaba una tarea HTTP en espera. Ya no hace falta `provideHttpClientTesting()` porque
// ni siquiera se toca HTTP.
const fakePaginatedResponse: HeroesResponsePaginated = {
  first: 1,
  prev: 1,
  next: 2,
  last: 1,
  pages: 1,
  items: 0,
  data: [],
};

const fakeHero: Hero = {
  id: '1',
  name: 'Clark Kent',
  alias: 'Superman',
  powers: ['Vuelo'],
  description: 'Descripción de prueba',
  team: 'Liga de la Justicia',
  image: 'superman.jpg',
  status: 'Active',
  category: 'Heroe',
  universe: 'DC',
};

describe('HeroesGrid', () => {
  let component: HeroesGrid;
  let fixture: ComponentFixture<HeroesGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesGrid],
      providers: [
        provideRouter([]),
        {
          provide: HeroesService,
          useValue: { getHeroPaginated: () => of(fakePaginatedResponse) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reload the heroes resource when refreshHeroes is called', () => {
    const reloadSpy = vi.spyOn(component.heroesResource, 'reload');

    component.refreshHeroes();

    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it('should render a hero card for each hero when the resource has data', async () => {
    fakePaginatedResponse.data = [fakeHero];

    component.heroesResource.reload();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('app-hero-grid-card')).length).toBe(1);
    expect(fixture.nativeElement.textContent).not.toContain('No se encontraron resultados.');
  });

  it('should call refreshHeroes when a card emits heroDeleted', async () => {
    fakePaginatedResponse.data = [fakeHero];

    component.heroesResource.reload();
    await fixture.whenStable();
    fixture.detectChanges();

    const refreshSpy = vi.spyOn(component, 'refreshHeroes');

    const card = fixture.debugElement.query(By.css('app-hero-grid-card'));
    expect(card).toBeTruthy();
    card.componentInstance.heroDeleted.emit();

    expect(refreshSpy).toHaveBeenCalled();
  });
});
