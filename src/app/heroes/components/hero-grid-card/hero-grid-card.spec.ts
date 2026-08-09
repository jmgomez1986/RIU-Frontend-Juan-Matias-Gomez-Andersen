import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroGridCard } from './hero-grid-card';

describe('HeroGridCard', () => {
  let component: HeroGridCard;
  let fixture: ComponentFixture<HeroGridCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroGridCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroGridCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
