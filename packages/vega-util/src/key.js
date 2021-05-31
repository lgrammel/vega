import accessor from './accessor';
import array from './array';
import getter from './getter';
import splitAccessPath from './splitAccessPath';

export default function(fields, flat, opt) {
  if (fields) {
    fields = flat
      ? array(fields).map(f => f.replace(/\\(.)/g, '$1'))
      : array(fields);
  }

  const len = fields && fields.length,
        gen = opt && opt.get || getter,
        map = f => gen(flat ? [f] : splitAccessPath(f));
  let fn;

  if (!len) {
    fn = () => '';
  } else if (len === 1) {
    const get = map(fields[0]);
    fn = _ => '' + get(_);
  } else {
    const get = fields.map(map);
    fn = _ => {
      let s = '' + get[0](_), i = 0;
      while (++i < len) s += '|' + get[i](_);
      return s;
    };
  }

  return accessor(fn, fields, 'key');
}
