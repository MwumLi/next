const {Scene, Label} = spritejs;
const container = document.getElementById('stage');
const scene = new Scene({
  container,
  width: 1200,
  height: 600,
  // contextType: '2d',
});
const layer = scene.layer();

const text1 = new Label('SpriteJS.org');
text1.attr({
  pos: [100, 40],
  fillColor: '#707',
  font: 'oblique small-caps bold 56px Arial',
  border: [2.5, '#ccc'],
});
layer.append(text1);

const text2 = new Label('从前有座灵剑山');
text2.attr({
  pos: [500, 20],
  fillColor: '#077',
  font: '64px "宋体"',
  lineHeight: 112,
  textAlign: 'center',
  padding: [0, 30],
  border: [2.5, '#ccc'],
});
layer.append(text2);

const text3 = new Label('Hello');
text3.attr({
  pos: [100, 240],
  strokeColor: 'red',
  font: 'bold oblique 70px Microsoft Yahei',
  strokeWidth: 1,
  textAlign: 'center',
  padding: [0, 30],
  border: [2.5, '#ccc'],
});
layer.append(text3);

function createClockTexts(text, x, y) {
  const len = text.length;

  for(let i = 0; i < len; i++) {
    const char = text.charAt(i);
    const label = new Label(char);
    label.attr({
      anchor: [0.5, 4.5],
      pos: [x, y],
      font: 'bold 44px Arial',
      fillColor: '#37c',
      rotate: i * 360 / len,
    });

    layer.append(label);
  }
}
createClockTexts('Sprite.js JavaScript Canvas...', 700, 360);