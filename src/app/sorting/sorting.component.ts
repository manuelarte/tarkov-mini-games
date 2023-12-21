import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {TarkovApiService} from "../../tarkov-api.service";

@Component({
  selector: 'app-sorting',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sorting.component.html',
  styleUrl: './sorting.component.css'
})
export class SortingComponent implements OnInit {
  constructor(
    private api: TarkovApiService
  ) {
  }

  ngOnInit(): void {
        this.api.getAmmo().subscribe(d => console.log("data", d[0]))
    }
}
