## 外部时钟

SpriteJS <sup>Next</sup> 有自己的内容更新机制，只要layer中的元素的属性有变化，layer就会将该元素放到等待刷新的列表中，在下一个渲染周期内刷新。

不过，SpriteJS可以使用外部时钟进行更新。这使得它对很多第三方库非常友好。

SpriteJS要指定layer使用外部时钟，可以手动调用layer的`render`方法，同时要屏蔽掉layer自己的更新机制，可以在创建layer的时候指定选项`{autoRender:false}`。

