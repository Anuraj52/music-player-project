import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './library.html',
  styleUrls: ['./library.css']
})

export class Library {

  tracks = [
    { title: 'Believer', artist: 'Imagine Dragons' },
    { title: 'Faded', artist: 'Alan Walker' },
    { title: 'Shape of You', artist: 'Ed Sheeran' },
    { title: 'Closer', artist: 'Chainsmokers' }
  ];

}