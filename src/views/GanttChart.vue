<template>
  <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 20px;">
    <div>
      <h2 class="text-2xl font-bold mb-4" style="margin-top: 0">基本作战单位子项目群</h2>
      <div class="controls mb-2">
        <el-button type="primary" @click="currentView = 'gantt'">甘特图</el-button>
        <el-button type="primary" @click="currentView = 'topo'; resizeChart()">拓扑图</el-button>
      </div>
    </div>
    <div style="font-size: 12px; color: #666; line-height: 1.5; margin-left: 16px; margin-top: 0">
      <div>依赖规则：</div>
      <div>1.<strong>条令子项目</strong>、<strong>基础设施子项目</strong>和<strong>组织编制子项目</strong>应在<strong>装备子项目</strong>和<strong>训练子项目</strong>开始前开始。</div>
      <div>2.<strong>基础设施子项目</strong>应在<strong>装备子项目</strong>和<strong>训练子项目</strong>结束前结束，<strong>训练子项目</strong>应在<strong>装备子项目</strong>结束前结束。</div>
      <div>3.父项目时间范围应覆盖全部的子项目。</div>
    </div>
  </div>
  <div v-show="currentView === 'gantt'" ref="ganttContainer" class="gantt-container" ></div>
  <div v-show="currentView === 'topo'" ref="chart" class="chart-container"></div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick} from 'vue'
