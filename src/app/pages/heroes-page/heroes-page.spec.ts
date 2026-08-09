import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import HeroesPage from './heroes-page';
import { HeroesGrid } from '../../heroes/components/heroes-grid/heroes-grid';

// Stub: reemplaza al componente hijo real para que no se instancie (ni su resource ni su HTTP).
// A diferencia del mock de HeroesService, acá el test de la página queda aislado del hijo:
// como estamos testeando HeroesPage, no deberíamos preocuparnos por servicios que usa un
// componente hijo.
@Component({
  selector: 'app-heroes-grid',
  template: '',
  standalone: true,
})
class HeroesGridStub {}

describe('HeroesPage', () => {
  let component: HeroesPage;
  let fixture: ComponentFixture<HeroesPage>;

  beforeEach(async () => {
    await TestBed.overrideComponent(HeroesPage, {
      remove: { imports: [HeroesGrid] },
      add: { imports: [HeroesGridStub] },
    })
      .configureTestingModule({
        imports: [HeroesPage],
        providers: [provideRouter([])],
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeroesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
