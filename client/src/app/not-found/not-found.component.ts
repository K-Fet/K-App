import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div fxLayoutAlign="center center" style="height: 100%">
      <img src="./assets/404.png" alt="Page Introuvable"/>
    </div>
  `,
})
export class NotFoundComponent {}
