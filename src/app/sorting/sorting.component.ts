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

  constructor(ammos: Ammo[], sortingBy: SortingBy) {
    this.sortingBy = sortingBy
    this.solution = [...ammos]
    this.sortingBy.sort(this.solution)
  }

  isCompleted(ammos: Ammo[]): boolean {
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

  protected numberOfItems = 5
  protected seed: number = 0

  protected isLoadingAmmos = true
  protected allAmmos: Ammo[] = []
  protected ammos: Ammo[] = []

  protected sortingGame: SortingGame = new SortingGame([], DAMAGE)
  protected numberOfMoves = 0
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
        this.sortedOption = this.getRandomNElements(SORTING_OPTIONS, 1)[0];
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

  private getRandomNElements<T>(array: T[], n: number): T[] {
    const copy = [...array]
    return this.shuffle(copy, this.seed).slice(0, n)
  }

  private getRandomAmmos(ammos: Ammo[]): Ammo[] {
    return this.getRandomNElements(ammos, this.numberOfItems)
  }

  private shuffle<T>(array: T[], seed: number): T[] {
    let currentIndex = array.length, temporaryValue, randomIndex;
    seed = seed || 1;
    let random = function() {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  dropAmmo(event: CdkDragDrop<Ammo[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    if (event.currentIndex != event.previousIndex) {
      this.numberOfMoves++
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
