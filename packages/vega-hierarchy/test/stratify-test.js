var tape = require('tape');
var field = require('vega-util').field;
var vega = require('vega-dataflow');
var changeset = vega.changeset;
var Collect = require('vega-transforms').collect;
var Stratify = require('../').stratify;

tape('Stratify tuples', t => {
  const data = [
    {id: 'a'},
    {id: 'b', pid: 'a'},
    {id: 'c', pid: 'a'},
    {id: 'd', pid: 'c'}
  ];

  // Setup tree stratification
  var df = new vega.Dataflow();
  var collect = df.add(Collect);

  var nest = df.add(Stratify, {
    key: field('id'),
    parentKey: field('pid'),
    pulse: collect
  });

  var out = df.add(Collect, {pulse: nest});

  // build tree
  df.pulse(collect, changeset().insert(data)).run();
  t.deepEqual(out.value.slice(), data);
  var root = out.value.root;
  t.equal(root.data, data[0]);
  t.equal(root.children[0].data, data[1]);
  t.equal(root.children[1].data, data[2]);
  t.equal(root.children[1].children[0].data, data[3]);
  t.equal(Object.keys(root.lookup).length, data.length);

  t.end();
});

tape('Stratify empty data', t => {
  // Setup tree stratification
  var df = new vega.Dataflow();
  var collect = df.add(Collect);

  var nest = df.add(Stratify, {
    key: field('id'),
    parentKey: field('pid'),
    pulse: collect
  });

  var out = df.add(Collect, {pulse: nest});

  df.pulse(collect, changeset().insert([])).run();
  t.equal(out.value.length, 0);
  var root = out.value.root;
  t.equal(root.children, undefined);
  t.deepEqual(root.lookup, {});

  t.end();
});
