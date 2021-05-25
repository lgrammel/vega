import { Spec } from "vega";

export const spec: Spec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  width: 500,
  height: 200,
  padding: 5,

  data: [
    {
      name: "table",
      values: [
        { x: 0, y: 28, c: 0 },
        { x: 0, y: 55, c: 1 },
        { x: 1, y: 43, c: 0 },
        { x: 1, y: 91, c: 1 },
        { x: 2, y: 81, c: 0 },
        { x: 2, y: 53, c: 1 },
        { x: 3, y: 19, c: 0 },
        { x: 3, y: 87, c: 1 },
        { x: 4, y: 52, c: 0 },
        { x: 4, y: 48, c: 1 },
        { x: 5, y: 24, c: 0 },
        { x: 5, y: 49, c: 1 },
        { x: 6, y: 87, c: 0 },
        { x: 6, y: 66, c: 1 },
        { x: 7, y: 17, c: 0 },
        { x: 7, y: 27, c: 1 },
        { x: 8, y: 68, c: 0 },
        { x: 8, y: 16, c: 1 },
        { x: 9, y: 49, c: 0 },
        { x: 9, y: 15, c: 1 },
      ],
      transform: [
        {
          type: "stack",
          groupby: ["x"],
          sort: { field: "c" },
          field: "y",
        },
      ],
    },
  ],

  scales: [
    {
      name: "x",
      type: "point",
      range: "width",
      domain: { data: "table", field: "x" },
    },
    {
      name: "y",
      type: "linear",
      range: "height",
      nice: true,
      zero: true,
      domain: { data: "table", field: "y1" },
    },
    {
      name: "color",
      type: "ordinal",
      range: "category",
      domain: { data: "table", field: "c" },
    },
  ],

  axes: [
    { orient: "bottom", scale: "x", zindex: 1 },
    { orient: "left", scale: "y", zindex: 1 },
  ],

  marks: [
    {
      type: "group",
      from: {
        facet: {
          name: "series",
          data: "table",
          groupby: "c",
        },
      },
      marks: [
        {
          type: "area",
          from: { data: "series" },
          encode: {
            enter: {
              interpolate: { value: "monotone" },
              x: { scale: "x", field: "x" },
              y: { scale: "y", field: "y0" },
              y2: { scale: "y", field: "y1" },
              fill: { scale: "color", field: "c" },
            },
            update: {
              fillOpacity: { value: 1 },
            },
            hover: {
              fillOpacity: { value: 0.5 },
            },
          },
        },
      ],
    },
  ],
};
