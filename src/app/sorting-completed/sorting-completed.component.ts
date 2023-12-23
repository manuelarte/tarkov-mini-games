import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-sorting-completed',
  standalone: true,
  imports: [
    MatIconModule,
    MatGridListModule,
    MatButtonModule
  ],
  templateUrl: './sorting-completed.component.html',
  styleUrl: './sorting-completed.component.css',
  animations: [
    trigger('fading', [
      state('start', style(
        { }
      )),
      state('end', style(
        { background: 'gainsboro'}
      )),
      transition('start <=> end', animate('800ms ease')),
      transition('void => end', animate('1200ms ease'))
    ])
  ]
})
export class SortingCompletedComponent {

  // @ts-ignore
  @Input({required: true}) sortingGame
  @Output() newGameEvent: EventEmitter<boolean> = new EventEmitter()

  protected animationState: string = "end"

  buttonClicked() {
    this.newGameEvent.emit(true)
  }

}
