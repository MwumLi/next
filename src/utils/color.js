import rgba from 'color-rgba';

class Gradient {
  constructor({vector, colors}) {
    if(!Array.isArray(vector) || (vector.length !== 4 && vector.length !== 6)) {
      throw new TypeError('Invalid gradient');
    }
    this.vector = vector;
    this.colors = colors.map(({offset, color}) => {
      return {offset, color: parseColor(color)};
    });
  }

  toString() {
    return JSON.stringify({vector: this.vector, colors: this.colors});
  }
}

export function parseColor(color) {
  // if(Array.isArray(color)) return color;
  if(color == null) return color;
  if(!color) color = 'transparent';
  if(color instanceof Gradient) return color;
  const ret = rgba(color);
  if(!ret || !ret.length) throw new TypeError('Invalid color value.');
  return `rgba(${ret.join()})`;
}

export {Gradient};

export function setFillColor(mesh, {color: fillColor}) {
  if(fillColor.vector) {
    // gradient
    const {vector, colors} = fillColor;
    if(vector.length === 4) {
      mesh.setLinearGradient({vector, colors, type: 'fill'});
    } else {
      mesh.setRadialGradient({vector, colors, type: 'fill'});
    }
  } else {
    if(mesh.gradient) delete mesh.gradient.fill;
    mesh.setFill({
      color: fillColor,
    });
  }
  return mesh;
}

export function setStrokeColor(mesh, {color: strokeColor, lineWidth, lineCap, lineJoin, lineDash, lineDashOffset, miterLimit}) {
  if(strokeColor.vector) {
    // gradient
    const {vector, colors} = strokeColor;
    if(vector.length === 4) {
      mesh.setLinearGradient({vector, colors, type: 'stroke'});
    } else {
      mesh.setRadialGradient({vector, colors, type: 'stroke'});
    }
    strokeColor = [0, 0, 0, 1];
  } else if(mesh.gradient) {
    delete mesh.gradient.stroke;
  }
  mesh.setStroke({
    color: strokeColor,
    thickness: lineWidth,
    cap: lineCap,
    join: lineJoin,
    miterLimit,
    lineDash,
    lineDashOffset,
  });
}