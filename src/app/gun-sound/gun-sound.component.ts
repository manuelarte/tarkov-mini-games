import {Component, OnInit} from '@angular/core';
import {GunSoundItemComponent} from '../gun-sound-item/gun-sound-item.component';
import {MatTabsModule} from '@angular/material/tabs';
import {TarkovApiService} from '../../tarkov-api.service';
import {finalize, Observable} from 'rxjs';
import {Item} from '../item.model';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {gunSoundAssets} from './gun-sound-assets';
import Utils from '../utils';
import {GunSoundGame} from '../model/gun-soung-game.model';

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

  protected gunSoundGames!: GunSoundGame[]
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
      this._loadGuns().subscribe(allGuns => {
        this.allGuns = Utils.shuffle(allGuns.filter(FILTER_GUNS), this.seed)
        this.gunSoundGames = []
        this._createGame()
      })

    });

  }

  private _createGame() {
    const gunSounds = Utils.getRandomNElements(this.gunSoundAssets, this.seed, this.numberOfItems)
    gunSounds.forEach((gs, idx) => {
      // filter all Ammos once option and the next 3
      const n = this.allGuns.length
      const index = this.allGuns.findIndex((v,i) => v.id === gs.weaponId)
      const endIndex = (index + this.numberOfOptions % n + n) % n
      let options: Item[]
      if (endIndex > index) {
        options = this.allGuns.slice(index, endIndex)
      } else {
        options = this.allGuns.slice(index)
        const left = this.numberOfOptions - options.length
        options = options.concat(this.allGuns.slice(0, left))
      }
      const shuffledOptions = Utils.shuffle(options, this.seed+index)
      this.gunSoundGames.push(new GunSoundGame(gs, shuffledOptions))
    })

  }

  private _loadGuns(): Observable<Item[]> {
    this.isLoadingGuns = true
    return this.api.getGuns().pipe(
      finalize(() => this.isLoadingGuns = false)
    )
  }


  protected readonly Utils = Utils;

  guessed($event: Item, idx: number) {
    this.gunSoundGames[idx].guessGun($event)
  }

  isGameFinished(): boolean {
    return this.gunSoundGames.every(gsg => gsg.isGameFinished())
  }

  isGameActive(idx: number): boolean {
    if (this.gunSoundGames[idx].isGameFinished()) {
      return false
    }
    let i = 0
    for (i = 0; i <= idx-1; i++) {
      if (!this.gunSoundGames[i].isGameFinished())  {
        break
      }
    }
    return i == idx
  }

  selectedTab(): number {
    for (let i = 0; i < this.gunSoundGames.length; i++) {
      if (!this.gunSoundGames[i].isGameFinished())  {
        return i
      }
    }
    return this.gunSoundGames.length
  }
}
