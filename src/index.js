import {Renderer} from '@mesh.js/core';

import Node from './node/node';
import Block from './node/block';
import Sprite from './node/sprite';
import Path from './node/path';
import Rect from './node/rect';
import Triangle from './node/triangle';
import Parallel from './node/parallel';
import Regular from './node/regular';
import Star from './node/star';
import Ellipse from './node/ellipse';
import Arc from './node/arc';
import Ring from './node/ring';
import Polyline from './node/polyline';
import Label from './node/label';
import Group from './node/group';
import Layer from './node/layer';
import Scene from './node/scene';
import ownerDocument from './document';

import {parseColor, Gradient} from './utils/color';

const createElement = ownerDocument.createElement;
const isSpriteNode = ownerDocument.isSpriteNode;
const registerNode = ownerDocument.registerNode;

export {
  Renderer,
  Node,
  Block,
  Sprite,
  Path,
  Rect,
  Triangle,
  Parallel,
  Regular,
  Star,
  Ellipse,
  Arc,
  Ring,
  Polyline,
  Label,
  Group,
  Layer,
  Scene,
  Gradient,
  parseColor,
  createElement,
  isSpriteNode,
  registerNode,
};