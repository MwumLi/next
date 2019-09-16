import Event from './event';

export default function createEvents(originalEvent) {
  const {bubbles} = originalEvent;

  let x,
    y;
  const originalCoordinates = [];

  const {left, top, width: viewportWidth, height: viewportHeight} = originalEvent.target.getBoundingClientRect();
  const resolutionWidth = originalEvent.target.width;
  const resolutionHeight = originalEvent.target.height;

  const pointers = originalEvent.changedTouches || [originalEvent];
  for(let i = 0; i < pointers.length; i++) {
    const pointer = pointers[i];
    const identifier = pointer.identifier;
    const {clientX, clientY} = pointer;
    if(clientX != null && clientY != null) {
      originalCoordinates.push({
        x: Math.round((clientX | 0) - left),
        y: Math.round((clientY | 0) - top),
        identifier,
      });
    }
  }
  if(originalCoordinates.length <= 0) originalCoordinates.push({x, y});

  const ret = [];
  originalCoordinates.forEach((originalCoordinate) => {
    if(originalCoordinate.x != null && originalCoordinate.y != null) {
      x = originalCoordinate.x * resolutionWidth / viewportWidth;
      y = originalCoordinate.y * resolutionHeight / viewportHeight;
    }
    const event = new Event(originalEvent.type, {bubbles});
    Object.assign(event, {
      layerX: x,
      layerY: y,
      originalX: originalCoordinate.x,
      originalY: originalCoordinate.y,
      x,
      y,
      identifier: originalCoordinate.identifier,
    });
    ret.push(event);
  });

  return ret;
}