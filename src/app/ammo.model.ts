import {Item} from "./item.model";

export class Ammo {
  item: Item
  ammoType: string
  damage: number
  penetrationPower: number
  caliber: string
  tracer: boolean
  tracerColor: string
  initialSpeed: number


  constructor(item: Item, ammoType: string, damage: number, penetrationPower: number, caliber: string, tracer: boolean, tracerColor: string, initialSpeed: number) {
    this.item = item
    this.ammoType = ammoType
    this.damage = damage
    this.penetrationPower = penetrationPower
    this.caliber = caliber
    this.tracer = tracer
    this.tracerColor = tracerColor
    this.initialSpeed = initialSpeed
  }
}
