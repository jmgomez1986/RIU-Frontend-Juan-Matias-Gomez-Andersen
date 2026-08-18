# Errores reportados

[C1] Test trivial de directiva sin cobertura de comportamiento — src/app/directives/transform-text-uppercase.spec.ts
El único test es it('should create an instance', ...) que instancia la clase directamente (new TransformTextUppercase({} as Renderer2, {} as ElementRef))
sin TestBed. No existe ninguna prueba de: transformación a mayúsculas, posición del cursor tras setSelectionRange, pegado de texto, edición en el medio
del string. La directiva implementa la lógica crítica del enunciado y no tiene cobertura funcional.

[C2] any explícito en resource params — src/app/pages/edit-hero-page/edit-hero-page.ts:20
params: (): any => ({ heroId: this.heroId() })
Pérdida de tipado en el parámetro del resource. Debería ser (): { heroId: string } => (...).

[C3] Observable<any> en submit — src/app/heroes/components/new-hero/new-hero.ts:166–167
const heroesServiceObservable$: Observable<any> =
this.mode() === 'create' ? ... : ...
Tipado perdido deliberadamente para unificar las dos ramas. Debería usar Observable<NewHeroResponse | Hero>.

[C4] Bug de modo al recargar /view-hero/:id — src/app/pages/edit-hero-page/edit-hero-page.ts:30 y src/app/heroes/components/new-hero/new-hero.ts:86
El modo ('edit'/'view'/'create') se lee de router.currentNavigation()?.extras?.state. Este estado del router solo existe durante la navegación inicial y
se pierde al recargar la página. Al refrescar /view-hero/:id, el estado es null, el default de EditHeroPage es 'edit' y el formulario pasa a ser editable.
La ruta de solo lectura se vuelve completamente editable sin navegación.

[I1] HeroErrorStateMatcher duplicada — src/app/components/filters/filters.ts:21–26 y src/app/heroes/components/new-hero/new-hero.ts:43–48
Clase idéntica declarada en dos archivos. Debería extraerse a src/app/shared/hero-error-state-matcher.ts o similar.

[I2] Constructor injection inconsistente — src/app/heroes/components/new-hero/new-hero.ts:84
constructor(private fb: FormBuilder) { ... }
Todos los demás servicios del proyecto usan inject(). Esta mezcla es una inconsistencia de estilo en un proyecto Angular 21 que adopta el patrón moderno
en el resto de componentes. Debería ser private fb = inject(FormBuilder).

[I3] @Output() con EventEmitter en componente Filters — src/app/components/filters/filters.ts:50–51
@Output() nameFilterApplied = new EventEmitter<string>();
@Output() aliasFilterApplied = new EventEmitter<string>();
Patrón legacy en un proyecto Angular 21+. Debería usar output<string>() (Signal Output), en línea con lo que HeroGridCard hace correctamente.

[I4] Discrepancia maxlength HTML vs validador — src/app/heroes/components/new-hero/new-hero.html:25,70,110

- name: Validators.maxLength(20) pero maxlength="21" en el input
- alias: Validators.maxLength(20) pero maxlength="21"
- team: Validators.maxLength(20) pero maxlength="21"
- universe: Validators.maxLength(10) pero maxlength="11"

El control HTML permite ingresar un carácter más del que valida el FormControl. El validador dispara el error al llegar a 21 caracteres, pero el HTML
debería cortar en 20.

[I5] destroyRef inyectado y nunca usado — src/app/heroes/components/heroes-grid/heroes-grid.ts:36
private destroyRef = inject(DestroyRef);
HeroesGrid no tiene suscripciones manuales; resource() no necesita cleanup. Propiedad inyectada que es código muerto.

[I6] effect importado sin uso en edit-hero.ts — src/app/heroes/components/edit-hero/edit-hero.ts:1
import { Component, effect, input } from '@angular/core';
effect no se usa en el cuerpo de la clase.

[I7] RouterOutlet importado sin uso en new-hero-page.ts — src/app/pages/new-hero-page/new-hero-page.ts:2
import { RouterOutlet } from '@angular/router';
No está en el array imports del componente ni en el template. Import sin uso.

