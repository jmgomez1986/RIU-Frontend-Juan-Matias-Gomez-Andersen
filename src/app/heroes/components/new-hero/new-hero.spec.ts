import { ComponentFixture, TestBed } from '@angular/core/testing';

import NewHero from './new-hero';

describe('NewHero', () => {
  let component: NewHero;
  let fixture: ComponentFixture<NewHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHero],
    }).compileComponents();

    fixture = TestBed.createComponent(NewHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
