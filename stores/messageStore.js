class MessageStore {
  constructor() {
    this.messageDB = {};
  }

  putMessage(message) {
    if (this.messageDB[message.to]) {
      this.messageDB[message.to].push(message);
    } else {
      this.messageDB[message.to] = [message];
    }
  }

  getMessage(id) {
    if (this.messageDB[id]) {
      let message = this.messageDB[id][0];
      this.messageDB[id] = this.messageDB[id].shift();
      return message;
    } else {
      return false;
    }
  }
  hasMessage(id) {
    if (!this.messageDB[id]) return false;
    return this.messageDB[id].length > 0;
  }
}

module.exports = { MessageStore };
