import { Spec } from "vega";

export const spec: Spec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  width: 400,
  height: 100,
  padding: 5,

  data: [
    {
      name: "aggregate",
      values: [
        { label: "Category A", mean: 1, lo: 0, hi: 2 },
        { label: "Category B", mean: 2, lo: 1.5, hi: 2.5 },
        { label: "Category C", mean: 3, lo: 1.7, hi: 4.3 },
        { label: "Category D", mean: 4, lo: 3, hi: 5 },
        { label: "Category E", mean: 5, lo: 4.1, hi: 5.9 },
      ],
    },
  ],

  scales: [
    {
      name: "y",
      type: "band",
      range: "height",
      domain: { data: "aggregate", field: "label" },
    },
    {
      name: "x",
      type: "linear",
      domain: { data: "aggregate", field: "hi" },
      range: [100, 400],
      nice: true,
      zero: true,
    },
  ],

  axes: [{ orient: "bottom", scale: "x", tickCount: 6 }],

  marks: [
    {
      type: "text",
      from: { data: "aggregate" },
      encode: {
        enter: {
          x: { value: 0 },
          y: { scale: "y", field: "label" },
          baseline: { value: "middle" },
          fill: { value: "#000" },
          text: { field: "label" },
          font: { value: "Helvetica Neue" },
          fontSize: { value: 13 },
        },
      },
    },
    {
      type: "rect",
      from: { data: "aggregate" },
      encode: {
        enter: {
          x: { scale: "x", field: "lo" },
          x2: { scale: "x", field: "hi" },
          y: { scale: "y", field: "label", offset: -1 },
          height: { value: 1 },
          fill: { value: "#888" },
        },
      },
    },
    {
      type: "symbol",
      from: { data: "aggregate" },
      encode: {
        enter: {
          x: { scale: "x", field: "mean" },
          y: { scale: "y", field: "label" },
          size: { value: 40 },
          fill: { value: "#000" },
        },
      },
    },
  ],
};
