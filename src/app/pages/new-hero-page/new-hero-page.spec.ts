import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHeroPage } from './new-hero-page';

describe('NewHeroPage', () => {
  let component: NewHeroPage;
  let fixture: ComponentFixture<NewHeroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHeroPage],
    }).compileComponents();

    fixture = TestBed.createComponent(NewHeroPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