import gantt from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import { ElButton, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'

const treeData = {
  "name": "基本作战单位子项目群",
  "children": [
    {
      "name": "条令子项目",
      "children": [
        {
          "name": "坦克分队作战条令"
        },
        {
          "name": "装甲步兵分队作战条令"
        },
        {
          "name": "侦察分队作战条令"
        },
      ]
    },
    {
      "name": "装备子项目",
      "children": [
        {
          "name": "坦克装备"
        },
        {
          "name": "步战车装备"
        },
        {
          "name": "122榴弹炮装备"
        },
      ]
    },
    {
      "name": "训练子项目",
      "children": [
        {
          "name": "合成分队训练场"
        },
        {
          "name": "兵种分队训练场"
        },
        {
          "name": "模拟训练"
        },
        {
          "name": "训练与考核大纲"
        },
      ]
    },
    {
      "name": "基础设施子项目",
      "children": [
        {
          "name": "通信基础设施"
        },
        {
          "name": "维修基础设施"
        },
        {
          "name": "营房基础设施"
        },
      ]
    },
    {
      "name": "组织编制子项目",
      "children": [
        {
          "name": "坦克分队编制"
        },
        {
          "name": "装甲步兵分队编制"
        },
        {
          "name": "侦察分队编制"
        },
      ]
    },
  ]
}

const currentView = ref('gantt')
const ganttContainer = ref(null)
const chart = ref(null)
let myChart = null

const tasksData = {
  data: [
    { id: 1,  text: '条令子项目',         start_date: '2025-01-01', duration: 310, parent: 0, unit: '总部' },
    { id: 2,  text: '坦克分队条令',       start_date: '2025-01-01', duration: 270,  parent: 1, unit: '装甲部' },
    { id: 3,  text: '装甲步兵条令',       start_date: '2025-02-01', duration: 280,  parent: 1, unit: '步兵部' },
    { id: 4,  text: '侦察分队条令',       start_date: '2025-03-01', duration: 260,  parent: 1, unit: '侦察部' },

    { id: 5,  text: '装备子项目',         start_date: '2025-07-01', duration: 1600, parent: 0, unit: '后勤部' },
    { id: 6,  text: '坦克装备子项目',     start_date: '2025-08-01', duration: 1509,  parent: 5, unit: '装甲部' },
    { id: 7,  text: '步战车装备子项目',   start_date: '2025-07-01', duration: 1589,  parent: 5, unit: '机械部' },
    { id: 8,  text: '122榴弹炮装备',      start_date: '2025-09-01', duration: 1538,  parent: 5, unit: '炮兵部' },

    { id: 9,  text: '训练子项目',         start_date: '2026-01-01', duration: 1234, parent: 0, unit: '训练部' },
    { id: 10, text: '合成分队训练场',     start_date: '2026-01-01', duration: 1144,  parent: 9, unit: '训练部' },
    { id: 11, text: '兵种分队训练场',     start_date: '2026-01-01', duration: 1144,  parent: 9, unit: '训练部' },
    { id: 12, text: '模拟训练子项目',     start_date: '2026-03-01', duration: 1170,  parent: 9, unit: '训练部' },
    { id: 13, text: '训练与考核大纲',     start_date: '2026-01-01', duration: 1234,  parent: 9, unit: '训练部' },

    { id: 14, text: '基础设施子项目',     start_date: '2025-01-01', duration: 330, parent: 0, unit: '工程部' },
    { id: 15, text: '通信基础设施',       start_date: '2025-01-20', duration: 280,  parent: 14, unit: '通信部' },
    { id: 16, text: '维修基础设施',       start_date: '2025-01-01', duration: 330,  parent: 14, unit: '工程部' },
    { id: 17, text: '营房基础设施',       start_date: '2025-01-20', duration: 180,  parent: 14, unit: '工兵部' },

    { id: 18, text: '组织编制子项目',     start_date: '2025-01-01', duration: 300, parent: 0, unit: '人事部' },
    { id: 19, text: '坦克分队编制',       start_date: '2025-01-01', duration: 290,  parent: 18, unit: '人事部' },
    { id: 20, text: '装甲步兵编制',       start_date: '2025-01-01', duration: 300,  parent: 18, unit: '人事部' },
    { id: 21, text: '侦察分队编制',       start_date: '2025-01-10', duration: 290,  parent: 18, unit: '人事部' }
  ],
  links: [
    { id: 1,  source: 1,  target: 5,   type: '1' },
    { id: 2,  source: 1,  target: 9,   type: '1' },

    { id: 4,  source: 14,  target: 5,   type: '1' },
    { id: 5,  source: 14, target: 9,   type: '1' },

    { id: 6,  source: 18,  target: 5,   type: '1' },
    { id: 7,  source: 18,  target: 9,   type: '1' },

    { id: 8,  source: 9, target: 5,   type: '2' },

    { id: 9,  source: 14,  target: 5,   type: '2' },

    { id: 10, source: 14,  target: 9,   type: '2' },
  ]
}

function setYearView() {
  gantt.config.scale_unit = 'year'
  gantt.config.date_scale = '%Y'
  gantt.config.subscales = [{ unit: 'month', step: 1, date: '%m' }]
  gantt.render()
}
function setMonthView() {
  gantt.config.scale_unit = 'month'
  gantt.config.date_scale = '%Y-%m'
  gantt.config.subscales = [{ unit: 'day', step: 1, date: '%d' }]
  gantt.render()
}
function setAllView() {
  gantt.config.scale_unit = 'year'
  gantt.config.date_scale = '%Y'
  gantt.config.subscales = [{ unit: 'year', step: 1, date: '%d' }]
  gantt.render()
}

function resizeChart() {
  nextTick(() => {
    if (myChart) {
      myChart.resize();
    }
  });
}

let afterDragEventId;
onMounted(() => {
  gantt.config.xml_date = '%Y-%m-%d'
  gantt.config.cascade_delete = false
  gantt.config.show_tasks_outside_timescale = true
  gantt.config.drag_progress = false
  gantt.config.columns = [
    { name: 'text', label: '项目名称', width: 200, tree: true },
    { name: 'unit', label: '交付单位', width: 120, align: 'center' },
    { name: 'add',  label: '',         width: 44 }
  ];
  gantt.config.lightbox.sections = [
    { name: "description", height: 38, map_to: "text", type: "textarea", focus: true, label: "任务名称" },
    { name: "time", type: "duration", map_to: "auto", label: "时间安排" }
  ];
  gantt.locale.date = {
    month_full: ["一月", "二月", "三月", "四月", "五月", "六月",
      "七月", "八月", "九月", "十月", "十一月", "十二月"],
    month_short: ["1月", "2月", "3月", "4月", "5月", "6月",
      "7月", "8月", "9月", "10月", "11月", "12月"],
    day_full: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    day_short: ["日", "一", "二", "三", "四", "五", "六"],
    hours: "时间",
    minutes: "分钟",
    seconds: "秒",
    date_format: "%Y-%m-%d",
    time_format: "%H:%i",
    month_day: "%M %d"
  };

  Object.assign(gantt.locale.labels, {
    new_task: "新建任务",
    icon_save: "保存",
    icon_cancel: "取消",
    icon_details: "详情",
    icon_edit: "编辑",
    icon_delete: "删除",
    confirm_closing: "",  // 弹出框关闭确认提示（空字符串表示无提示）
    confirm_deleting: "您确定要删除该任务吗？",
    section_description: "任务名称",
    section_time: "时间安排",
    save_button: "保存",
    cancel_button: "取消",
    delete_button: "删除",
  });




  setAllView()
  gantt.config.start_date = new Date(2024, 11, 1)
  gantt.config.end_date   = new Date(2029, 11, 31)

  // 样式模板：根项目分色
  gantt.templates.task_class = (s, e, task) => {
    const classes = []
    let root = task.id
    let pid = task.parent
    while (pid && pid !== 0) {
      const p = gantt.getTask(pid)
      if (!p) break
      root = pid
      pid = p.parent
    }
    classes.push('project-' + root)
    return classes.join(' ')
  }

  // 拖拽后检查范围覆盖关系
  afterDragEventId = gantt.attachEvent('onAfterTaskDrag', (id) => {
    const task = gantt.getTask(id)

    // 子任务检查：是否全部被包含
    const children = gantt.getChildren(id)
    if (children.length > 0) {
      const invalidChild = children.find(cid => {
        const c = gantt.getTask(cid)
        return c.start_date < task.start_date || c.end_date > task.end_date
      })
      if (invalidChild) {
        ElMessageBox.alert(`项目【${task.text}】未完全覆盖子项目的时间范围！`, '提示')
      }
    }

    // 父任务检查：是否超出父项目
    if (task.parent && task.parent !== 0) {
      const parent = gantt.getTask(task.parent)
      if (task.start_date < parent.start_date || task.end_date > parent.end_date) {
        ElMessageBox.alert(`项目【${task.text}】超出了父项目【${parent.text}】的时间范围！`, '提示')
      }
    }

    // 你的依赖关系数据
    const links = [
      { id: 1,  source: 1,  target: 5, type: '1' },
      { id: 2,  source: 1,  target: 9, type: '1' },
      { id: 4,  source: 14, target: 5, type: '1' },
      { id: 5,  source: 14, target: 9, type: '1' },
      { id: 6,  source: 18, target: 5, type: '1' },
      { id: 7,  source: 18, target: 9, type: '1' },
      { id: 8,  source: 9,  target: 5, type: '2' },
      { id: 9,  source: 14, target: 5, type: '2' },
      { id: 10, source: 14, target: 9, type: '2' },
    ];

    // 进行依赖检查
    links.forEach(link => {
      const source = gantt.getTask(link.source);
      const target = gantt.getTask(link.target);
      if (!source || !target) return;

      if (link.type === '1') {
        if (gantt.date.parseDate(source.start_date) > gantt.date.parseDate(target.start_date)) {
          ElMessageBox.alert(`依赖错误：任务【${source.text}】开始后，【${target.text}】才能开始！`);
        }
      }
      if (link.type === '2') {
        const sourceEnd = gantt.calculateEndDate(source.start_date, source.duration);
        const targetEnd = gantt.calculateEndDate(target.start_date, target.duration);
        if (sourceEnd > targetEnd) {
          ElMessageBox.alert(`依赖错误：任务【${source.text}】结束后，【${target.text}】才能结束！`);
        }
      }
    });
  })


  gantt.init(ganttContainer.value)

  gantt.parse(tasksData)
  setTimeout(() => {
    gantt.eachTask(t => { if (gantt.hasChild(t.id)) gantt.open(t.id) })
  }, 0)


  myChart = echarts.init(chart.value)
  const option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'tree',
        roam: true, // 允许拖动画布
        data: [treeData],
        top: '10%',
        left: '5%',
        bottom: '20%',
        right: '5%',
        symbol: 'emptyCircle',
        orient: 'vertical',
        expandAndCollapse: true,
        initialTreeDepth: 3,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 14,
          padding: [0, 0, 15, 0],
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
            formatter: function(params) {
              return params.name.split('').join('\n')
            },
            padding: [0, 0, 10, 0],     // 增加底部空间
            overflow: 'break',           // 防止裁剪
          }
        },
        grid: {
          top: 50,
          bottom: 100, // 保证底部留足空间
          left: 50,
          right: 50
        },
      }
    ]
  }
  myChart.setOption(option)
  myChart && myChart.resize()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  if (afterDragEventId) {
    gantt.detachEvent(afterDragEventId)
  }
  gantt.clearAll()
  window.removeEventListener('resize', resizeChart)
  myChart && myChart.dispose()
})
</script>