[I8] RouterOutlet y <router-outlet /> innecesarios en HeroesPage — src/app/pages/heroes-page/heroes-page.ts:3 y heroes-page.html:14
La ruta /heroes no tiene subrutas en app.routes.ts. El outlet está presente pero nunca renderiza nada.

[I9] CommonModule innecesario en new-hero.ts — src/app/heroes/components/new-hero/new-hero.ts:55
El template usa el nuevo control flow (@if, @for) y no usa pipes de CommonModule. Import defensivo innecesario en un proyecto standalone Angular 17+.

[I10] Suscripciones sin gestión de ciclo de vida en callbacks de SweetAlert2

- src/app/heroes/components/hero-grid-card/hero-grid-card.ts:37: this.heroesService.deleteHero(...).subscribe(...) dentro de .then() de SweetAlert2
- src/app/heroes/components/new-hero/new-hero.ts:170: ídem para el submit

Como son observables HTTP que completan solos, no son memory leaks prácticos. El patrón es incorrecto: si el componente se destruye entre la confirmación
del diálogo y la respuesta HTTP, la callback ejecuta sobre un contexto destruido.

[I11] Texto erróneo en modal de éxito al eliminar — src/app/heroes/components/hero-grid-card/hero-grid-card.ts:41
text: 'Tú nuevo Héroe ha sido creado.'
El mensaje de éxito después de eliminar un héroe dice que fue "creado". Además, "Tú" lleva tilde incorrectamente (debería ser "Tu").

[I12] Typo en mensaje de edición — src/app/heroes/components/new-hero/new-hero.ts:177
'El Héeroe ha sido editado' — doble 'e' en "Héeroe".

[I13] Accesibilidad

- Botones Eliminar/Consultar/Editar en hero-grid-card.html:77–93 sin aria-label. El ícono mat-icon no aporta texto accesible suficiente para lectores de
  pantalla.
- aria-label del chip remove en new-hero.html:155: 'Remover el poder' + power sin espacio entre el texto y el nombre del poder.
- <html lang="en"> (src/index.html:2) en una aplicación completamente en español. Debería ser lang="es".

[I14] Cobertura de tests insuficiente en componentes críticos

- new-hero.spec.ts: 3 tests (creación + 2 para el upload de imagen). Sin pruebas para validaciones del formulario, submit, cancelación, modo edit vs
  create.
- edit-hero-page.spec.ts: 1 test (should create). Sin prueba del modo 'view' vs 'edit', ni de carga del héroe por ID.
- transform-text-uppercase.spec.ts: 1 test de instanciación (ver C2).

# Correcciones

- C2: Se reemplaza tipo any explicito por tipado en el params del resource en edit-hero-page.ts

- I10: Se agrega takeUntilDestroyed(DestroRef) a subscripciones donde se usa SwettAlert2 ya quue este es asincronico y puede darse que el dialogo de confirmacion se muestre cuando ya el componente de card este destruido

- I14, C1: Se agregaron los test unitarios faltantes para new-hero, edit-hero-page y transform-text-uppercase (directiva)

- I13: Se agrega aria-label a los botones /Eliminar/Consultar/Editar. Se agrega espacio en el texto del aria-label en el chip de remover un poder. Se cambia a 'es' el inioma en el index-html por ser una aplicacion completamente en español, ya que erroneamente ponia 'en'

- C4: Se corrige bug donde para los modos new/edit/view al navegar funcionaba pero al refrescar el navegador, el modo se perdia, ya que se usaba state del router, y este al refrescar se perdia y el modo se ponia con el valor por defecto que era edit, entonces para el caso en que era view, se entraba con el formulario deshabilitado y al recargar la pagina, el formulario pasaba a edicion. Entonces se cambio el approuch pasando el modo en el data del router, entonces al recargar el navegador este se mantiene y usando Angular +21 con Signal Inputs

- I8: Se elimina RouterOutlet y router-outlet en HeroesPage por no ser necesarior, ya que dicha ruta no tiene subrutas

