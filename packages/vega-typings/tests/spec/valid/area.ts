import { Spec } from "vega";

export const spec: Spec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  width: 500,
  height: 200,
  padding: 5,

  signals: [
    {
      name: "curve",
      value: "monotone",
      bind: {
        input: "select",
        options: [
          "basis",
          "cardinal",
          "catmull-rom",
          "linear",
          "monotone",
          "natural",
          "step",
          "step-after",
          "step-before",
        ],
      },
    },
  ],

  data: [
    {
      name: "table",
      values: [
        { u: 1, v: 28 },
        { u: 2, v: 55 },
        { u: 3, v: 43 },
        { u: 4, v: 91 },
        { u: 5, v: 81 },
        { u: 6, v: 53 },
        { u: 7, v: 19 },
        { u: 8, v: 87 },
        { u: 9, v: 52 },
        { u: 10, v: 48 },
        { u: 11, v: 24 },
        { u: 12, v: 49 },
        { u: 13, v: 87 },
        { u: 14, v: 66 },
        { u: 15, v: 17 },
        { u: 16, v: 27 },
        { u: 17, v: 68 },
        { u: 18, v: 16 },
        { u: 19, v: 49 },
        { u: 20, v: 15 },
      ],
    },
  ],

  scales: [
    {
      name: "xscale",
      type: "linear",
      range: "width",
      zero: false,
      domain: { data: "table", field: "u" },
    },
    {
      name: "yscale",
      type: "linear",
      range: "height",
      nice: true,
      zero: true,
      domain: { data: "table", field: "v" },
    },
  ],

  axes: [
    { orient: "bottom", scale: "xscale", tickCount: 20, zindex: 1 },
    { orient: "left", scale: "yscale", zindex: 1 },
  ],

  marks: [
    {
      type: "area",
      from: { data: "table" },
      encode: {
        enter: {
          x: { scale: "xscale", field: "u" },
          y: { scale: "yscale", field: "v" },
          y2: { scale: "yscale", value: 0 },
          fill: { value: "steelblue" },
        },
        update: {
          interpolate: { signal: "curve" },
          fillOpacity: { value: 1 },
        },
        hover: {
          fillOpacity: { value: 0.5 },
        },
      },
    },
  ],
};