<style>
.gantt-container { width:100%;height:700px;border:1px solid #ccc;overflow:auto }
.controls { display:flex;gap:8px;margin-bottom:12px }
/* 根项目着色 */
.gantt_task_line.project-1 .gantt_task_content  { background:#e74c3c!important; border-color:#e74c3c!important; }
.gantt_task_line.project-5 .gantt_task_content  { background:#3498db!important; border-color:#3498db!important; }
.gantt_task_line.project-9 .gantt_task_content  { background:#2ecc71!important; border-color:#2ecc71!important; }
.gantt_task_line.project-14 .gantt_task_content { background:#f1c40f!important; border-color:#f1c40f!important; }
.gantt_task_line.project-18 .gantt_task_content { background:#9b59b6!important; border-color:#9b59b6!important; }
/* 超出标红 */
.gantt_task_line.out-of-range .gantt_task_content { background:#c0392b!important; border-color:#c0392b!important; }


/* 修改后（所有项目通用） */
.gantt_task_line .gantt_task_content {
  border-radius: 5px !important; /* 强制保留圆角 */
}
/* 在样式中添加 */
.gantt_task_line.progress-overdue {
  background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 5px,
      rgba(255,0,0,0.1) 5px,
      rgba(255,0,0,0.1) 10px
  ) !important;
}

</style>

<style scoped>
.chart-container {
  width: 100%;
  height:500px;
  overflow: visible;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
h2 {
  margin-bottom: 1rem;
}
</style>