- I5, I6, I7, I9: Se eliminan imports y declaracion de variables no usados. I11, I12: Se modifican textos al Eliminar y crear un Heroe

- I3: Se cambia EventEmmiter por el uso de Signal Output, dado que no sigue el patron moderno de Angular 21+

- I2: Se mueve la inyeccion del formbuilder de 'Constructor injection' al patron moderno con el uso de inject() como el resto de los servicios

- I1: Se mueve la clase de errorStateMatche a un nuevo archivo para ser reutilizada y no duplicarla

- C3: se reempleaza tipo any en new-hero.ts donde se define a que observable llamar, si a addNewHero o editHero

Con respecto al punto [I14], fue desición mia dado que con el Validator del formulario si bien marcaba el error, dejaba seguir escribiendo infinitamente, por eso agregue la propiedad nativa del input, para que se le permita escribir al usuario el maximo+1, asi le "bloqueaba" seguir escribiendo y aparecia el mat-error, porque si dejaba la propiedad del input, el Validator nunca se manifestaba.
Recordando el ulttimo proyecto en el cual participe, sobre este mismo tema, el diseñador me explico y acordamos una forma de avisarle al usuario cuando ya llego al limite, y si sigue escribiendo recien ahi mostrar el error y "cortarle" en forma manual mediante (input) lo que escribiera hasta el maximo. Dado que me decia que es mejor avisarle al usuario antes de que cometa el error y asi evitarlo.
Asique refactorice esa validacion para replicar lo que habia hech y dejar algo mas robusto. Adicionalmente, se agregaron los test correspondientes.

# Test de los archivos especificados en I14 y C2

## 1. new-hero.spec.ts - Componente `NewHero`

### 1.1 Imagen

- Se valida que al emitir `onImageChanged` con una imagen (`fileName` + `base64`), el FormControl `image` del formulario toma el valor base64.
- Se valida que al emitir `onImageChanged` con la selección reseteada (`fileName: null, base64: null`), el FormControl `image` queda vacío (`''`).

### 1.2 Poderes

- Se valida que `addPower('Fuego')` agrega el poder tanto al signal `reactivePowersWords` como al FormControl `powers`.
- Se valida que al agregar un poder con espacios (`'  Fuego  '`), el texto se recorta, se agrega el poder y se limpia el input del chip.
- Se valida que con un valor compuesto solo de espacios no se agrega ningún poder, pero sí se limpia el input del chip.
- Se valida que al eliminar un poder existente se actualizan tanto el signal `reactivePowersWords` como el FormControl `powers`.

### 1.3 Navegación

- Se valida que `cancelSubmit()` redirige a la ruta `/heroes`.

### 1.4 Validaciones del formulario

- Se valida que el formulario nace inválido y que `name`, `alias`, `universe`, `team`, `description` e `image` tienen el error `required`.
- Se valida que al completar los campos obligatorios, `heroForm.valid` pasa a `true`.
- Se valida el validador `maxlength` al superar los límites: `name` y `alias` (máx 20), `universe` (máx 10), `team` (máx 20) y `description` (máx 150).
- Se valida que con formulario inválido `onSubmit()` no llama a `Swal.fire`.

### 1.5 Mensajes de error en el template (`mat-error`)

- Se valida que al marcar todos los campos como tocados se renderizan los mensajes: `El nombre es obligatorio`, `El alias es obligatorio`, `El universo es obligatorio`, `El equipo del héroe es obligatorio` y `La descripción del Héroe es obligatoria.`.
- Se valida que se muestran los mensajes de máximo de caracteres de cada campo cuando se superan los límites.
- Se valida que con el formulario válido no se renderiza ningún elemento `mat-error`.

### 1.6 Límite de caracteres con `onTextInput`

- Se valida que al tipear 25 caracteres en `alias` (máx 20), `onTextInput` recorta el valor del target y del FormControl a `maxLength + 1` (21) y deja el control con el error `maxlength`.
- Se valida que al tipear 21 caracteres (dentro de `maxLength + 1`), `onTextInput` no recorta ni modifica el control.
- Se valida que el `mat-hint` de "Límite de caracteres alcanzado" se muestra solo cuando el campo llega exactamente al máximo (20).
- Se valida que el `mat-hint` no se muestra ni por debajo del máximo (19) ni al superarlo (21).
- Integración: se valida que el `<input>` de `alias` no tiene el atributo nativo `maxlength` y que al tipear 30 caracteres el DOM se recorta a 21.
- Integración: se valida que con el alias en 21 el formulario queda inválido y el botón `Guardar` se deshabilita.

