import Element from './element';

const setDefault = Symbol.for('spritejs_setAttributeDefault');
const setAttribute = Symbol.for('spritejs_setAttribute');
const getAttribute = Symbol.for('spritejs_getAttribute');

const _subject = Symbol.for('spritejs_subject');

export default class extends Element {
  constructor(subject) {
    super(subject);
    this[setDefault]({
      texture: null,
    });
  }

  get texture() {
    return this[getAttribute]('texture');
  }

  set texture(value) {
    const subject = this[_subject];
    subject.setTexture(value);
    this[setAttribute]('texture', value);
  }
}