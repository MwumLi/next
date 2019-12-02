import rgba from 'color-rgba';

class Gradient {
  constructor({vector, colors}) {
    if(!Array.isArray(vector) || (vector.length !== 4 && vector.length !== 6 && vector.length !== 3)) {
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
    const vectorOffset = mesh.boundingBox[0];
    let {vector, colors} = fillColor;
    if(vector.length === 4) {
      vector = [vector[0] + vectorOffset[0], vector[1] + vectorOffset[1], vector[2] + vectorOffset[0], vector[3] + vectorOffset[1]];
      mesh.setLinearGradient({vector, colors, type: 'fill'});
    } else if(vector.length === 3) {
      vector = [vector[0] + vectorOffset[0],
        vector[1] + vectorOffset[1],
        vector[2]];
      mesh.setCircularGradient({vector, colors, type: 'fill'});
    } else {
      vector = [vector[0] + vectorOffset[0],
        vector[1] + vectorOffset[1],
        vector[2],
        vector[3] + vectorOffset[0],
        vector[4] + vectorOffset[1],
        vector[5]];
      mesh.setRadialGradient({vector, colors, type: 'fill'});
    }
  } else {
    if(mesh.gradient) {
      if(mesh.gradient.fill) {
        delete mesh.gradient.fill;
        delete mesh.uniforms.u_radialGradientVector;
      }
    }
    mesh.setFill({
      color: fillColor,
    });
  }
  return mesh;
}

export function setStrokeColor(mesh,
  {color: strokeColor, lineWidth, lineCap, lineJoin, lineDash, lineDashOffset, miterLimit}) {
  if(strokeColor.vector) {
    // gradient
    const vectorOffset = mesh.boundingBox[0];
    let {vector, colors} = strokeColor;
    if(vector.length === 4) {
      vector = [vector[0] + vectorOffset[0], vector[1] + vectorOffset[1], vector[2] + vectorOffset[0], vector[3] + vectorOffset[1]];
      mesh.setLinearGradient({vector, colors, type: 'stroke'});
    } else if(vector.length === 3) {
      vector = [vector[0] + vectorOffset[0],
        vector[1] + vectorOffset[1],
        vector[2]];
      mesh.setCircularGradient({vector, colors, type: 'stroke'});
    } else {
      vector = [vector[0] + vectorOffset[0],
        vector[1] + vectorOffset[1],
        vector[2],
        vector[3] + vectorOffset[0],
        vector[4] + vectorOffset[1],
        vector[5]];
      mesh.setRadialGradient({vector, colors, type: 'stroke'});
    }
    strokeColor = [0, 0, 0, 1];
  } else if(mesh.gradient) {
    if(mesh.gradient.stroke) {
      delete mesh.gradient.stroke;
      delete mesh.uniforms.u_radialGradientVector;
    }
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