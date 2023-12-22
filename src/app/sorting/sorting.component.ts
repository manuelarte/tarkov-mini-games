import {Component, OnInit} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from "@angular/router";
import {CommonModule} from "@angular/common";
import {TarkovApiService} from "../../tarkov-api.service";
import {Ammo} from "../ammo.model";
import {AmmoListComponent} from "../ammo-list/ammo-list.component";
import {finalize, Observable} from "rxjs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray
} from "@angular/cdk/drag-drop";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import Utils from "../utils";

class SortingBy {
  name: string
  f: (a: Ammo) => number

  constructor(name: string, f: (a: Ammo) => number) {
    this.name = name
    this.f = f
  }

  sort(ammos: Ammo[]) {
    ammos.sort((a, b) => {
      if (this.f(a) > this.f(b)) {
        return -1
      } else if (this.f(a) < this.f(b)) {
        return 1
      } else {
        return 0
      }
    })
  }
}

class SortingGame {
  solution: Ammo[]
  sortingBy: SortingBy
  numberOfTries: number

  constructor(ammos: Ammo[], sortingBy: SortingBy) {
    this.sortingBy = sortingBy
    this.solution = [...ammos]
    this.sortingBy.sort(this.solution)
    this.numberOfTries = 0
  }

  isCompleted(ammos: Ammo[]): boolean {
    this.numberOfTries++
    if (ammos.length == this.solution.length) {
      return ammos.every((e, index) => this.sortingBy.f(e) === this.sortingBy.f(this.solution[index]))
    }
    return false
  }
}

const DAMAGE = new SortingBy("damage", (a: Ammo) => a.damage)
const PENETRATION_POWER = new SortingBy("penetration power", (a: Ammo) => a.penetrationPower)
const SORTING_OPTIONS = [DAMAGE, PENETRATION_POWER]

@Component({
  selector: 'app-sorting',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AmmoListComponent, MatProgressSpinnerModule, CdkDropList, CdkDrag, CdkDragPlaceholder, MatGridListModule, MatIconModule, MatButtonModule],
  templateUrl: './sorting.component.html',
  styleUrl: './sorting.component.css'
})
export class SortingComponent implements OnInit {

  protected numberOfItems = 4
  protected seed: number = 0

  protected isLoadingAmmos = true
  protected allAmmos: Ammo[] = []
  protected ammos: Ammo[] = []

  protected sortingGame: SortingGame = new SortingGame([], DAMAGE)
  protected isCompleted = false

  protected sortedOption: SortingBy = SORTING_OPTIONS[0];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: TarkovApiService,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['seed']) {
        this.seed = +params['seed']; // Convert to number
        this.sortedOption = Utils.getRandomNElements(SORTING_OPTIONS, this.seed, 1)[0];
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
        this.createGame()
      })

    });
  }

  private loadAmmos(): Observable<Ammo[]> {
    this.isLoadingAmmos = true
    return this.api.getAmmo().pipe(
      finalize(() => this.isLoadingAmmos = false)
    )
  }

  private createGame() {
    this.ammos = this.getRandomAmmos(this.allAmmos)
    this.sortingGame = new SortingGame(this.ammos, this.sortedOption)
  }


  private getRandomAmmos(ammos: Ammo[]): Ammo[] {
    return Utils.getRandomNElements(ammos, this.seed, this.numberOfItems)
  }

  dropAmmo(event: CdkDragDrop<Ammo[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    if (event.currentIndex != event.previousIndex) {
      this.isCompleted = this.sortingGame.isCompleted(this.ammos)
    }
  }

  newGame() {
    this.router.navigateByUrl('/sorting',{skipLocationChange:true}).then(()=>{
      this.router.navigate([], {
        relativeTo: this.route,
        queryParamsHandling: 'merge'
      });
    })
  }
}
