import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatRadioChange, MatRadioModule} from '@angular/material/radio';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {Item} from "../item.model";
import {GunSoundGame} from '../model/gun-soung-game.model';

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
  protected guess: Item;

  @Input({required: true}) gunSoundGame!: GunSoundGame;
  @Input({required: true}) options!: Item[];

  @Output() guessedEvent: EventEmitter<Item> = new EventEmitter<Item>()

  constructor() {
  }

  guessed(event: MatRadioChange) {
    this.guessedEvent.emit(this.guess)
  }

}
