export default class LayerWorker extends Worker {
  constructor(id, options) {
    if(options.worker === true) {
      options.worker = `./${id}.worker.js`;
    }
    super(options.worker);
    this.id = id;
    this.options = options;

    const offscreenCanvas = options.canvas.transferControlToOffscreen();
    const opts = {...options};
    delete opts.container;
    opts.canvas = offscreenCanvas;

    this.postMessage({
      type: 'create',
      options: opts,
    }, [offscreenCanvas]);
  }

  remove() {
    if(this.parent && this.parent.removeChild) {
      this.parent.removeChild(this);
      return true;
    }
    return false;
  }

  connect(parent, zOrder) {
    Object.defineProperty(this, 'parent', {
      value: parent,
      writable: false,
      configurable: true,
    });
    Object.defineProperty(this, 'zOrder', {
      value: zOrder,
      writable: false,
      configurable: true,
    });
  }

  disconnect() {
    delete this.parent;
    delete this.zOrder;
  }

  dispatchPointerEvent(event) {
    this.postMessage({
      type: 'event',
      event: {
        cancelBubble: event.cancelBubble,
        bubbles: event.bubbles,
        detail: event.detail,
        identifier: event.identifier,
        layerX: event.layerX,
        layerY: event.layerY,
        originalX: event.originalX,
        originalY: event.originalY,
        type: event.type,
        x: event.x,
        y: event.y,
      },
    });
  }
}
