import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HeroesService } from './heroes';
import { Hero, HeroesResponsePaginated } from '../interfaces/heroes.interface';

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
});
