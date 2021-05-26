import quartiles from './quartiles';
import {deviation} from 'd3-array';

// Scott, D. W. (1992) Multivariate Density Estimation:
// Theory, Practice, and Visualization. Wiley.
export default function(array, f) {
  const n = array.length;
  const d = deviation(array, f);
  const q = quartiles(array, f);
  const h = (q[2] - q[0]) / 1.34;
  const v = Math.min(d, h) || d || Math.abs(q[0]) || 1;
  return 1.06 * v * Math.pow(n, -0.2);
}
