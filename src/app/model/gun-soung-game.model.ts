import {Item} from '../item.model';

export class GunSoundGame {
  gunSound: GunSound
  options: Item[]
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

  guess(gun: Item): boolean {
    return this.gunSound.weaponId === gun.id
  }
}

export interface GunSound {
  audio: string,
  weapon: string,
  weaponId: string,
  isSilenced?: boolean
}
