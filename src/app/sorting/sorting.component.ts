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
import {finalize} from "rxjs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-sorting',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AmmoListComponent, MatProgressSpinnerModule, CdkDropList, CdkDrag, CdkDragPlaceholder],
  templateUrl: './sorting.component.html',
  styleUrl: './sorting.component.css'
})
export class SortingComponent implements OnInit {

  protected numberOfItems = 6
  protected seed: number = 0
  protected isLoadingAmmos = true
  protected ammos: Ammo[] = []
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
      } else {
        this.seed = Math.floor(Math.random() * 1000);

        // Update the URL with the generated seed
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { seed: this.seed },
          queryParamsHandling: 'merge'
        });
      }
    });

    this.isLoadingAmmos = true
    this.api.getAmmo().pipe(
      finalize(() => this.isLoadingAmmos = false)
    ).subscribe(ammos => this.ammos = this.getRandomAmmos(ammos))
  }

  getRandomAmmos(ammos: Ammo[]): Ammo[] {
    return this.shuffle(ammos, this.seed).slice(0, this.numberOfItems)
  }

  dropAmmo(event: CdkDragDrop<Ammo[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    console.log(this.ammos)
  }

  shuffle(array: Ammo[], seed: number): Ammo[] {
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

}
