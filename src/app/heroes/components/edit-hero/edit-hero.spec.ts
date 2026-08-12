import { ComponentFixture, TestBed } from '@angular/core/testing';

import EditHero from './edit-hero';

describe('EditHero', () => {
  let component: EditHero;
  let fixture: ComponentFixture<EditHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHero],
    }).compileComponents();

    fixture = TestBed.createComponent(EditHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
