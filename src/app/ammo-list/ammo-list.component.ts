import {Component, Input} from '@angular/core';
import {Ammo} from "../ammo.model";
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-ammo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './ammo-list.component.html',
  styleUrl: './ammo-list.component.css'
})
export class AmmoListComponent {
  @Input({ required: true }) ammo!: Ammo;
}
