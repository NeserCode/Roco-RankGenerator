export class RankStack {
  constructor(lengthLimit) {
    this.value = [];
    this.map = new Map();
    this.limit = lengthLimit;
  }

  pushRank(rank) {
    if (rank === {} || rank === undefined || rank === [] || rank === null) return;
    if (this.value.length === this.limit) {
      this.value.shift();
    }
    this.value.push(rank);

    // id map init winer
    if (this.map.get(rank.winerId) === undefined) {
      this.map.set(rank.winerId, []);
    }
    // id map init loser
    if (this.map.get(rank.loserId) === undefined) {
      this.map.set(rank.loserId, []);
    }

    // rule: everyone can only decide other state
    let isWiner = rank.id === rank.winerId
    let isSpeacial = rank.winer.type === "SPECIAL_RANK" || rank.loser.type === "SPECIAL_RANK"

    // id map push
    if (!isSpeacial) {
      if (isWiner)
        this.map.set(rank.loserId, [...this.map.get(rank.loserId), rank]);
      else
        this.map.set(rank.winerId, [...this.map.get(rank.winerId), rank]);
    } else {
      this.map.set(rank.loserId, [...this.map.get(rank.loserId), rank]);
      this.map.set(rank.winerId, [...this.map.get(rank.winerId), rank]);
    }
  }

  getRankInfoById(id) {
    return this.map.get(id);
  }

  clear() {
    this.value = [];
    this.map = new Map();
  }
}