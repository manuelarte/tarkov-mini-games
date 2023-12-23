import {Component, OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {GunSoundItemComponent} from '../gun-sound-item/gun-sound-item.component';
import {MatTabsModule} from '@angular/material/tabs';
import {TarkovApiService} from '../../tarkov-api.service';
import {finalize, Observable} from 'rxjs';
import {Item} from '../item.model';

@Component({
  selector: 'app-gun-sound',
  standalone: true,
  imports: [
    MatListModule,
    GunSoundItemComponent,
    MatTabsModule
  ],
  templateUrl: './gun-sound.component.html',
  styleUrl: './gun-sound.component.css'
})
export class GunSoundComponent implements OnInit{

  protected isLoadingGuns = true

  protected allGuns: Item[] = []
  constructor(private api: TarkovApiService) {
  }

  ngOnInit(): void {
    this.loadGuns().subscribe(allGuns => this.allGuns = allGuns)
  }

  private loadGuns(): Observable<Item[]> {
    this.isLoadingGuns = true
    return this.api.getGuns().pipe(
      finalize(() => this.isLoadingGuns = false)
    )
  }


}
