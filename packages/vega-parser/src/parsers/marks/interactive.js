export default function(spec, scope) {
  return spec?.signal ? scope.signalRef(spec.signal)
    : spec === false ? false
    : true;
}
