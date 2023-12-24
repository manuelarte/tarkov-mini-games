import {Component, OnInit} from '@angular/core';
import {GunSoundItemComponent} from '../gun-sound-item/gun-sound-item.component';
import {MatTabsModule} from '@angular/material/tabs';
import {TarkovApiService} from '../../tarkov-api.service';
import {finalize, Observable} from 'rxjs';
import {Item} from '../item.model';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {gunSoundAssets} from "./gun-sound-assets";
import Utils from "../utils";
import {GunSoundGame} from '../model/gun-soung-game.model';

const special = ['zeroth','first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
const deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];

const FILTER_GUNS = (x: Item) => {
  const isFlare = x.name.startsWith("RSP-30")
  return !isFlare
}

@Component({
  selector: 'app-gun-sound',
  standalone: true,
  imports: [
    CommonModule,
    GunSoundItemComponent,
    MatTabsModule,
    MatProgressBarModule
  ],
  templateUrl: './gun-sound.component.html',
  styleUrl: './gun-sound.component.css'
})
export class GunSoundComponent implements OnInit{

  protected readonly gunSoundAssets = gunSoundAssets;

  protected isLoadingGuns = true

  protected seed = 0
  protected numberOfItems = 4
  protected numberOfOptions = 8

  protected allGuns: Item[] = []

  protected gunSoundGames: GunSoundGame[] = []
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: TarkovApiService
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
      this.loadGuns().subscribe(allGuns => {
        this.allGuns = Utils.shuffle(allGuns.filter(FILTER_GUNS), this.seed)
        this._createGame()
      })

    });

  }

  private _createGame() {
    const gunSounds = Utils.getRandomNElements(this.gunSoundAssets, this.seed, this.numberOfItems)
    gunSounds.forEach(gs => {
      // filter allAmmos once option and the next 3
      const n = this.allGuns.length
      const index = this.allGuns.findIndex((v,i) => v.id === gs.weaponId)
      const options = Utils.shuffle(this.allGuns.slice(index, (index + this.numberOfOptions % n + n) % n), this.seed+index)
      this.gunSoundGames.push(new GunSoundGame(gs, options))
    })

  }

  private loadGuns(): Observable<Item[]> {
    this.isLoadingGuns = true
    return this.api.getGuns().pipe(
      finalize(() => this.isLoadingGuns = false)
    )
  }



  stringifyNumber(n: number) {
    if (n < 20) return special[n];
    if (n%10 === 0) return deca[Math.floor(n/10)-2] + 'ieth';
    return deca[Math.floor(n/10)-2] + 'y-' + special[n%10];
  }


}
