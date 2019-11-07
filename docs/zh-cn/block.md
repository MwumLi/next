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

```js
const {Scene, Label} = spritejs;
const container = document.getElementById('adaptive');
const scene = new Scene({
  container,
  width: 600,
  height: 360,
  // contextType: '2d',
});
const layer = scene.layer();

const box = new Label({
  text: 'SpriteJS',
  fontSize: '2rem',
  anchor: [0.5, 0.5],
  pos: [300, 180],
  bgcolor: 'white',
  borderWidth: 1,
  padding: 25,
});
layer.append(box);
```

## 盒子 box-sizing

与HTML元素类似，块元素可以通过修改box-sizing来设置元素宽高的计算方式。

![](https://p3.ssl.qhimg.com/t01e3c080702b26edd8.jpg)

如图所示，一个块元素有四个“宽高”，分别是：

- contentSize 内容的宽高
- clientSize 内容的宽高+padding
- borderSize 内容的宽高+padding+border的一半
- offsetSize 内容的宽高+padding+border

当`box-sizing`值为`content-size`（默认值）时，元素的width和height属性分别为：

```
el.attribute.width = contentSize[0];
el.attribute.height = contentSize[1];
```

当`box-sizing`值为`border-size`时，元素的width和height属性分别为：

```
el.attribute.width = offsetSize[0];
el.attribute.width = offsetSize[1];
```

## 精灵 Sprite

Sprite元素是最常用的块元素，它可以设置`texture`属性。与旧版SpriteJS不同，旧版SpriteJS可以设置`textures`属性指定多张图片，新版 SpriteJS <sup>Next</sup> 则只能设置一张图片。

除了设置`texture`外，还可以设置`sourceRect`来剪裁图片，或者设置`textureRect`来将图片显示在精灵的指定位置。

如果要重复显示图片，可以设置精灵的`textureRepeat`属性为true，这个可以用来实现类似HTML中的平铺背景。

```js
const {Scene, Sprite} = spritejs;
const container = document.getElementById('adaptive');
const imgUrl = 'https://p5.ssl.qhimg.com/t01a2bd87890397464a.png';
const scene = new Scene({
  container,
  width: 1200,
  height: 600,
});
const layer = scene.layer();

const s1 = new Sprite({
  anchor: [0, 0.5],
  pos: [20, 300],
  bgcolor: 'white',
  borderWidth: 1,
  borderRadius: 20,
  texture: imgUrl,
});
layer.append(s1);

const srcParts = [
  [0, 0, 190, 268],
  [0, 269, 190, 268],
  [191, 0, 190, 268],
  [191, 269, 190, 268],
];
for(let i = 0; i < 2; i++) {
  for(let j = 0; j < 2; j++) {
    const sourceRect = srcParts[i * 2 + j];
    const x = 360 + i * 200;
    const y = j * 278;
    const s = new Sprite({
      x,
      y,
      texture: imgUrl,
      sourceRect,
    });
    layer.append(s);
  }
}

const s2 = new Sprite({
  anchor: [0, 0.5],
  pos: [720, 300],
  bgcolor: 'white',
  borderWidth: 1,
  borderRadius: 20,
  texture: imgUrl,
  textureRect: [0, 0, 190, 268],
  textureRepeat: true,
});

layer.append(s2);
```

