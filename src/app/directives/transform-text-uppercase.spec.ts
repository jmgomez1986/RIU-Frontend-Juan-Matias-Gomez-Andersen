import { ElementRef, Renderer2 } from '@angular/core';
import { TransformTextUppercase } from './transform-text-uppercase';

describe('TransformTextUppercase', () => {
  it('should create an instance', () => {
    const directive = new TransformTextUppercase({} as Renderer2, {} as ElementRef);
    expect(directive).toBeTruthy();
  });
});
