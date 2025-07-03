<template>
  <div>
    <div class="toolbox">
    </div>
    <div class="gstc-wrapper" ref="gstc"></div>
  </div>
</template>

<script>
import GSTC from "gantt-schedule-timeline-calendar";
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js";
import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js";
import { Plugin as ItemResizing } from "gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js";
import { Plugin as ItemMovement } from "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js";
import { Plugin as Bookmarks } from "gantt-schedule-timeline-calendar/dist/plugins/time-bookmarks.esm.min.js";
import { Plugin as DependencyLines } from "gantt-schedule-timeline-calendar/dist/plugins/dependency-lines.esm.min.js";
import "gantt-schedule-timeline-calendar/dist/style.css";

const GSTCID = GSTC.api.GSTCID;
const date = GSTC.api.date;

let gstc, state;

// helper functions

function generateRows() {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Rows }
   */
  const rows = {};
  // 项目0
  rows[GSTC.api.GSTCID("0")] = {
    id: GSTC.api.GSTCID("0"),
    parentId: null,
    label: "基本作战单位子项目群",
    unit: "单位1",
    expanded: true,
  };

  // 项目1
  rows[GSTC.api.GSTCID("1")] = {
    id: GSTC.api.GSTCID("1"),
    parentId: GSTC.api.GSTCID("0"),
    label: "条令子项目",
    unit: "单位1",
    expanded: true
  };

  // 项目2
  rows[GSTC.api.GSTCID("2")] = {
    id: GSTC.api.GSTCID("2"),
    parentId: GSTC.api.GSTCID("1"),
    label: "坦克分队作战条令子项目",
    unit: "单位1",
    expanded: true
  };

  // 项目3
  rows[GSTC.api.GSTCID("3")] = {
    id: GSTC.api.GSTCID("3"),
    parentId: GSTC.api.GSTCID("1"),
    label: "装甲步兵分队作战条令子项目",
    unit: "单位1",
    expanded: true
  };

  // 项目4
  rows[GSTC.api.GSTCID("4")] = {
    id: GSTC.api.GSTCID("4"),
    parentId: GSTC.api.GSTCID("1"),
    label: "侦察分队作战条令子项目",
    unit: "单位1",
    expanded: true
  };

  // 项目5
  rows[GSTC.api.GSTCID("5")] = {
    id: GSTC.api.GSTCID("5"),
    parentId: GSTC.api.GSTCID("0"),
    label: "装备子项目",
    unit: "单位2",
    expanded: true
  };

  // 项目6
  rows[GSTC.api.GSTCID("6")] = {
    id: GSTC.api.GSTCID("6"),
    parentId: GSTC.api.GSTCID("5"),
    label: "坦克装备子项目",
    unit: "单位2",
    expanded: true
  };

  // 项目7
  rows[GSTC.api.GSTCID("7")] = {
    id: GSTC.api.GSTCID("7"),
    parentId: GSTC.api.GSTCID("5"),
    label: "步战车装备子项目",
    unit: "单位2",
    expanded: true
  };

  // 项目8
  rows[GSTC.api.GSTCID("8")] = {
    id: GSTC.api.GSTCID("8"),
    parentId: GSTC.api.GSTCID("5"),
    label: "122榴弹炮装备子项目",
    unit: "单位2",
    expanded: true
  };

  // 项目9
  rows[GSTC.api.GSTCID("9")] = {
    id: GSTC.api.GSTCID("9"),
    parentId: GSTC.api.GSTCID("0"),
    label: "训练子项目",
    unit: "单位2",
    expanded: true
  };

  // 项目10
  rows[GSTC.api.GSTCID("10")] = {
    id: GSTC.api.GSTCID("10"),
    parentId: GSTC.api.GSTCID("9"),
    label: "合成分队训练场子项目",
    unit: "单位3",
    expanded: true
  };

  // 项目11
  rows[GSTC.api.GSTCID("11")] = {
    id: GSTC.api.GSTCID("11"),
    parentId: GSTC.api.GSTCID("9"),
    label: "兵种分队训练场子项目",
    unit: "单位3",
    expanded: true
  };

  // 项目12
  rows[GSTC.api.GSTCID("12")] = {
    id: GSTC.api.GSTCID("12"),
    parentId: GSTC.api.GSTCID("9"),
    label: "模拟训练子项目",
    unit: "单位3",
    expanded: true
  };

  // 项目13
  rows[GSTC.api.GSTCID("13")] = {
    id: GSTC.api.GSTCID("13"),
    parentId: GSTC.api.GSTCID("9"),
    label: "训练与考核大纲子项目",
    unit: "单位3",
    expanded: true
  };

  // 项目14
  rows[GSTC.api.GSTCID("14")] = {
    id: GSTC.api.GSTCID("14"),
    parentId: GSTC.api.GSTCID("0"),
    label: "基础设施子项目",
    unit: "单位3",
    expanded: true
  };

  // 项目15
  rows[GSTC.api.GSTCID("15")] = {
    id: GSTC.api.GSTCID("15"),
    parentId: GSTC.api.GSTCID("14"),
    label: "通信基础设施子项目",
    unit: "单位4",
    expanded: true
  };

  // 项目16
  rows[GSTC.api.GSTCID("16")] = {
    id: GSTC.api.GSTCID("16"),
    parentId: GSTC.api.GSTCID("14"),
    label: "维修基础设施子项目",
    unit: "单位4",
    expanded: true
  };

  // 项目17
  rows[GSTC.api.GSTCID("17")] = {
    id: GSTC.api.GSTCID("17"),
    parentId: GSTC.api.GSTCID("14"),
    label: "营房基础设施子项目",
    unit: "单位4",
    expanded: true
  };

  // 项目18
  rows[GSTC.api.GSTCID("18")] = {
    id: GSTC.api.GSTCID("18"),
    parentId: GSTC.api.GSTCID("0"),
    label: "组织编制子项目",
    unit: "单位4",
    expanded: true
  };

  // 项目19
  rows[GSTC.api.GSTCID("19")] = {
    id: GSTC.api.GSTCID("19"),
    parentId: GSTC.api.GSTCID("18"),
    label: "坦克分队编制子项目",
    unit: "单位4",
    expanded: true
  };

  // 项目20
  rows[GSTC.api.GSTCID("20")] = {
    id: GSTC.api.GSTCID("20"),
    parentId: GSTC.api.GSTCID("18"),
    label: "装甲步兵分队编制子项目",
    unit: "单位4",
    expanded: true
  };

  // 项目21
  rows[GSTC.api.GSTCID("21")] = {
    id: GSTC.api.GSTCID("21"),
    parentId: GSTC.api.GSTCID("18"),
    label: "侦察分队编制子项目",
    unit: "单位4",
    expanded: true
  };
  return rows;
}

