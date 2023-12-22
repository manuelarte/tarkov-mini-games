import {Component, OnInit} from '@angular/core';
import {TarkovApiService} from "../../tarkov-api.service";
import {finalize, Observable} from 'rxjs';
import {Ammo} from "../ammo.model";
import {ActivatedRoute, Router} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CommonModule} from "@angular/common";
import Utils from "../utils";
import {MatGridListModule} from "@angular/material/grid-list";
import {GuessingItemComponent} from '../guessing-item/guessing-item.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {GuessingGame} from '../guessing-game';

const FILTER_AMMO = (x: Ammo) => {
  const is9x18 = x.item.name.startsWith("9x18mm")
  const isGrenade = x.item.name.startsWith("40x46mm")
  const isFlare = x.item.name.startsWith("26x75mm flare")
  return !is9x18 && !isFlare && !isGrenade
}

@Component({
  selector: 'app-guessing',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    GuessingItemComponent,
    MatExpansionModule,
  ],
  templateUrl: './guessing.component.html',
  styleUrl: './guessing.component.css'
})
export class GuessingComponent implements OnInit{

  protected seed = 0
  protected numberOfItems = 5

  protected allAmmos: Ammo[] = []
  protected isLoadingAmmos = true

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
        this.allAmmos = allAmmos.filter(FILTER_AMMO)
        this.ammos = Utils.getRandomNElements(this.allAmmos, this.seed, this.numberOfItems)
      })
    });

  }

  private loadAmmos(): Observable<Ammo[]> {
    this.isLoadingAmmos = true
    return this.api.getAmmo().pipe(
      finalize(() => this.isLoadingAmmos = false)
    )
  }

  guessed($event: GuessingGame<Ammo>) {
    console.log($event)
  }
}
