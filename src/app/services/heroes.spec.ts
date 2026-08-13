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
  it('should make a GET request with _page and _per_page and return the paginated response', () => {
    const mockResponse: HeroesResponsePaginated = {
      first: 1,
      prev: null,
      next: null,
      last: 2,
      pages: 2,
      items: 1,
      data: [mockHero],
    };

    let result: HeroesResponsePaginated | undefined;
    service.getHeroPaginated(1, 10).subscribe((resp) => (result = resp));

    const req = httpTesting.expectOne('/api/heroes?_page=1&_per_page=10');
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);

    expect(result).toEqual({
      ...mockResponse,
      data: [{ ...mockHero, image: 'images/superman.jpg' }],
    });
  });
  it('should make a GET request hero by id and response a Hero', () => {
    // Lo declaro con Partial, porque la respuesta es la misma, pero sin el atributo id
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
  it('should resolve image when image is a base64', () => {
    const heroWithImageBase64: Hero = { ...mockHero, image: 'data:' };
    const mockResponse: HeroesResponsePaginated = {
      first: 1,
      prev: null,
      next: null,
      last: 2,
      pages: 2,
      items: 1,
      data: [heroWithImageBase64],
    };

    let result: HeroesResponsePaginated | undefined;
    service.getHeroPaginated(1, 10).subscribe((resp) => (result = resp));

    const req = httpTesting.expectOne('/api/heroes?_page=1&_per_page=10');
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
  it('should send name:contains and alias:contains when query is provided and omit it when empty', () => {
    const mockResponse: HeroesResponsePaginated = {
      first: 1,
      prev: null,
      next: null,
      last: 1,
      pages: 1,
      items: 1,
      data: [mockHero],
    };

    let resultWithQuery: HeroesResponsePaginated | undefined;
    service
      .getHeroPaginated(1, 10, { name: 'super', alias: 'superman' })
      .subscribe((resp) => (resultWithQuery = resp));
    const reqWithQuery = httpTesting.expectOne(
      '/api/heroes?name:contains=super&alias:contains=superman&_page=1&_per_page=10',
    );
    expect(reqWithQuery.request.method).toBe('GET');
    reqWithQuery.flush(mockResponse);
    expect(resultWithQuery?.data).toHaveLength(1);

    let resultEmpty: HeroesResponsePaginated | undefined;
    service.getHeroPaginated(1, 10).subscribe((resp) => (resultEmpty = resp));
    const reqEmpty = httpTesting.expectOne('/api/heroes?_page=1&_per_page=10');
    expect(reqEmpty.request.method).toBe('GET');
    reqEmpty.flush(mockResponse);
    expect(resultEmpty?.data).toHaveLength(1);
  });
});
