import color from './color';

export default function(context, item, opacity) {
  opacity *= (item.fillOpacity ?? 1);
  if (opacity > 0) {
    context.globalAlpha = opacity;
    context.fillStyle = color(context, item, item.fill);
    return true;
  } else {
    return false;
  }
}
