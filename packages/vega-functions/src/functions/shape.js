import {getScale} from '../scales';
import {pathParse, pathRender} from 'vega-scenegraph';

export function geoShape(projection, geojson, group) {
  const p = getScale(projection, (group || this).context);
  return context => p ? p.path.context(context)(geojson) : '';
}

export function pathShape(path) {
  let p = null;
  return context => context
    ? pathRender(context, (p = p || pathParse(path)))
    : path;
}
