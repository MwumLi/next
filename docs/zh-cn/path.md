## 路径元素

SpriteJS <sup>Next</sup> 的路径元素不同于块元素，块元素更类似于HTML的inline-block元素，而路径元素则更类似于SVG。

路径元素包括以下元素：

- Arc 圆弧与扇形
- Ellipse 椭圆弧与椭圆扇形
- Parallel 平行四边形
- Path SVG路径
- Polyline 折线与多边形
- Rect 矩形
- Regular 正多边形
- Ring 圆环
- Star 多角星

## 路径 path

与块元素不同，路径元素没有`anchor、border、padding、boxSizing`等属性。

Path是最基础的路径元素，它可以通过设置`d`属性来绘制SVG Path。

