## 过度 Transition

如果我们要给元素增加一些简单的效果，可以通过transition来完成，只要在设置和改变元素的属性前调用transition方法，传入时间和可选的easing参数即可。transition的easing支持css3的easing。

```js
const {Scene, Arc} = spritejs;
const container = document.getElementById('adaptive');
const scene = new Scene({
  container,
  width: 1200,
  height: 600,
});
const layer = scene.layer();

async function createBubble() {
  const x = 100 + Math.random() * 1000,
    y = 100 + Math.random() * 400;
  const r = Math.round(255 * Math.random()),
    g = Math.round(255 * Math.random()),
    b = Math.round(255 * Math.random());

  const fillColor = `rgb(${r},${g},${b})`;
  const bubble = new Arc();
  bubble.attr({
    fillColor,
    radius: 25,
    x,
    y,
  });
  layer.append(bubble);
  await bubble.transition(2.0).attr({
    scale: [2.0, 2.0],
    opacity: 0,
  });
  bubble.remove();
}

setInterval(() => {
  createBubble();
}, 50);
```

`sprite.transition(...)` 返回一个特殊对象（并不是原来的sprite对象），当我们调用`.attr`方法对它进行属性设置时，它创建一个属性动画。当我们再次对它进行属性设置时，它会结束上一次的动画进入下一段动画，这样我们就可以平滑地进行状态切换。此外我们可以通过调用`.reverse`方法来让当前transition状态回滚。

```js
const {Scene, Sprite, Label} = spritejs;
const container = document.getElementById('adaptive');
const scene = new Scene({
  container,
  width: 1200,
  height: 600,
});
const layer = scene.layer();

const label = new Label('试试将鼠标移动到左右两个方块上：');
label.attr({
  anchor: 0.5,
  pos: [400, 50],
  fontSize: '2rem',
});
layer.append(label);

const left = new Sprite();
left.attr({
  anchor: 0.5,
  pos: [300, 300],
  size: [200, 200],
  bgcolor: 'red',
});
layer.append(left);

const right = left.cloneNode();
right.attr({
  pos: [700, 300],
  bgcolor: 'green',
});
layer.append(right);

let leftTrans = null;
left.addEventListener('mouseenter', (evt) => {
  if(leftTrans) leftTrans.cancel();
  leftTrans = left.transition(1.0);
  leftTrans.attr({
    rotate: 180,
    bgcolor: 'green',
  });
});
left.addEventListener('mouseleave', (evt) => {
  leftTrans.attr({
    rotate: 0,
    bgcolor: 'red',
  });
});

let rightTrans = null;
right.addEventListener('mouseenter', (evt) => {
  if(rightTrans) rightTrans.cancel();
  rightTrans = right.transition(3.0);
  rightTrans.attr({
    rotate: 720,
    bgcolor: 'red',
  });
});
right.addEventListener('mouseleave', (evt) => {
  rightTrans.reverse();
});
```

### 动画 Animate

在前面的例子里我们已经看过很多动画的用法。事实上，spritejs支持[Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)，因此可以让精灵使用.animate方法做出各种复杂的组合动画。
