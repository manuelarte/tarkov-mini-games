import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {TarkovApiService} from "../../tarkov-api.service";
import {Ammo} from "../ammo.model";
import {AmmoListComponent} from "../ammo-list/ammo-list.component";
import {finalize} from "rxjs";

@Component({
  selector: 'app-sorting',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AmmoListComponent],
  templateUrl: './sorting.component.html',
  styleUrl: './sorting.component.css'
})
export class SortingComponent implements OnInit {

  protected isLoadingAmmos = true
  protected ammos: Ammo[] = []
  constructor(
    private api: TarkovApiService
  ) {
  }

  ngOnInit(): void {
    this.isLoadingAmmos = true
    this.api.getAmmo().pipe(
      finalize(() => this.isLoadingAmmos = false)
    ).subscribe(ammos => this.ammos = ammos)
  }
}
