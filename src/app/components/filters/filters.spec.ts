import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filters } from './filters';

describe('Filters', () => {
  let component: Filters;
  let fixture: ComponentFixture<Filters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filters],
    }).compileComponents();

    fixture = TestBed.createComponent(Filters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('valueChanges (filtro por nombre)', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('no emite si el control es valido pero el query queda 1-2 chars tras el trim', async () => {
      vi.useFakeTimers();
      const emit = vi.spyOn(component.nameFilterApplied, 'emit');

      component.nameFilter.setValue(' ab ');
      await vi.advanceTimersByTimeAsync(1000);

      expect(emit).not.toHaveBeenCalled();
    });

    it('emite con trim cuando hay >= 3 chars', async () => {
      vi.useFakeTimers();
      const emit = vi.spyOn(component.nameFilterApplied, 'emit');

      component.nameFilter.setValue('  super  ');
      await vi.advanceTimersByTimeAsync(1000);

      expect(emit).toHaveBeenCalledWith('super');
    });

    it('no emite cuando el control es invalido (< 3 chars)', async () => {
      vi.useFakeTimers();
      const emit = vi.spyOn(component.nameFilterApplied, 'emit');

      component.nameFilter.setValue('ab');
      expect(component.nameFilter.invalid).toBe(true);
      await vi.advanceTimersByTimeAsync(1000);

      expect(emit).not.toHaveBeenCalled();
    });
  });

  describe('valueChanges (filtro por alias)', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('no emite si el control es valido pero el query queda 1-2 chars tras el trim', async () => {
      vi.useFakeTimers();
      const emit = vi.spyOn(component.aliasFilterApplied, 'emit');

      component.aliasFilter.setValue(' ab ');
      await vi.advanceTimersByTimeAsync(1000);

      expect(emit).not.toHaveBeenCalled();
    });

    it('emite con trim cuando hay >= 3 chars', async () => {
      vi.useFakeTimers();
      const emit = vi.spyOn(component.aliasFilterApplied, 'emit');

      component.aliasFilter.setValue('  super  ');
      await vi.advanceTimersByTimeAsync(1000);

      expect(emit).toHaveBeenCalledWith('super');
    });

    it('no emite cuando el control es invalido (< 3 chars)', async () => {
      vi.useFakeTimers();
      const emit = vi.spyOn(component.aliasFilterApplied, 'emit');

      component.aliasFilter.setValue('ab');
      expect(component.aliasFilter.invalid).toBe(true);
      await vi.advanceTimersByTimeAsync(1000);

      expect(emit).not.toHaveBeenCalled();
    });
  });

  describe('límite de caracteres (onTextInput)', () => {
    // Simula un evento 'input' con un target mínimamente tipado (sin 'any').
    const createInputEvent = (value: string): {
      event: Event;
      target: { value: string; selectionStart: number; setSelectionRange: ReturnType<typeof vi.fn> };
    } => {
      const target = { value, selectionStart: value.length, setSelectionRange: vi.fn() };
      const event = new Event('input');
      Object.defineProperty(event, 'target', { value: target });
      return { event, target };
    };

    it('recorta el nameFilter a máximo + 1 (21) y lo deja inválido', () => {
      const { event, target } = createInputEvent('x'.repeat(30));

      component.onTextInput(event, component.nameFilter);

      expect(target.value).toBe('x'.repeat(21));
      expect(component.nameFilter.value).toBe('x'.repeat(21));
      expect(component.nameFilter.hasError('maxlength')).toBe(true);
    });

    it('muestra el mat-hint solo cuando el filtro llega al máximo (20)', () => {
      component.nameFilter.setValue('x'.repeat(20));
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Límite de caracteres alcanzado');

      component.nameFilter.setValue('x'.repeat(19));
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toContain('Límite de caracteres alcanzado');
    });

    it('integración: no tiene maxlength nativo y recorta el DOM al tipear', () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('#heroName') as HTMLInputElement;
      expect(input.getAttribute('maxlength')).toBeNull();

      input.value = 'y'.repeat(25);
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value.length).toBe(21);
      expect(component.nameFilter.value?.length).toBe(21);
    });
  });
});