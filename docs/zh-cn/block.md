## 块元素

块元素是指有外盒（outer box）和内容盒（content box）的元素。

SpriteJS <sup>Next</sup>的块元素继承基类`Block`，主要有`Sprite、Label、Group`三大类。

## 锚点 anchor

与旧版的SpriteJS一样，块元素可以设置不同的`anchor`值，用来表示参考点，`anchor`值的变化会影响块元素的定位和默认的`transformOrigin`。

```js
const {Scene, Sprite, Gradient, Path} = spritejs;
const container = document.getElementById('adaptive');
const scene = new Scene({
  container,
  width: 600,
  height: 360,
});
const layer = scene.layer();

const gradient = new Gradient({
  vector: [0, 0, 150, 150],
  colors: [
    {offset: 0, color: 'red'},
    {offset: 1, color: 'green'},
  ],
});

const box = new Sprite({
  anchor: [0.5, 0.5],
  size: [150, 150],
  pos: [300, 180],
  bgcolor: gradient,
});
layer.append(box);

const cross = new Path('M-5 0L5 0M0 5L0 -5');
cross.attr({
  pos: [300, 180],
  lineWidth: 2,
  strokeColor: 'blue',
});
layer.append(cross);

box.animate([
  {rotate: 0},
  {rotate: 360},
], {
  iterations: Infinity,
  duration: 3000,
});
```

## 边框 border

与HTML元素类似，块元素可以设置边框，相关属性包括：

- borderWidth 设置边框的宽度
- borderColor 设置边框的颜色
- borderDash  设置虚线框
- borderDashOffset  设置虚线框偏移量
- borderRadius  设置圆角

```js
const {Scene, Sprite} = spritejs;
const container = document.getElementById('adaptive');
const scene = new Scene({
  container,
  width: 600,
  height: 360,
});
const layer = scene.layer();

const box = new Sprite({
  anchor: [0.5, 0.5],
  size: [150, 150],
  pos: [300, 180],
  bgcolor: 'white',
  borderWidth: 1,
  borderRadius: 20,
});
layer.append(box);
```

## 内边距 padding

与HTML元素类似，块元素可以设置内边距：

- paddingTop
- paddingRight
- paddingBottom
- paddingLeft

## 盒子 box-sizing

与HTML元素类似，通过修改box-sizing来设置元素宽高的计算方式

