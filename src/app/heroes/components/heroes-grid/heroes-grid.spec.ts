import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { HeroesGrid } from './heroes-grid';
import { HeroesService } from '../../../services/heroes';
import { Hero, HeroesResponsePaginated } from '../../../interfaces/heroes.interface';
import { provideRouter } from '@angular/router';

// Se mockea `HeroesService.getHeroesPaginated` con un observable que emite al instante,
// para que el resource se complete y `whenStable()` resuelva sin tocar HTTP.
const makeHero = (id: string, name: string, alias = 'Superman'): Hero => ({
  id,
  name,
  alias,
  powers: ['Vuelo'],
  description: 'Descripción de prueba',
  team: 'Liga de la Justicia',
  image: 'superman.jpg',
  status: 'Active',
  category: 'Heroe',
  universe: 'DC',
});

const makePaginatedResponse = (data: Hero[]): HeroesResponsePaginated => ({
  first: 1,
  prev: null,
  next: null,
  last: 1,
  pages: data.length > 0 ? 1 : 0,
  items: data.length,
  data,
});

describe('HeroesGrid', () => {
  let component: HeroesGrid;
  let fixture: ComponentFixture<HeroesGrid>;
  let paginatedResponse: HeroesResponsePaginated;
  let getHeroesPaginatedMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    paginatedResponse = makePaginatedResponse([makeHero('1', 'Clark Kent')]);
    getHeroesPaginatedMock = vi.fn();
    // Por defecto responde igual que antes, sin importar la página pedida.
    getHeroesPaginatedMock.mockImplementation(() => of(paginatedResponse));

    await TestBed.configureTestingModule({
      imports: [HeroesGrid],
      providers: [
        provideRouter([]),
        {
          provide: HeroesService,
          useValue: { getHeroesPaginated: getHeroesPaginatedMock },
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
    paginatedResponse = makePaginatedResponse([
      makeHero('1', 'Clark Kent'),
      makeHero('2', 'Bruce Wayne'),
    ]);

    component.heroesResource.reload();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('app-hero-grid-card')).length).toBe(2);
    expect(fixture.nativeElement.textContent).not.toContain('No se encontraron resultados.');
  });

  it('mustra el mensaje de estado vacío cuando no hay resultados', async () => {
    paginatedResponse = makePaginatedResponse([]);

    component.heroesResource.reload();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('app-hero-grid-card')).length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('No se encontraron resultados.');
  });

  it('should call refreshHeroes when a card emits heroDeleted', async () => {
    const refreshSpy = vi.spyOn(component, 'refreshHeroes');

    component.heroesResource.reload();
    await fixture.whenStable();
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('app-hero-grid-card'));
    expect(card).toBeTruthy();
    card.componentInstance.heroDeleted.emit();

    expect(refreshSpy).toHaveBeenCalled();
  });

  it('al borrar el último elemento de la última página, retrocede a una página con datos', async () => {
    // Dataset: 10 héroes = 1 página completa (itemsPerPage = 10). Tras el borrado,
    // la página 2 queda fuera de rango: data vacía pero items > 0.
    const heroes = Array.from({ length: 10 }, (_, i) => makeHero(String(i + 1), `Héroe ${i + 1}`));
    const page1Response = makePaginatedResponse(heroes);
    const page2OutOfRange: HeroesResponsePaginated = {
      ...makePaginatedResponse([]),
      items: 10,
      pages: 1,
    };

    // Mock consciente de la página pedida: la 2 responde vacía, la 1 con los datos.
    getHeroesPaginatedMock.mockImplementation((page: number) =>
      of(page > 1 ? page2OutOfRange : page1Response),
    );

    // El usuario está en la página 2 y borra el último elemento de esa página:
    component.currentPage.set(2);
    component.refreshHeroes();

    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // El efecto detecta la página fuera de rango y vuelve a la última con datos.
    expect(component.currentPage()).toBe(1);
    expect(fixture.debugElement.queryAll(By.css('app-hero-grid-card')).length).toBe(10);
    expect(fixture.nativeElement.textContent).not.toContain('No se encontraron resultados.');
  });

  it('applyNameFilter setea searchName y resetea currentPage a 1', () => {
    component.currentPage.set(3);
    component.searchName.set('otro');

    component.applyNameFilter('super');

    expect(component.searchName()).toBe('super');
    expect(component.currentPage()).toBe(1);
  });

  it('applyAliasFilter setea searchAlias y resetea currentPage a 1', () => {
    component.currentPage.set(2);
    component.searchAlias.set('otro');

    component.applyAliasFilter('cla');

    expect(component.searchAlias()).toBe('cla');
    expect(component.currentPage()).toBe(1);
  });
});
