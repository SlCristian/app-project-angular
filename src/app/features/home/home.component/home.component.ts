import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NavHComponent } from '../../../shared/components/nav-h/nav-h.component';

@Component({
  selector: 'app-home.component',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NavHComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

}
