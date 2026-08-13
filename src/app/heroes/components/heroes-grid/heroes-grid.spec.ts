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

  describe('ngOnInit valueChanges (filtros de busqueda)', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('name: no actualiza si el control es valido pero el query queda 1-2 chars tras el trim', async () => {
      vi.useFakeTimers();
      component.currentPage.set(2);
      component.searchName.set('previo');

      component.nameFilter.setValue(' ab ');
      await vi.advanceTimersByTimeAsync(1000);

      expect(component.searchName()).toBe('previo');
      expect(component.currentPage()).toBe(2);
    });

    it('name: actualiza con trim y resetea currentPage a 1 cuando hay >= 3 chars', async () => {
      vi.useFakeTimers();
      component.currentPage.set(3);
      component.searchName.set('otro');

      component.nameFilter.setValue('  super  ');
      await vi.advanceTimersByTimeAsync(1000);

      expect(component.searchName()).toBe('super');
      expect(component.currentPage()).toBe(1);
    });

    it('name: no actualiza cuando el form control es invalido (< 3 chars)', async () => {
      vi.useFakeTimers();
      component.currentPage.set(2);
      component.searchName.set('previo');

      component.nameFilter.setValue('ab');
      expect(component.nameFilter.invalid).toBe(true);
      await vi.advanceTimersByTimeAsync(1000);

      expect(component.searchName()).toBe('previo');
      expect(component.currentPage()).toBe(2);
    });

    it('alias: no actualiza si el control es valido pero el query queda 1-2 chars tras el trim', async () => {
      vi.useFakeTimers();
      component.currentPage.set(2);
      component.searchAlias.set('previo');

      component.aliasFilter.setValue(' ab ');
      await vi.advanceTimersByTimeAsync(1000);

      expect(component.searchAlias()).toBe('previo');
      expect(component.currentPage()).toBe(2);
    });

    it('alias: actualiza con trim y resetea currentPage a 1 cuando hay >= 3 chars', async () => {
      vi.useFakeTimers();
      component.currentPage.set(3);
      component.searchAlias.set('otro');

      component.aliasFilter.setValue('  super  ');
      await vi.advanceTimersByTimeAsync(1000);

      expect(component.searchAlias()).toBe('super');
      expect(component.currentPage()).toBe(1);
    });

    it('alias: no actualiza cuando el form control es invalido (< 3 chars)', async () => {
      vi.useFakeTimers();
      component.currentPage.set(2);
      component.searchAlias.set('previo');

      component.aliasFilter.setValue('ab');
      expect(component.aliasFilter.invalid).toBe(true);
      await vi.advanceTimersByTimeAsync(1000);

      expect(component.searchAlias()).toBe('previo');
      expect(component.currentPage()).toBe(2);
    });
  });
});
