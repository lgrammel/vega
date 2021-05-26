import Bounds from '../Bounds';
import boundItem from './boundItem';
import marks from '../marks/index';

var DUMMY = {mark: null};

export default function(mark, bounds, opt) {
  var type  = marks[mark.marktype];

  var bound = type.bound;
  var items = mark.items;
  var hasItems = items && items.length;
  var i;
  var n;
  var item;
  var b;

  if (type.nested) {
    if (hasItems) {
      item = items[0];
    } else {
      // no items, fake it
      DUMMY.mark = mark;
      item = DUMMY;
    }
    b = boundItem(item, bound, opt);
    bounds = bounds && bounds.union(b) || b;
    return bounds;
  }

  bounds = bounds
    || mark.bounds && mark.bounds.clear()
    || new Bounds();

  if (hasItems) {
    for (i=0, n=items.length; i<n; ++i) {
      bounds.union(boundItem(items[i], bound, opt));
    }
  }

  return mark.bounds = bounds;
}
