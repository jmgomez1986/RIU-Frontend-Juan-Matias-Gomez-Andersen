import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

// Se crea este error matcher sacado de la documentacion, porque solo se mostraba uno de los mat-error,
// porque no evaluaba todos los casos (dirty, touche, submitted)
export class HeroErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = !!(form && form.submitted);
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
