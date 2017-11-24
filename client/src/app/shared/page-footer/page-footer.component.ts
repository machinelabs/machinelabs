import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ml-page-footer',
  template: `
    <footer>
      <p>&copy; 2017 MachineLabs Inc. All rights reserved.</p>
      <p><a href="/terms-of-service" title="Terms of Service">Terms of Service</a></p>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      text-align: center;
      font-size: 0.9em;
      padding: 1rem;
      background: rgb(59, 59, 68);
      color: #fff;
    }

    a {
      color: #fff;
    }

    footer {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
  `]
})
export class PageFooterComponent {}
