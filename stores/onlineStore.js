class OnlineStore {
  constructor() {
    this.onlineDB = {};
  }

  isOnline(id) {
    if (this.onlineDB[id]) {
      return this.onlineDB[id];
    } else {
      return false;
    }
  }
  onOnline(id) {
    this.onlineDB[id] = true;
  }
  onOffline(id) {
    this.onlineDB[id] = false;
  }
}

module.exports = { OnlineStore };
