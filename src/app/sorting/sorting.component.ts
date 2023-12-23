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
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray
} from "@angular/cdk/drag-drop";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import Utils from "../utils";
import {MatTooltipModule} from '@angular/material/tooltip';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {SortingBy, SortingGame} from '../model/sorting-game.model';
import {SortingCompletedComponent} from '../sorting-completed/sorting-completed.component';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';


const DAMAGE = new SortingBy("damage", (a: Ammo) => a.damage)
const PENETRATION_POWER = new SortingBy("penetration power", (a: Ammo) => a.penetrationPower)
const SORTING_OPTIONS = [DAMAGE, PENETRATION_POWER]

const FILTER_AMMO = (x: Ammo) => {
  const isFlare = x.item.name.startsWith("26x75mm flare")
  return !isFlare
}

@Component({
  selector: 'app-sorting',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AmmoListComponent, CdkDropList, CdkDrag, CdkDragPlaceholder, MatIconModule, MatButtonModule, MatTooltipModule, SortingCompletedComponent, NgxSkeletonLoaderModule],
  templateUrl: './sorting.component.html',
  styleUrl: './sorting.component.css',
  animations: [
    trigger('shakeit', [
      state('shakestart', style({
        transform: 'scale(1)',
      })),
      state('shakeend', style({
        transform: 'scale(1)',
      })),
      transition('shakestart => shakeend', animate('800ms ease-in',
        keyframes([
        style({transform: 'translate3d(-1px, 0, 0)', offset: 0.1}),
        style({transform: 'translate3d(2px, 0, 0)', offset: 0.2}),
        style({transform: 'translate3d(-4px, 0, 0)', offset: 0.3}),
        style({transform: 'translate3d(4px, 0, 0)', offset: 0.4}),
        style({transform: 'translate3d(-4px, 0, 0)', offset: 0.5}),
        style({transform: 'translate3d(4px, 0, 0)', offset: 0.6}),
        style({transform: 'translate3d(-4px, 0, 0)', offset: 0.7}),
        style({transform: 'translate3d(2px, 0, 0)', offset: 0.8}),
        style({transform: 'translate3d(-1px, 0, 0)', offset: 0.9}),
      ]))),
    ])]
})
export class SortingComponent implements OnInit {

  protected numberOfItems = 4
  protected seed: number = 0

  protected isLoadingAmmos = true
  protected allAmmos: Ammo[] = []
  protected ammos: Ammo[] = []

  protected sortingGame: SortingGame = new SortingGame([], new Date(), DAMAGE)
  protected isCompleted = false

  protected sortedOption: SortingBy = SORTING_OPTIONS[0];

  protected animationState = ""
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: TarkovApiService,
  ) {
  }

  shakeIt() {
    this.animationState = (this.animationState === 'shakestart' ? 'shakeend' : 'shakestart');
  }

  // @ts-ignore
  shakeEnd(){
    this.animationState = 'shakeend';
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
        this.allAmmos = allAmmos.filter(FILTER_AMMO)
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
    this.sortingGame = new SortingGame(this.ammos, new Date(), this.sortedOption)
  }


  private getRandomAmmos(ammos: Ammo[]): Ammo[] {
    return Utils.getRandomNElements(ammos, this.seed, this.numberOfItems)
  }

  dropAmmo(event: CdkDragDrop<Ammo[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    if (event.currentIndex != event.previousIndex) {
      this.isCompleted = this.sortingGame.isCompleted(this.ammos)
      if (!this.isCompleted) {
        this.shakeIt()
      }
    }
  }

  newGame() {
    this.isCompleted = false
    this.router.navigateByUrl('/sorting',{skipLocationChange:true}).then(()=>{
      this.router.navigate([], {
        relativeTo: this.route,
        queryParamsHandling: 'merge'
      });
    })
  }
}
