import {Component, Input} from '@angular/core';
import {Ammo} from "../ammo.model";
import {MatCardModule} from "@angular/material/card";
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-ammo-list',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './ammo-list.component.html',
  styleUrl: './ammo-list.component.css'
})
export class AmmoListComponent {
  @Input({ required: true }) ammo!: Ammo;
}