function generateItems() {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Items }
   */
  let items = {};
  let start = date("2025-01-01").startOf("day").subtract(6, "day");

  // 项目0
  items[GSTC.api.GSTCID("0")] = {
    id: GSTC.api.GSTCID("0"),
    parentId: null,
    label: "基本作战单位子项目群",
    rowId: GSTC.api.GSTCID("0"),
    time: {
      start: start.valueOf(),
      end: start.add(1800, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#0085c3',
    },
  };

  // 项目1
  items[GSTC.api.GSTCID("1")] = {
    id: GSTC.api.GSTCID("1"),
    parentId: GSTC.api.GSTCID("0"),
    label: "条令子项目",
    rowId: GSTC.api.GSTCID("1"),
    time: {
      start: start.valueOf(),
      end: start.add(280, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#7ab800',
    },
  };

  // 项目2
  items[GSTC.api.GSTCID("2")] = {
    id: GSTC.api.GSTCID("2"),
    parentId: GSTC.api.GSTCID("1"),
    label: "坦克分队作战条令子项目",
    rowId: GSTC.api.GSTCID("2"),
    time: {
      start: start.valueOf(),
      end: start.add(270, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目3
  items[GSTC.api.GSTCID("3")] = {
    id: GSTC.api.GSTCID("3"),
    parentId: GSTC.api.GSTCID("1"),
    label: "装甲步兵分队作战条令子项目",
    rowId: GSTC.api.GSTCID("3"),
    time: {
      start: start.valueOf(),
      end: start.add(280, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目4
  items[GSTC.api.GSTCID("4")] = {
    id: GSTC.api.GSTCID("4"),
    parentId: GSTC.api.GSTCID("1"),
    label: "侦察分队作战条令子项目",
    rowId: GSTC.api.GSTCID("4"),
    time: {
      start: start.valueOf(),
      end: start.add(260, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目5
  items[GSTC.api.GSTCID("5")] = {
    id: GSTC.api.GSTCID("5"),
    parentId: GSTC.api.GSTCID("0"),
    label: "装备子项目",
    rowId: GSTC.api.GSTCID("5"),
    time: {
      start: start.add(200, "day").valueOf(),
      end: start.add(1800, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#7ab800',
    },
  };

  // 项目6
  items[GSTC.api.GSTCID("6")] = {
    id: GSTC.api.GSTCID("6"),
    parentId: GSTC.api.GSTCID("5"),
    label: "坦克装备子项目",
    rowId: GSTC.api.GSTCID("6"),
    time: {
      start: start.add(241, "day").valueOf(),
      end: start.add(1750, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目7
  items[GSTC.api.GSTCID("7")] = {
    id: GSTC.api.GSTCID("7"),
    parentId: GSTC.api.GSTCID("5"),
    label: "步战车装备子项目",
    rowId: GSTC.api.GSTCID("7"),
    time: {
      start: start.add(200, "day").valueOf(),
      end: start.add(1789, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目8
  items[GSTC.api.GSTCID("8")] = {
    id: GSTC.api.GSTCID("8"),
    parentId: GSTC.api.GSTCID("5"),
    label: "122榴弹炮装备子项目",
    rowId: GSTC.api.GSTCID("8"),
    time: {
      start: start.add(267, "day").valueOf(),
      end: start.add(1800, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目9
  items[GSTC.api.GSTCID("9")] = {
    id: GSTC.api.GSTCID("9"),
    parentId: GSTC.api.GSTCID("0"),
    label: "训练子项目",
    rowId: GSTC.api.GSTCID("9"),
    time: {
      start: start.add(366, "day").valueOf(),
      end: start.add(1600, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#7ab800',
    },
  };

  // 项目10
  items[GSTC.api.GSTCID("10")] = {
    id: GSTC.api.GSTCID("10"),
    parentId: GSTC.api.GSTCID("9"),
    label: "合成分队训练场子项目",
    rowId: GSTC.api.GSTCID("10"),
    time: {
      start: start.add(366, "day").valueOf(),
      end: start.add(1510, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目11
  items[GSTC.api.GSTCID("11")] = {
    id: GSTC.api.GSTCID("11"),
    parentId: GSTC.api.GSTCID("9"),
    label: "兵种分队训练场子项目",
    rowId: GSTC.api.GSTCID("11"),
    time: {
      start: start.add(366, "day").valueOf(),
      end: start.add(1510, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目12
  items[GSTC.api.GSTCID("12")] = {
    id: GSTC.api.GSTCID("12"),
    parentId: GSTC.api.GSTCID("9"),
    label: "模拟训练子项目",
    rowId: GSTC.api.GSTCID("12"),
    time: {
      start: start.add(420, "day").valueOf(),
      end: start.add(1600, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目13
  items[GSTC.api.GSTCID("13")] = {
    id: GSTC.api.GSTCID("13"),
    parentId: GSTC.api.GSTCID("9"),
    label: "训练与考核大纲子项目",
    rowId: GSTC.api.GSTCID("13"),
    time: {
      start: start.add(366, "day").valueOf(),
      end: start.add(1600, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目14
  items[GSTC.api.GSTCID("14")] = {
    id: GSTC.api.GSTCID("14"),
    parentId: GSTC.api.GSTCID("0"),
    label: "基础设施子项目",
    rowId: GSTC.api.GSTCID("14"),
    time: {
      start: start.valueOf(),
      end: start.add(330, "day").endOf("day").valueOf(),
    },
    dependant: [GSTC.api.GSTCID("9")],
    style: {
      background: '#7ab800',
    },
  };

  // 项目15
  items[GSTC.api.GSTCID("15")] = {
    id: GSTC.api.GSTCID("15"),
    parentId: GSTC.api.GSTCID("14"),
    label: "通信基础设施子项目",
    rowId: GSTC.api.GSTCID("15"),
    time: {
      start: start.add(20, "day").valueOf(),
      end: start.add(300, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目16
  items[GSTC.api.GSTCID("16")] = {
    id: GSTC.api.GSTCID("16"),
    parentId: GSTC.api.GSTCID("14"),
    label: "维修基础设施子项目",
    rowId: GSTC.api.GSTCID("16"),
    time: {
      start: start.valueOf(),
      end: start.add(330, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目17
  items[GSTC.api.GSTCID("17")] = {
    id: GSTC.api.GSTCID("17"),
    parentId: GSTC.api.GSTCID("14"),
    label: "营房基础设施子项目",
    rowId: GSTC.api.GSTCID("17"),
    time: {
      start: start.add(20, "day").valueOf(),
      end: start.add(200, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目18
  items[GSTC.api.GSTCID("18")] = {
    id: GSTC.api.GSTCID("18"),
    parentId: GSTC.api.GSTCID("0"),
    label: "组织编制子项目",
    rowId: GSTC.api.GSTCID("18"),
    time: {
      start: start.valueOf(),
      end: start.add(300, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#7ab800',
    },
  };

  // 项目19
  items[GSTC.api.GSTCID("19")] = {
    id: GSTC.api.GSTCID("19"),
    parentId: GSTC.api.GSTCID("18"),
    label: "坦克分队编制子项目",
    rowId: GSTC.api.GSTCID("19"),
    time: {
      start: start.valueOf(),
      end: start.add(290, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目20
  items[GSTC.api.GSTCID("20")] = {
    id: GSTC.api.GSTCID("20"),
    parentId: GSTC.api.GSTCID("18"),
    label: "装甲步兵分队编制子项目",
    rowId: GSTC.api.GSTCID("20"),
    time: {
      start: start.valueOf(),
      end: start.add(300, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  // 项目21
  items[GSTC.api.GSTCID("21")] = {
    id: GSTC.api.GSTCID("21"),
    parentId: GSTC.api.GSTCID("18"),
    label: "侦察分队编制子项目",
    rowId: GSTC.api.GSTCID("21"),
    time: {
      start: start.add(9, "day").valueOf(),
      end: start.add(300, "day").endOf("day").valueOf(),
    },
    dependant: [],
    style: {
      background: '#f2af00',
    },
  };

  return items;
}

// main component

export default {
  name: "GSTC",
  mounted() {
    /**
     * @type { import("gantt-schedule-timeline-calendar").Config }
     */


    const dependencyLinesOptions = {
      enabled: true,
      onLine: [
        (line) => {
          line.type = GSTC.api.sourceID(line.fromItem.id) === "3" ? "smooth" : "square";
          return line;
        },
        (line) => {
          line.type = line.fromItem.dependantLineType; // you can store line type as item property with your own name
          return line;
        },
      ],
      onLines: [
        (lines) => {
          // modify lines here
          return lines;
        },
      ],
    };

    const config = {
      licenseKey:
        "====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====",
      plugins: [TimelinePointer(), Selection(), ItemResizing(), ItemMovement(), Bookmarks(), DependencyLines()],
      list: {
        columns: {
          data: {
            // [GSTC.api.GSTCID("id")]: {
            //   id: GSTC.api.GSTCID("id"),
            //   width: 60,
            //   data: ({ row }) => GSTC.api.sourceID(row.id),
            //   header: {
            //     content: "ID",
            //   },
            // },
            [GSTC.api.GSTCID("label")]: {
              id: GSTC.api.GSTCID("label"),
              width: 200,
              expander: true,
              data: "label",
              header: {
                content: "项目名称",
              },
            },
            [GSTC.api.GSTCID("unit")]: {
              id: GSTC.api.GSTCID("unit"),
              width: 100,
              data: "unit",
              header: {
                content: "主责单位",
              },
            },
          },
        },
        rows: generateRows(),
      },
      chart: {
        items: generateItems(),
        time: {
          zoom: 26.5
        }
        // time: {
        //   from: date("2025-03-01").valueOf(), // from 2020-01-01
        //   to: date("2025-03-01").endOf("month").valueOf(), // to 2020-01-31
        // },
      },
    };


    state = GSTC.api.stateFromConfig(config);

    gstc = GSTC({
      // @ts-ignore
      element: this.$refs.gstc,
      state,
    });
  },

  beforeUnmount() {
    if (gstc) gstc.destroy();
  },

  methods: {
    updateFirstRow() {
      state.update(`config.list.rows.${GSTC.api.GSTCID("0")}`, (row) => {
        row.label = "Changed dynamically";
        return row;
      });
    },

    changeZoomLevel() {
      state.update("config.chart.time.zoom", 23);
    },
  },
};
</script>
<style scoped>
.gstc-component {
  margin: 0;
  padding: 0;
}
.toolbox {
  padding: 10px;
}
</style>
