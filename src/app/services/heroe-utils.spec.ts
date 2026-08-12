import { TestBed } from '@angular/core/testing';

import { HeroesUtilsService } from './heroe-utils';

describe('HeroeUtils', () => {
  let service: HeroesUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroesUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should increment refreshHeroesGrid on each refreshLoad call', () => {
    const before = service.refreshHeroesGrid();

    service.refreshLoad();
    service.refreshLoad();

    expect(service.refreshHeroesGrid()).toBe(before + 2);
  });
});
