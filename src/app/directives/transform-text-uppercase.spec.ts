import { Component, ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TransformTextUppercase } from './transform-text-uppercase';

// Simula el evento 'input' con un target tipado mínimamente (sin 'any').
function createInputEvent(value: string, selectionStart = value.length): {
  event: Event;
  target: { value: string; selectionStart: number; setSelectionRange: ReturnType<typeof vi.fn> };
} {
  const target = { value, selectionStart, setSelectionRange: vi.fn() };
  const event = new Event('input');
  Object.defineProperty(event, 'target', { value: target });
  return { event, target };
}

describe('TransformTextUppercase', () => {
  let directive: TransformTextUppercase;

  beforeEach(() => {
    directive = new TransformTextUppercase({} as Renderer2, {} as ElementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('transforma el valor a mayúsculas', () => {
    const { event, target } = createInputEvent('hola mundo');
    directive.input(event);

    expect(target.value).toBe('HOLA MUNDO');
  });

  it('llama a onChange con el valor en mayúsculas', () => {
    const onChangeSpy = vi.fn();
    directive.onChange = onChangeSpy;
    const { event } = createInputEvent('hola');

    directive.input(event);

    expect(onChangeSpy).toHaveBeenCalledWith('HOLA');
  });

  it('preserva la posición del cursor', () => {
    const { event, target } = createInputEvent('hola mundo', 4);

    directive.input(event);

    expect(target.setSelectionRange).toHaveBeenCalledWith(4, 4);
  });

  it('capitaliza el texto pegado', () => {
    const { event, target } = createInputEvent('Mixed CaSe TeXt 123');
    directive.input(event);

    expect(target.value).toBe('MIXED CASE TEXT 123');
  });

  it('mantiene la posición al editar en el medio', () => {
    const { event, target } = createInputEvent('abcdef', 3);
    directive.input(event);

    expect(target.setSelectionRange).toHaveBeenCalledWith(3, 3);
  });
});

// Host mínimo para testear la directiva conectada al DOM y al HostListener real.
@Component({
  selector: 'host-test',
  template: '<input appTransformTextUppercase />',
  imports: [TransformTextUppercase],
})
class HostComponent {}

describe('TransformTextUppercase (integración)', () => {
  it('transforma a mayúsculas cuando se dispara un evento input real', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'hola mundo';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('HOLA MUNDO');
  });
});
