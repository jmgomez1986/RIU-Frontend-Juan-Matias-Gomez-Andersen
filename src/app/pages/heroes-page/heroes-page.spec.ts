import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesPage } from './heroes-page';

describe('HeroesPage', () => {
  let component: HeroesPage;
  let fixture: ComponentFixture<HeroesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
