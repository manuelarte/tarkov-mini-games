import { Component } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-gun-sound-item',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './gun-sound-item.component.html',
  styleUrl: './gun-sound-item.component.css'
})
export class GunSoundItemComponent {

  // @ts-ignore
  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  constructor() {
  }
}
