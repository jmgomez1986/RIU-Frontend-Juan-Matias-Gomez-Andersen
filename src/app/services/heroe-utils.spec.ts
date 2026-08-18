import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';

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

  describe('enforceMaxLength', () => {
    // Simula un evento 'input' con un target mínimamente tipado (sin 'any').
    const createInputEvent = (value: string, selectionStart = value.length): {
      event: Event;
      target: { value: string; selectionStart: number; setSelectionRange: ReturnType<typeof vi.fn> };
    } => {
      const target = { value, selectionStart, setSelectionRange: vi.fn() };
      const event = new Event('input');
      Object.defineProperty(event, 'target', { value: target });
      return { event, target };
    };

    it('recorta el valor a maxLength + 1 y sincroniza el control', () => {
      const control = new FormControl('', [Validators.maxLength(20)]);
      const { event, target } = createInputEvent('x'.repeat(25));

      service.enforceMaxLength(event, control, 20);

      expect(target.value).toBe('x'.repeat(21));
      expect(control.value).toBe('x'.repeat(21));
      expect(target.setSelectionRange).toHaveBeenCalledWith(21, 21);
    });

    it('deja el control inválido (maxlength) tras el recorte', () => {
      const control = new FormControl('', [Validators.maxLength(20)]);
      const { event } = createInputEvent('x'.repeat(25));

      service.enforceMaxLength(event, control, 20);

      expect(control.hasError('maxlength')).toBe(true);
    });

    it('no modifica el valor cuando está dentro de maxLength + 1', () => {
      const control = new FormControl('valor');
      const { event, target } = createInputEvent('x'.repeat(20));

      service.enforceMaxLength(event, control, 20);

      expect(target.value).toBe('x'.repeat(20));
      expect(control.value).toBe('valor');
      expect(target.setSelectionRange).not.toHaveBeenCalled();
    });

    it('no hace nada si el target no existe', () => {
      const control = new FormControl('', [Validators.maxLength(20)]);
      const event = new Event('input');

      expect(() => service.enforceMaxLength(event, control, 20)).not.toThrow();
      expect(control.value).toBe('');
    });
  });
});
