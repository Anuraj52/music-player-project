import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar { }