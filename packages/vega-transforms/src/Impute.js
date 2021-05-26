import {Transform, ingest} from 'vega-dataflow';
import {accessorName, error, inherits} from 'vega-util';
import {max, mean, median, min} from 'd3-array';

const Methods = {
  value: 'value',
  median: median,
  mean: mean,
  min: min,
  max: max
};

const Empty = [];

/**
 * Impute missing values.
 * @constructor
 * @param {object} params - The parameters for this operator.
 * @param {function(object): *} params.field - The value field to impute.
 * @param {Array<function(object): *>} [params.groupby] - An array of
 *   accessors to determine series within which to perform imputation.
 * @param {function(object): *} params.key - An accessor for a key value.
 *   Each key value should be unique within a group. New tuples will be
 *   imputed for any key values that are not found within a group.
 * @param {Array<*>} [params.keyvals] - Optional array of required key
 *   values. New tuples will be imputed for any key values that are not
 *   found within a group. In addition, these values will be automatically
 *   augmented with the key values observed in the input data.
 * @param {string} [method='value'] - The imputation method to use. One of
 *   'value', 'mean', 'median', 'max', 'min'.
 * @param {*} [value=0] - The constant value to use for imputation
 *   when using method 'value'.
 */
export default function Impute(params) {
  Transform.call(this, [], params);
}

Impute.Definition = {
  'type': 'Impute',
  'metadata': {'changes': true},
  'params': [
    { 'name': 'field', 'type': 'field', 'required': true },
    { 'name': 'key', 'type': 'field', 'required': true },
    { 'name': 'keyvals', 'array': true },
    { 'name': 'groupby', 'type': 'field', 'array': true },
    { 'name': 'method', 'type': 'enum', 'default': 'value',
      'values': ['value', 'mean', 'median', 'max', 'min'] },
    { 'name': 'value', 'default': 0 }
  ]
};

function getValue(_) {
  var m = _.method || Methods.value;

  var v;

  if (Methods[m] == null) {
    error('Unrecognized imputation method: ' + m);
  } else if (m === Methods.value) {
    v = _.value !== undefined ? _.value : 0;
    return () => v;
  } else {
    return Methods[m];
  }
}

function getField(_) {
  const f = _.field;
  return t => t ? f(t) : NaN;
}

inherits(Impute, Transform, {
  transform(_, pulse) {
    var out = pulse.fork(pulse.ALL);

    var impute = getValue(_);
    var field = getField(_);
    var fName = accessorName(_.field);
    var kName = accessorName(_.key);
    var gNames = (_.groupby || []).map(accessorName);
    var groups = partition(pulse.source, _.groupby, _.key, _.keyvals);
    var curr = [];
    var prev = this.value;
    var m = groups.domain.length;
    var group;
    var value;
    var gVals;
    var kVal;
    var g;
    var i;
    var j;
    var l;
    var n;
    var t;

    for (g=0, l=groups.length; g<l; ++g) {
      group = groups[g];
      gVals = group.values;
      value = NaN;

      // add tuples for missing values
      for (j=0; j<m; ++j) {
        if (group[j] != null) continue;
        kVal = groups.domain[j];

        t = {_impute: true};
        for (i=0, n=gVals.length; i<n; ++i) t[gNames[i]] = gVals[i];
        t[kName] = kVal;
        t[fName] = Number.isNaN(value) ? (value = impute(group, field)) : value;

        curr.push(ingest(t));
      }
    }

    // update pulse with imputed tuples
    if (curr.length) out.add = out.materialize(out.ADD).add.concat(curr);
    if (prev.length) out.rem = out.materialize(out.REM).rem.concat(prev);
    this.value = curr;

    return out;
  }
});

function partition(data, groupby, key, keyvals) {
  var get = f => f(t);

  var groups = [];
  var domain = keyvals ? keyvals.slice() : [];
  var kMap = {};
  var gMap = {};
  var gVals;
  var gKey;
  var group;
  var i;
  var j;
  var k;
  var n;
  var t;

  domain.forEach((k, i) => kMap[k] = i + 1);

  for (i=0, n=data.length; i<n; ++i) {
    t = data[i];
    k = key(t);
    j = kMap[k] || (kMap[k] = domain.push(k));

    gKey = (gVals = groupby ? groupby.map(get) : Empty) + '';
    if (!(group = gMap[gKey])) {
      group = (gMap[gKey] = []);
      groups.push(group);
      group.values = gVals;
    }
    group[j-1] = t;
  }

  groups.domain = domain;
  return groups;
}
