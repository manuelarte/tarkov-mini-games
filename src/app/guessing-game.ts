import {Ammo} from './ammo.model';

export class GuessingGame<T> {
  solution: T
  numberOfTries: number

  constructor(solution: T) {
    this.solution = solution
    this.numberOfTries = 0
  }

  guess(value: T): boolean {
    if (value === this.solution) {
      return true
    }
    this.numberOfTries++
    return false
  }
}
