import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesGrid } from './heroes-grid';

describe('HeroesGrid', () => {
  let component: HeroesGrid;
  let fixture: ComponentFixture<HeroesGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
