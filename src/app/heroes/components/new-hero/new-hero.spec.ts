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

  it('should store the image as base64 data URL in the image form control', async () => {
    const fileName = 'superman.png';
    const file = new File(['fake-content'], fileName, { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;

    component.onFileSelect(event);

    // FileReader es asíncrono, esperamos a que termine de leer el archivo
    await new Promise((resolve) => setTimeout(resolve, 50));

    // No debe guardar el objeto File, sino un string con la imagen en base64
    expect(component.heroForm.get('image')?.value).toContain('data:image/png;base64');
    expect(typeof component.heroForm.get('image')?.value).toBe('string');
    // El nombre del archivo se conserva para mostrarlo en la UI
    expect(component.imageFileName()).toBe(fileName);
  });

  it('should generate an image preview after selecting a file', async () => {
    const file = new File(['data'], 'batman.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } } as unknown as Event;

    component.onFileSelect(event);

    // FileReader es asíncrono, esperamos a que termine de leer el archivo
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(component.imagePreview()).toContain('data:image/jpeg;base64');
  });

  it('should reject non-image files and reset the image controls', () => {
    const file = new File(['data'], 'notas.txt', { type: 'text/plain' });
    const input = { files: [file], value: '' } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onFileSelect(event);

    expect(component.heroForm.get('image')?.value).toBe('');
    expect(component.imagePreview()).toBeNull();
    expect(component.imageFileName()).toBeNull();
  });
});
