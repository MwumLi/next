import _createText from '@mesh.js/core/src/utils/create-text';

const cacheMap = {};

export default async function createText(text, {font, fillColor, strokeColor}) {
  const key = [text, font, String(fillColor), String(strokeColor)].join('###');
  let ret = cacheMap[key];
  if(ret) return ret;
  ret = await _createText(text, {font, fillColor, strokeColor});
  cacheMap[key] = ret;
  return ret;
}