export default function Bounds(b) {
  this.clear();
  if (b) this.union(b);
}

Bounds.prototype = {
  clone() {
    return new Bounds(this);
  },

  clear() {
    this.x1 = +Number.MAX_VALUE;
    this.y1 = +Number.MAX_VALUE;
    this.x2 = -Number.MAX_VALUE;
    this.y2 = -Number.MAX_VALUE;
    return this;
  },

  empty() {
    return (
      this.x1 === +Number.MAX_VALUE &&
      this.y1 === +Number.MAX_VALUE &&
      this.x2 === -Number.MAX_VALUE &&
      this.y2 === -Number.MAX_VALUE
    );
  },

  equals(b) {
    return (
      this.x1 === b.x1 &&
      this.y1 === b.y1 &&
      this.x2 === b.x2 &&
      this.y2 === b.y2
    );
  },

  set(x1, y1, x2, y2) {
    if (x2 < x1) {
      this.x2 = x1;
      this.x1 = x2;
    } else {
      this.x1 = x1;
      this.x2 = x2;
    }
    if (y2 < y1) {
      this.y2 = y1;
      this.y1 = y2;
    } else {
      this.y1 = y1;
      this.y2 = y2;
    }
    return this;
  },

  add(x, y) {
    if (x < this.x1) this.x1 = x;
    if (y < this.y1) this.y1 = y;
    if (x > this.x2) this.x2 = x;
    if (y > this.y2) this.y2 = y;
    return this;
  },

  expand(d) {
    this.x1 -= d;
    this.y1 -= d;
    this.x2 += d;
    this.y2 += d;
    return this;
  },

  round() {
    this.x1 = Math.floor(this.x1);
    this.y1 = Math.floor(this.y1);
    this.x2 = Math.ceil(this.x2);
    this.y2 = Math.ceil(this.y2);
    return this;
  },

  scale(s) {
    this.x1 *= s;
    this.y1 *= s;
    this.x2 *= s;
    this.y2 *= s;
    return this;
  },

  translate(dx, dy) {
    this.x1 += dx;
    this.x2 += dx;
    this.y1 += dy;
    this.y2 += dy;
    return this;
  },

  rotate(angle, x, y) {
    const p = this.rotatedPoints(angle, x, y);
    return this.clear()
      .add(p[0], p[1])
      .add(p[2], p[3])
      .add(p[4], p[5])
      .add(p[6], p[7]);
  },

  rotatedPoints(angle, x, y) {
    const {x1, y1, x2, y2} = this,
          cos = Math.cos(angle),
          sin = Math.sin(angle),
          cx = x - x * cos + y * sin,
          cy = y - x * sin - y * cos;

    return [
      cos * x1 - sin * y1 + cx, sin * x1 + cos * y1 + cy,
      cos * x1 - sin * y2 + cx, sin * x1 + cos * y2 + cy,
      cos * x2 - sin * y1 + cx, sin * x2 + cos * y1 + cy,
      cos * x2 - sin * y2 + cx, sin * x2 + cos * y2 + cy
    ];
  },

  union(b) {
    if (b.x1 < this.x1) this.x1 = b.x1;
    if (b.y1 < this.y1) this.y1 = b.y1;
    if (b.x2 > this.x2) this.x2 = b.x2;
    if (b.y2 > this.y2) this.y2 = b.y2;
    return this;
  },

  intersect(b) {
    if (b.x1 > this.x1) this.x1 = b.x1;
    if (b.y1 > this.y1) this.y1 = b.y1;
    if (b.x2 < this.x2) this.x2 = b.x2;
    if (b.y2 < this.y2) this.y2 = b.y2;
    return this;
  },

  encloses(b) {
    return b && (
      this.x1 <= b.x1 &&
      this.x2 >= b.x2 &&
      this.y1 <= b.y1 &&
      this.y2 >= b.y2
    );
  },

  alignsWith(b) {
    return b && (
      this.x1 == b.x1 ||
      this.x2 == b.x2 ||
      this.y1 == b.y1 ||
      this.y2 == b.y2
    );
  },

  intersects(b) {
    return b && !(
      this.x2 < b.x1 ||
      this.x1 > b.x2 ||
      this.y2 < b.y1 ||
      this.y1 > b.y2
    );
  },

  contains(x, y) {
    return !(
      x < this.x1 ||
      x > this.x2 ||
      y < this.y1 ||
      y > this.y2
    );
  },

  width() {
    return this.x2 - this.x1;
  },

  height() {
    return this.y2 - this.y1;
  }
};
