import {Item} from '../item.model';

export class GunSoundGame {
  gunSound: GunSound
  options: Item[]
  guess!: Item
  numberOfPlays: number

  constructor(gunSound: GunSound, options: Item[]) {
    this.gunSound = gunSound
    // check that options contains the gun sound
    this.options = options

    this.numberOfPlays = 0
  }

  audioPlayed() {
    this.numberOfPlays++
  }

  guessGun(gun: Item): boolean {
    this.guess = gun
    return this.isGuessed()
  }

  isGuessed(): boolean {
    if (this.guess) {
      return this.gunSound.weaponId === this.guess.id
    }
    return false
}

  isGameFinished(): boolean {
    return this.guess != undefined
  }
}

export interface GunSound {
  audio: string,
  weapon: string,
  weaponId: string,
  isSilenced?: boolean
}
