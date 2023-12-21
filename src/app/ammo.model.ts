export class Ammo {
  damage: number
  penetrationPower: number
  tracer: boolean

  constructor(damage: number, penetrationPower: number, tracer: boolean) {
    this.damage = damage
    this.penetrationPower = penetrationPower
    this.tracer = tracer
  }
}
