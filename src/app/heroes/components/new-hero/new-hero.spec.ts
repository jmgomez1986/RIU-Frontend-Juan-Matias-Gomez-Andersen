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

  it('should set the image form control when the upload component emits a selection', () => {
    component.onImageChanged({ fileName: 'superman.png', base64: 'data:image/png;base64,xxx' });

    expect(component.heroForm.get('image')?.value).toBe('data:image/png;base64,xxx');
  });

  it('should clear the image form control when the selection is reseted', () => {
    component.onImageChanged({ fileName: null, base64: null });

    expect(component.heroForm.get('image')?.value).toBe('');
  });
});
