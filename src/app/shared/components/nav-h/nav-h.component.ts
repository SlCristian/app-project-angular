import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-nav-h',
  imports: [RouterLink],
  templateUrl: './nav-h.component.html',
  styleUrl: './nav-h.component.scss'
})
export class NavHComponent {

  private menuService= inject(MenuService)

  isShoMenu() {
    this.menuService.toggleMenu();
  }
}
