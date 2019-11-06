## 块元素

块元素是指有外盒（outer box）和内容盒（content box）的元素。

SpriteJS <sup>Next</sup>的块元素继承基类`Block`，主要有`Sprite、Label、Group`三大类。

## 锚点（anchor）

与旧版的SpriteJS一样，块元素可以设置不同的`anchor`值，用来表示参考点，`anchor`值的变化会影响块元素的定位和默认的`transformOrigin`。

