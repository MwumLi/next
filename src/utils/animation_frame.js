/* eslint-disable no-undef */
function nowtime() {
  if(typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  } if(typeof process !== 'undefined' && process.hrtime) {
    const [s, ns] = process.hrtime();
    return s * 1e3 + ns * 1e-6;
  }
  return Date.now ? Date.now() : (new Date()).getTime();
}
/* eslint-enable no-undef */

const requestAnimationFrame = typeof global.requestAnimationFrame === 'function'
  ? global.requestAnimationFrame : function (fn) {
    return setTimeout(() => {
      fn(nowtime());
    }, 16);
  };

const cancelAnimationFrame = typeof global.cancelAnimationFrame === 'function'
  ? global.cancelAnimationFrame : function (id) {
    return clearTimeout(id);
  };

export {requestAnimationFrame, cancelAnimationFrame};