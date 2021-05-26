import {points} from './points';
import rSquared from './r-squared';

export default function(data, x, y) {
  const [xv, yv, ux, uy] = points(data, x, y);
  const n = xv.length;

  let X2 = 0;
  let X3 = 0;
  let X4 = 0;
  let XY = 0;
  let X2Y = 0;
  let i;
  let dx;
  let dy;
  let x2;

  for (i=0; i<n;) {
    dx = xv[i];
    dy = yv[i++];
    x2 = dx * dx;
    X2 += (x2 - X2) / i;
    X3 += (x2 * dx - X3) / i;
    X4 += (x2 * x2 - X4) / i;
    XY += (dx * dy - XY) / i;
    X2Y += (x2 * dy - X2Y) / i;
  }

  const X2X2 = X4 - (X2 * X2);
  const d = (X2 * X2X2 - X3 * X3);
  const a = (X2Y * X2 - XY * X3) / d;
  const b = (XY * X2X2 - X2Y * X3) / d;
  const c = -a * X2;
  const predict = x => {
    x = x - ux;
    return a * x * x + b * x + c + uy;
  };

  // transform coefficients back from mean-centered space
  return {
    coef: [
      c - b * ux + a * ux * ux + uy,
      b - 2 * a * ux,
      a
    ],
    predict: predict,
    rSquared: rSquared(data, x, y, uy, predict)
  };
}
