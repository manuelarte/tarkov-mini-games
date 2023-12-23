import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Ammo} from '../ammo.model';
import {ErrorStateMatcher, MatOptionModule} from '@angular/material/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {EMPTY, Observable, startWith} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {GuessingGame} from '../guessing-game';


class AmmoStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

class WrongGuessError<T> {
  guess: T

  constructor(guess: T) {
    this.guess = guess
  }
}

interface AmmoGroup {
  caliber: string
  ammos: Ammo[]

}

@Component({
  selector: 'app-guessing-item',
  standalone: true,
  imports: [
    CommonModule,
    MatOptionModule,
    MatGridListModule,
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './guessing-item.component.html',
  styleUrl: './guessing-item.component.css'
})
export class GuessingItemComponent implements OnInit{
  // @ts-ignore
  @Input({required: true}) solution: Ammo
  @Input({required: true}) options: Ammo[] = []
  @Output() guessedEvent = new EventEmitter<GuessingGame<Ammo>>();

  // @ts-ignore
  protected guessingGame: GuessingGame<Ammo>

  // @ts-ignore
  protected guessAmmoControl = new FormControl<string | Ammo>('', [Validators.required]);
  autoCompleteStateMatcher = new AmmoStateMatcher();

  filteredOptions: Observable<AmmoGroup[]> = EMPTY;

  protected isCompleted = false
  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.guessingGame = new GuessingGame(this.solution)

    this.filteredOptions = this.guessAmmoControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.item.name;
        return name ? this._filter(name as string) : this._groupByCaliber(this.options);
      }),
    );
  }

  displayFn(ammo: Ammo): string {
    return ammo && ammo.item ? ammo.item.name : '';
  }

  optionSelected(value: Ammo) {
    this.isCompleted = this.guessingGame.guess(value)

    if (!this.isCompleted) {
      this.guessAmmoControl.setErrors({'wrong_guess': new WrongGuessError(value)})
    } else {
      this.guessedEvent.emit(this.guessingGame)
    }
  }

  private _groupByCaliber(ammos: Ammo[]): AmmoGroup[] {
    const test = ammos.reduce((acc, curr) => {
      let key = curr.caliber
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(curr);
      return acc;
    }, Object.create(null))
    return Object.keys(test).map(key => ({
      caliber: key,
      ammos: test[key]
    }))
  }

  private _filter(name: string): AmmoGroup[] {
    const filterValue = name.toLowerCase();
    const filteredAmmos = this.options.filter(option => option.item.name.toLowerCase().includes(filterValue));
    return this._groupByCaliber(filteredAmmos)
  }


  openImageDialog(inspectImageLink: string) {
    this.dialog.open(AmmoImageDialog, {
      width: '512px',
      data: {inspectImageLink: inspectImageLink},
    });
  }

}

@Component({
  selector: 'ammo-image-dialog',
  template: '<img class="ammo-image" [ngSrc]="data.inspectImageLink" height="350" width="512" priority alt="ammo">',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
})
class AmmoImageDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }
}

export interface DialogData {
  inspectImageLink: string;
}
