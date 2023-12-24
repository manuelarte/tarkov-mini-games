import {Item} from '../item.model';

export class GunSoundGame {
  gunSound: GunSound
  options: Item[]

  constructor(gunSound: GunSound, options: Item[]) {
    this.gunSound = gunSound
    // check that options contains the gun sound
    this.options = options
  }
}

export interface GunSound {
  audio: string,
  weapon: string,
  weaponId: string,
  isSilenced?: boolean
}
