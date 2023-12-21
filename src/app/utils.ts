export default class Utils {
  static doSomething(val: string) { return val; }
  static doSomethingElse(val: string) { return val; }

  static getRandomNElements<T>(array: T[], seed: number, n: number): T[] {
    const copy = [...array]
    return this.shuffle(copy, seed).slice(0, n)
  }
  static shuffle<T>(array: T[], seed: number): T[] {
    let currentIndex = array.length, temporaryValue, randomIndex;
    seed = seed || 1;
    let random = function() {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
}
