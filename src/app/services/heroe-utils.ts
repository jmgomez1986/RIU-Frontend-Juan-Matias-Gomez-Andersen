import { Injectable, signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class HeroesUtilsService {
  private readonly refreshHeroesGridTrigger = signal<number>(0);
  readonly refreshHeroesGrid = this.refreshHeroesGridTrigger.asReadonly();

  /**
   * Dispara el refresco del grid de héroes.
   * Se usa un contador y no un booleano para que en cada llamada a refreshLoad() se incremente el valor,
   * por lo que SIEMPRE se produce un cambio de valor (y por ende el effect/consumidor reacciona).
   * Con un booleano, dos o más refreshLoad() en el mismo tick se cancelan entre sí (false -> true -> false)
   * y el valor final puede quedar igual que el inicial, con lo que el cambio de señal se pierde y el grid
   * podría no recargar.
   */
  refreshLoad(): void {
    this.refreshHeroesGridTrigger.update((val) => val + 1);
  }

  /**
   * Limita un input/textarea a maxLength + 1 caracteres sin usar el atributo nativo maxlength.
   *
   * Comportamiento (Opción B):
   * - Se deja escribir hasta maxLength + 1: al llegar ahí, Validators.maxLength dispara el error
   *   y el FormControl (y por ende el FormGroup) queda inválido.
   * - Cualquier caracter por encima de ese tope se recorta con slice(), dando la sensación de que
   *   el input no deja escribir más.
   * - Si se borra hasta maxLength, el validador vuelve a pasar y el error desaparece solo.
   *
   * @param event Evento input disparado desde el template ((input)).
   * @param control FormControl/AbstractControl que sincroniza el valor recortado.
   * @param maxLength Largo máximo permitido (el validador usa este mismo valor).
   */
  enforceMaxLength(
    event: Event,
    control: AbstractControl | null | undefined,
    maxLength: number,
  ): void {
    const input = event.target as HTMLInputElement | null;
    if (!input) {
      return;
    }

    const limit = maxLength + 1;
    if (input.value.length <= limit) {
      return;
    }

    const caret = Math.min(input.selectionStart ?? input.value.length, limit);
    const clamped = input.value.slice(0, limit);
    input.value = clamped;
    input.setSelectionRange(caret, caret);
    control?.setValue(clamped, { emitEvent: false });
  }
}
