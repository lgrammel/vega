import { Spec } from "vega";

export const spec: Spec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  width: 960,
  autosize: "none",

  scales: [
    {
      name: "color",
      type: "linear",
      domain: [90, 190],
      range: { scheme: "blueorange" },
    },
  ],

  marks: [
    {
      type: "path",
      from: { data: "contours" },
      encode: {
        enter: {
          stroke: { value: "#ccc" },
          strokeWidth: { value: 1 },
          fill: { scale: "color", field: "contour.value" },
        },
      },
      transform: [
        {
          type: "geopath",
          field: "datum.contour",
        },
      ],
    },
  ],

  data: [
    {
      name: "volcano",
      url: "data/volcano.json",
    },
    {
      name: "contours",
      source: "volcano",
      transform: [
        {
          type: "isocontour",
          scale: { expr: "width / datum.width" },
          smooth: { signal: "smooth" },
          thresholds: { signal: "sequence(90, 195, 5)" },
        },
      ],
    },
  ],

  signals: [
    {
      name: "grid",
      init: "data('volcano')[0]",
    },
    {
      name: "height",
      update: "round(grid.height * width / grid.width)",
    },
    {
      name: "smooth",
      value: true,
      bind: { input: "radio", options: [true, false] },
    },
  ],
};
