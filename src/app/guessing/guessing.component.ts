import {Component, OnInit} from '@angular/core';
import {TarkovApiService} from "../../tarkov-api.service";
import {EMPTY, finalize, Observable, startWith} from 'rxjs';
import {Ammo} from "../ammo.model";
import {ActivatedRoute, Router} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import Utils from "../utils";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDividerModule} from "@angular/material/divider";
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {map} from 'rxjs/operators';


export interface User {
  name: string;
}
@Component({
  selector: 'app-guessing',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    NgOptimizedImage,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './guessing.component.html',
  styleUrl: './guessing.component.css'
})
export class GuessingComponent implements OnInit{

  protected seed = 0
  protected numberOfItems = 5

  protected allAmmos: Ammo[] = []
  protected isLoadingAmmos = true

  myControl = new FormControl<string | Ammo>('');
  filteredOptions: Observable<Ammo[]> = EMPTY;

  protected ammos: Ammo[] = []
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: TarkovApiService) {
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['seed']) {
        this.seed = +params['seed']; // Convert to number
      } else {
        this.seed = Math.floor(Math.random() * 1000);

        // Update the URL with the generated seed
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { seed: this.seed },
          queryParamsHandling: 'merge'
        });
      }
      this.loadAmmos().subscribe(allAmmos => {
        this.allAmmos = allAmmos
        this.ammos = Utils.getRandomNElements(this.allAmmos, this.seed, this.numberOfItems)

        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.item.name;
            return name ? this._filter(name as string) : this.allAmmos.slice();
          }),
        );

      })

    });

  }

  displayFn(ammo: Ammo): string {
    return ammo && ammo.item ? ammo.item.name : '';
  }

  private _filter(name: string): Ammo[] {
    const filterValue = name.toLowerCase();

    return this.allAmmos.filter(option => option.item.name.toLowerCase().includes(filterValue));
  }

  private loadAmmos(): Observable<Ammo[]> {
    this.isLoadingAmmos = true
    return this.api.getAmmo().pipe(
      finalize(() => this.isLoadingAmmos = false)
    )
  }

}