### 1.7 Modo create

- Se valida que en modo `create`, al confirmar el diálogo, se llama `addNewHero` con los datos del formulario, se refresca el grid (`refreshLoad`) y se navega a `/heroes`. También verifica que NO se llama a `editHero`.
- Se valida que si el usuario cancela el diálogo de confirmación no se llama a `addNewHero` ni a `editHero`.
- Se valida que al guardar con formulario válido se muestra el diálogo de confirmación de Swal (`¿Está seguro que desea guardar los cambios realizados?`).
- Se valida que tras un guardado exitoso se muestra el diálogo de éxito de Swal (`Se guardó con éxito`).

### 1.8 Modo edit

- Se valida que en modo `edit`, al confirmar, se llama `editHero('1', {datos del formulario})`, se refresca el grid y se navega a `/heroes`. Verifica que NO se llama a `addNewHero`.
- Se valida que al guardar con formulario válido en modo `edit` se muestra el diálogo de confirmación de Swal (`¿Está seguro que desea guardar los cambios realizados?`).
- Se valida que tras un guardado exitoso en modo `edit` se muestra el diálogo de éxito de Swal (`Se guardó con éxito`).

### 1.9 Modo view

- Se valida que en modo `view` el formulario queda deshabilitado y no aparece el botón `Guardar` en el template.

### 1.10 Botones Guardar y Cancelar (interacción del template)

- Se valida que al hacer click en el botón `Cancelar` se navega a `/heroes`.
- Se valida que con formulario inválido el botón `Guardar` está deshabilitado y hacer click no dispara el diálogo (`Swal.fire` no se llama).
- Se valida que con formulario válido el botón `Guardar` está habilitado y al hacer click se llama `addNewHero`, se refresca el grid y se navega a `/heroes`.

### 1.11 Manejo de errores

- Se valida que si `addNewHero` lanza un error, se loguea en consola y se muestra un diálogo de Swal con título `Error`.

---

## 2. edit-hero-page.spec.ts - Página `EditHeroPage`

### 2.1 Títulos según el modo

- Se valida que con mode `view` el `<h1>` muestra el texto `Ver Héroe`.
- Se valida que con mode `edit` el `<h1>` muestra el texto `Editar Héroe`.

### 2.2 Carga del resource

- Se valida que al inicializarse con `heroId = '1'` el resource llama a `getHeroById('1')`, su valor es el héroe mockeado y `hasValue()` devuelve `true`.

### 2.3 Manejo de errores del resource

- Se valida que cuando `getHeroById` lanza error el resource queda en estado de error (`.error()` definido y `hasValue()` `false`) y el template muestra el mensaje `No se pudo cargar el héroe.`.

---

## 3. transform-text-uppercase.spec.ts - Directiva `TransformTextUppercase`

### 3.1 Transformación a mayúsculas

- Se valida que al disparar el evento `input` con `hola mundo`, el valor del input queda en `HOLA MUNDO`.

### 3.2 Callback `onChange`

- Se valida que al transformar, `onChange` se invoca con el valor ya en mayúsculas (`HOLA`).

### 3.3 Posición del cursor

- Se valida que se llama a `setSelectionRange` con la posición previa del cursor.
- Se valida que al editar en el medio del texto (posición 3), el cursor se restaura en esa misma posición.

### 3.4 Texto pegado

- Se valida que un texto con mayúsculas y minúsculas mezcladas (`Mixed CaSe TeXt 123`) queda totalmente en mayúsculas (`MIXED CASE TEXT 123`).

### 3.5 Integración con el DOM

- Se valida que con la directiva montada en un host real, al despachar un evento `input` real sobre el `<input>`, el valor en el DOM se transforma a mayúsculas.
