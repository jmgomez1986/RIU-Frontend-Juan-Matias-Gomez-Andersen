import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomUploadImage, CustomUploadImageSelection } from '../custom-upload-image';

describe('CustomUploadImage', () => {
  let component: CustomUploadImage;
  let fixture: ComponentFixture<CustomUploadImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomUploadImage],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomUploadImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit base64 and fileName after selecting a valid image', async () => {
    let selection: CustomUploadImageSelection | undefined;
    component.selectionChange.subscribe((s) => (selection = s));

    const fileName = 'superman.png';
    const file = new File(['fake-content'], fileName, { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;

    component.onFileSelect(event);

    // FileReader es asíncrono, esperamos a que termine de leer el archivo
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(selection?.fileName).toBe(fileName);
    expect(selection?.base64).toContain('data:image/png;base64');
    // El preview y el nombre se actualizan internamente
    expect(component.imagePreview()).toContain('data:image/png;base64');
    expect(component.imageFileName()).toBe(fileName);
  });

  it('should reject non-image files, reset the state and emit nulls', () => {
    let selection: CustomUploadImageSelection | undefined;
    component.selectionChange.subscribe((s) => (selection = s));

    const file = new File(['data'], 'notas.txt', { type: 'text/plain' });
    const input = { files: [file], value: '' } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onFileSelect(event);

    expect(selection?.fileName).toBeNull();
    expect(selection?.base64).toBeNull();
    expect(component.imagePreview()).toBeNull();
    expect(component.imageFileName()).toBeNull();
    expect(component.imageNameControl.hasError('invalidType')).toBe(true);
  });
});
