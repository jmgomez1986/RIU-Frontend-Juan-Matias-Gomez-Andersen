import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HeroesGrid } from './heroes-grid';
import { HeroesService } from '../../../services/heroes';
import { HeroesResponsePaginated } from '../../../interfaces/heroes.interface';

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

describe('HeroesGrid', () => {
  let component: HeroesGrid;
  let fixture: ComponentFixture<HeroesGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesGrid],
      providers: [
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
});
