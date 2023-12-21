import {Component, Input} from '@angular/core';
import {Ammo} from '../ammo.model';
import {MatOptionModule} from '@angular/material/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EMPTY, Observable, startWith} from 'rxjs';
import {map} from 'rxjs/operators';

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
  ],
  templateUrl: './guessing-item.component.html',
  styleUrl: './guessing-item.component.css'
})
export class GuessingItemComponent {
  // @ts-ignore
  @Input({required: true}) solution: Ammo
  @Input({required: true}) options: Ammo[] = []


  myControl = new FormControl<string | Ammo>('');
  filteredOptions: Observable<Ammo[]> = EMPTY;
  constructor() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.item.name;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  displayFn(ammo: Ammo): string {
    return ammo && ammo.item ? ammo.item.name : '';
  }

  private _filter(name: string): Ammo[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.item.name.toLowerCase().includes(filterValue));
  }


}
