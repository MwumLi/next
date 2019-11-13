## 图片的异步加载

spritejs支持图片URL作为资源，我们前面已经看过，我们可以把URL作为texture直接传给Sprite的textures属性。但是，因为网络图片资源是异步加载的，这会可能导致sprite的异步显示以及我们拿到的sprite的contentSize为0。

```js
const {Scene, Sprite, Label} = spritejs;
const container = document.getElementById('adaptive');
const scene = new Scene({
  container,
  width: 1200,
  height: 600,
  // contextType: '2d',
});
const layer = scene.layer();

const robot = new Sprite('https://p5.ssl.qhimg.com/t01c33383c0e168c3c4.png');
robot.attr({
  anchor: [0.5, 0.5],
  pos: [600, 300],
  scale: 0.5,
});

layer.append(robot);

const label = new Label(`图片大小： ${robot.contentSize}`);
label.attr({
  anchor: [0.5, 0.5],
  pos: [600, 100],
  font: '36px Arial',
});

layer.append(label);
```

获取图片大小之所以为0，是因为当我们把label添加到layer上的时候，图片还没有完成加载，因此此时的sprite里没有内容来撑开宽高，所以得到的大小就是0。

scene提供了`preload`方法来预加载和保存图片资源。这个方法可以接受一个或多个图片数据，返回一个promise对象。

```js
const {Scene, Sprite, Label} = spritejs;
const container = document.getElementById('adaptive');
const scene = new Scene({
  container,
  width: 1200,
  height: 600,
  // contextType: '2d',
});
const layer = scene.layer();

(async function () {
  await scene.preload({
    id: 'robot',
    src: 'https://p5.ssl.qhimg.com/t01c33383c0e168c3c4.png',
  });

  const robot = new Sprite('robot');
  robot.attr({
    anchor: [0.5, 0.5],
    pos: [600, 300],
    scale: 0.5,
  });
  layer.append(robot);

  const label = new Label(`图片大小： ${robot.contentSize}`);
  label.attr({
    anchor: [0.5, 0.5],
    pos: [600, 100],
    font: '36px Arial',
  });
  layer.append(label);
}());
```

我们通过preload事先预加载并缓存了图片，所以我们使用id:'robot'来创建sprite时，就可以立即显示出来，并得到contentSize。

## 雪碧图

与css雪碧图一样，SpriteJS <sup>Next</sup> 也支持雪碧图。SpriteJS <sup>Next</sup> 支持[texture packer](https://www.codeandweb.com/texturepacker)生成的标准JSON雪碧图。

```js
const {Scene, Sprite, Group} = spritejs;
const container = document.getElementById('adaptive');
const scene = new Scene({
  container,
  width: 1200,
  height: 600,
  // contextType: '2d',
});
const layer = scene.layer();

(async function () {
  const earthPNG = 'https://p3.ssl.qhimg.com/t01806718065fe97c65.png',
    earthJSON = 'https://s3.ssl.qhres.com/static/d479c28f553c6cff.json';

  await scene.preload([earthPNG, earthJSON]);

  const group = new Group();
  group.attr({
    pos: [455, 215],
  });

  const earth = new Sprite();
  earth.attr({
    texture: 'earth_blue.png',
    pos: [115, 115],
    anchor: [0.5, 0.5],
  });
  const earthShadow = new Sprite();
  earthShadow.attr({
    texture: 'earth_shadow2.png',
    pos: [0, 0],
  });

  group.append(earth, earthShadow);
  layer.append(group);

  earth.animate([
    {rotate: 0, texture: 'earth_blue.png'},
    {rotate: 360, texture: 'earth_yellow.png'},
    {rotate: 720, texture: 'earth_green.png'},
    {rotate: 1080, texture: 'earth_white.png'},
    {rotate: 1440, texture: 'earth_blue.png'},
  ], {
    duration: 20000,
    iterations: Infinity,
  });
}());
```

使用雪碧图可以有效减少HTTP请求，从而提高响应速度。

## 批量资源预加载进度

有时候，我们要预加载大量的资源，此时我们可以在preload的时候显示一个进度。