const {Scene, Sprite} = spritejs;
const container = document.getElementById('stage');
const imgUrl = 'https://p5.ssl.qhimg.com/t01a2bd87890397464a.png';
const scene = new Scene({
  container,
  width: 1200,
  height: 600,
  // contextType: '2d',
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