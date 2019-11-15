## Pointer 事件

在[基础用法：事件](/zh-cn/event#事件)里，我们介绍了sprite事件的基本原理和用法。

在 SpriteJS <sup>Next</sup> 里，元素的事件点击区域是由 `isPointCollision(x, y)` 方法决定的，我们可以通过改写它，来改变元素事件可点击区域。

这个方法的改写会影响所有的鼠标和touch事件判定。

## 其他事件

在 SpriteJS <sup>Next</sup> 里，除了Pointer事件，还有一些默认的绘图和其他事件，主要有：

- beforerender 元素开始绘制
- afterrender 元素结束绘制
- preload Scene加载资源

其中preload前面我们已经见过，这里我们看一下 beforerender 和 afterrender 的用法。

## 自定义事件

## 事件穿透

## 不派发事件

