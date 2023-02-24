export class RankStack {
  constructor(lengthLimit) {
    this.value = [];
    this.limit = lengthLimit;
  }

  pushRank(rank) {
    if (rank === {} || rank === undefined || rank === [] || rank === null) return;
    if (this.value.length === this.limit) {
      this.value.shift();
    }
    this.value.push(rank);
  }

  get value() {
    if (this.value.length === 0) return [];
    return this.value;
  }
}