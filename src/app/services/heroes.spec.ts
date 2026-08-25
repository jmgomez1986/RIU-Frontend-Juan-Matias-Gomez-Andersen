import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HeroesService } from './heroes';
import { Hero, HeroesResponsePaginated, NewHeroResponse } from '../interfaces/heroes.interface';

const mockHero: Hero = {
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

const makeHero = (id: string, name: string): Hero => ({
  ...mockHero,
  id,
  name,
});

describe('Heroes', () => {
  let service: HeroesService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(HeroesService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Asegura que ningún request quedó sin responder
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request to /api/heroes and return heroes with prefixed image URLs added', () => {
    let result: Hero[] | undefined;
    service.getHeroes().subscribe((heroes) => (result = heroes));

    const req = httpTesting.expectOne('/api/heroes');
    expect(req.request.method).toBe('GET');

    req.flush([mockHero]);

    expect(result).toEqual([{ ...mockHero, image: 'images/superman.jpg' }]);
  });

  describe('getHeroesPaginated', () => {
    const heroes = [
      makeHero('1', 'Spiderman'),
      makeHero('2', 'Superman'),
      makeHero('3', 'Manolito el fuerte'),
      makeHero('4', 'Bruce Wayne'),
    ];

    it('devuelve solo héroes cuyo nombre contiene el criterio (parcial, case-insensitive y trim)', () => {
      let result: HeroesResponsePaginated | undefined;
      service.getHeroesPaginated(1, 10, { name: '  MAN ' }).subscribe((r) => (result = r));

      const req = httpTesting.expectOne('/api/heroes');
      expect(req.request.method).toBe('GET');
      req.flush(heroes);

      expect(result?.items).toBe(3);
      expect(result?.pages).toBe(1);
      expect(result?.data.map((h) => h.name)).toEqual([
        'Spiderman',
        'Superman',
        'Manolito el fuerte',
      ]);
      expect(result?.next).toBeNull();
    });

    it('devuelve una lista vacía cuando no hay coincidencias', () => {
      let result: HeroesResponsePaginated | undefined;
      service.getHeroesPaginated(1, 10, { name: 'thor' }).subscribe((r) => (result = r));

      const req = httpTesting.expectOne('/api/heroes');
      req.flush([makeHero('1', 'Spiderman')]);

      expect(result?.items).toBe(0);
      expect(result?.data).toEqual([]);
      expect(result?.pages).toBe(0);
    });

    it('devuelve todos los héroes cuando la query está vacía o es solo espacios', () => {
      const allHeroes = [makeHero('1', 'Spiderman'), makeHero('2', 'Superman')];

      let result: HeroesResponsePaginated | undefined;
      service.getHeroesPaginated(1, 10, { name: '   ' }).subscribe((r) => (result = r));

      const req = httpTesting.expectOne('/api/heroes');
      req.flush(allHeroes);

      expect(result?.items).toBe(2);
      expect(result?.data.map((h) => h.id)).toEqual(['1', '2']);
    });

    it('resuelve las URLs de imagen en los resultados', () => {
      let result: HeroesResponsePaginated | undefined;
      service.getHeroesPaginated(1, 10, { name: 'spider' }).subscribe((r) => (result = r));
      const req = httpTesting.expectOne('/api/heroes');
      req.flush([makeHero('1', 'Spiderman')]);

      expect(result?.data).toEqual([
        { ...makeHero('1', 'Spiderman'), image: 'images/superman.jpg' },
      ]);
    });

    it('pagina el resultado y expone first/prev/next/last/pages', () => {
      let result: HeroesResponsePaginated | undefined;
      service.getHeroesPaginated(1, 2).subscribe((r) => (result = r));

      const req = httpTesting.expectOne('/api/heroes');
      req.flush(heroes);

      expect(result?.data.map((h) => h.id)).toEqual(['1', '2']);
      expect(result?.items).toBe(4);
      expect(result?.pages).toBe(2);
      expect(result?.first).toBe(1);
      expect(result?.prev).toBeNull();
      expect(result?.next).toBe(2);
      expect(result?.last).toBe(2);
    });

    it('aplica también el filtro por alias (coincidencia parcial)', () => {
      const heroesWithAlias = [
        { ...makeHero('1', 'Clark Kent'), alias: 'Superman' },
        { ...makeHero('2', 'Bruce Wayne'), alias: 'Batman' },
        { ...makeHero('3', 'Diana Prince'), alias: 'Wonder Woman' },
      ];

      let result: HeroesResponsePaginated | undefined;
      service.getHeroesPaginated(1, 10, { alias: 'woman' }).subscribe((r) => (result = r));

      const req = httpTesting.expectOne('/api/heroes');
      req.flush(heroesWithAlias);

      expect(result?.items).toBe(1);
      expect(result?.data.map((h) => h.alias)).toEqual(['Wonder Woman']);
    });
  });

  it('should make a GET request hero by id and response a Hero', () => {
    const mockResponse: Partial<Hero> = {
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

    let result: Hero | undefined;
    service.getHeroById('1').subscribe((resp) => (result = resp));

    const req = httpTesting.expectOne('/api/heroes/1');
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);

    expect(result).toEqual({
      ...mockResponse,
    });
  });
  it('should call add new hero request', () => {
    const mockHeroBody: Partial<Hero> = {
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
    const mockHeroResponse: NewHeroResponse = {
      res: mockHero,
    };

    let result: NewHeroResponse | undefined;
    service.addNewHero(mockHero).subscribe((resp) => (result = resp));

    const req = httpTesting.expectOne('/api/heroes');
    expect(req.request.method).toBe('POST');

    req.flush(mockHeroResponse);

    expect(result).toEqual({
      ...mockHeroResponse,
    });
  });
  it('should call endponit for edit a hero', () => {
    const mockResponse: Hero = mockHero;

    let result: Hero | undefined;
    service.editHero('1', mockHero).subscribe((resp) => (result = resp));

    const req = httpTesting.expectOne('/api/heroes/1');
    expect(req.request.method).toBe('PUT');

    req.flush(mockResponse);

    expect(result).toEqual({
      ...mockResponse,
    });
  });
  it('should call endpont for delete a hero', () => {
    const mockResponse: Hero = mockHero;

    let result: Hero | undefined;
    service.deleteHero('1').subscribe((resp) => (result = resp));

    const req = httpTesting.expectOne('/api/heroes/1');
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);

    expect(result).toEqual({
      ...mockResponse,
    });
  });
});
