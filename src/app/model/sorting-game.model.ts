import {Ammo} from '../ammo.model';

export class SortingGame {
  solution: Ammo[]
  sortingBy: SortingBy
  numberOfTries: number
  startTime: Date

  constructor(ammos: Ammo[], startTime: Date, sortingBy: SortingBy) {
    this.sortingBy = sortingBy
    this.solution = [...ammos]
    this.sortingBy.sort(this.solution)
    this.startTime = startTime
    this.numberOfTries = 0
  }

  isCompleted(ammos: Ammo[]): boolean {
    this.numberOfTries++
    if (ammos.length == this.solution.length) {
      return ammos.every((e, index) => this.sortingBy.f(e) === this.sortingBy.f(this.solution[index]))
    }
    return false
  }
}

export class SortingBy {
  name: string
  f: (a: Ammo) => number

  constructor(name: string, f: (a: Ammo) => number) {
    this.name = name
    this.f = f
  }

  sort(ammos: Ammo[]) {
    ammos.sort((a, b) => {
      if (this.f(a) > this.f(b)) {
        return -1
      } else if (this.f(a) < this.f(b)) {
        return 1
      } else {
        return 0
      }
    })
  }
}
