const _type = Symbol('type');
const _bubbles = Symbol('bubbles');

export default class Event {
  constructor(type, {bubbles = false} = {}) {
    this[_type] = type;
    this[_bubbles] = bubbles;
    this.cancelBubble = false;
  }

  stopPropagation() {
    this.cancelBubble = true;
  }
}