var tape = require('tape');
var format = require('vega-format');
var {monthAbbrevFormat} = require('../');

tape('monthAbbrevFormat returns empty string for non-integer values', t => {
  const locale = format.defaultLocale();
  const self = { context: { dataflow: { locale: () => locale } } };
  const abbrev = monthAbbrevFormat.bind(self);

  t.equal(abbrev(0), 'Jan');
  t.equal(abbrev(NaN), '');
  t.equal(abbrev(1.1), '');
  t.equal(abbrev('Missing'), '');
  t.equal(abbrev(1), 'Feb');
  t.end();
});
