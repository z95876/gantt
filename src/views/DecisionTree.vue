<!--<template>-->
<!--  <div>-->
<!--    <h2 class="text-xl font-bold mb-4">项目能力分类决策树</h2>-->
<!--    <div ref="chart" class="chart-container"></div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref, onMounted, onBeforeUnmount } from 'vue'-->
<!--import * as echarts from 'echarts'-->

<!--// 示例分类数据：先按“能力A”分，是/否；再按“能力B”……-->
<!--const treeData = {-->
<!--  "name": "XXX能力>xx？",-->
<!--  "children": []-->
<!--}-->


<!--const chart = ref(null)-->
<!--let myChart = null-->

<!--onMounted(() => {-->
<!--  myChart = echarts.init(chart.value)-->
<!--  const option = {-->
<!--    tooltip: {-->
<!--      trigger: 'item',-->
<!--      triggerOn: 'mousemove'-->
<!--    },-->
<!--    series: [-->
<!--      {-->
<!--        type: 'tree',-->
<!--        data: [treeData],-->
<!--        top: '5%',-->
<!--        left: '15%',-->
<!--        bottom: '5%',-->
<!--        right: '15%',-->
<!--        symbol: 'emptyCircle',-->
<!--        orient: 'horizontal',-->
<!--        expandAndCollapse: true,-->
<!--        initialTreeDepth: 50,-->
<!--        label: {-->
<!--          position: 'left',-->
<!--          verticalAlign: 'middle',-->
<!--          align: 'right',-->
<!--          fontSize: 14-->
<!--        },-->
<!--        leaves: {-->
<!--          label: {-->
<!--            position: 'right',-->
<!--            verticalAlign: 'middle',-->
<!--            align: 'left'-->
<!--          }-->
<!--        },-->
<!--        animationDurationUpdate: 750-->
<!--      }-->
<!--    ]-->
<!--  }-->
<!--  myChart.setOption(option)-->
<!--  window.addEventListener('resize', resizeChart)-->
<!--})-->

<!--onBeforeUnmount(() => {-->
<!--  window.removeEventListener('resize', resizeChart)-->
<!--  myChart && myChart.dispose()-->
<!--})-->

<!--function resizeChart() {-->
<!--  myChart && myChart.resize()-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.chart-container {-->
<!--  width: 100%;-->
<!--  height:5000px;-->
<!--  background: #fafafa;-->
<!--  border: 1px solid #e0e0e0;-->
<!--  border-radius: 4px;-->
<!--}-->
<!--h2 {-->
<!--  margin-bottom: 1rem;-->
<!--}-->
<!--</style>-->

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">项目能力分类决策树</h2>

    <!-- 表格输入区域 -->
    <el-table :data="tableData" border style="width: 100%; margin-bottom: 16px;">
      <el-table-column prop="project" label="项目" fixed width="160" />
      <el-table-column
          v-for="(ability, index) in abilities"
          :key="index"
          :label="ability"
          :prop="ability"
          width="110"
      >
        <template #default="{ row }">
          <el-input
              v-model.number="row.values[index]"
              size="small"
              :min="0"
              :max="1"
              type="number"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" @click="generateTree">生成决策树</el-button>

    <!-- 图表展示 -->
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { ElInput, ElButton, ElTable, ElTableColumn, ElMessage } from 'element-plus'

// 能力名称（13个）
const abilities = [
  '机动能力', '火力打击能力', '网电对抗能力', '战场感知能力', '情报处理能力',
  '作战指挥能力', '网信保障能力', '综合防护能力', '后勤保障能力', '装备保障能力',
  '作战保障能力', '训练能力', '平时保障能力'
]

// 项目名称（16个）
const projectNames = [
  '坦克分队作战条令子项目', '装甲步兵分队作战条令子项目', '侦察分队作战条令子项目',
  '坦克装备列装配备子项目', '步战车装备加改装子项目', '122榴弹炮装备子项目',
  '合成分队训练场子项目', '兵种分队训练场子项目', '模拟训练子项目', '训练与考核大纲子项目',
  '通信基础设施子项目', '维修基础设施子项目', '营房基础设施子项目',
  '坦克分队编制子项目', '装甲步兵分队编制子项目', '侦察分队编制子项目'
]

// 初始化表格数据
const tableData = reactive(
    projectNames.map(name => ({
      project: name,
      values: Array.from({ length: abilities.length }, () =>
          parseFloat((Math.random() * 0.8 + 0.1).toFixed(2))
      )
    }))
)

// chart 引用和渲染实例
const chart = ref(null)
let myChart = null

onMounted(() => {
  myChart = echarts.init(chart.value)
  window.addEventListener('resize', () => myChart?.resize())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => myChart?.resize())
  myChart?.dispose()
})

// 核心函数：递归生成决策树数据
function buildDecisionTree(data, depth = 0, maxDepth = 10) {
  if (data.length === 1 || depth >= maxDepth) {
    return { name: data[0].project }
  }

  const bestFeature = getBestSplitFeature(data)
  if (bestFeature === -1) return { name: data[0].project }

  const threshold = 0.5
  const left = data.filter(d => d.values[bestFeature] <= threshold)
  const right = data.filter(d => d.values[bestFeature] > threshold)

  if (left.length === 0 || right.length === 0) {
    return { name: data[0].project }
  }

  return {
    name: `${abilities[bestFeature]} > ${threshold}?`,
    children: [
      buildDecisionTree(right, depth + 1, maxDepth),
      buildDecisionTree(left, depth + 1, maxDepth)
    ]
  }
}

// 简单的方差分裂选择最佳划分特征
function getBestSplitFeature(data) {
  let bestIndex = -1
  let bestScore = -Infinity

  for (let i = 0; i < abilities.length; i++) {
    const left = [], right = []
    for (const row of data) {
      if (row.values[i] <= 0.5) left.push(row)
      else right.push(row)
    }
    const score = left.length * left.length + right.length * right.length
    if (score > bestScore && left.length > 0 && right.length > 0) {
      bestScore = score
      bestIndex = i
    }
  }
  return bestIndex
}

// 点击生成按钮时生成图表
function generateTree() {
  const valid = tableData.every(d => typeof d.project === 'string' && d.project && d.values.some(v => v > 0))
  if (!valid) {
    ElMessage.error('请确保每个项目填写完整并且包含至少一个非零能力值')
    return
  }

  const tree = buildDecisionTree(tableData)

  const option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'tree',
        data: [tree],
        top: '5%',
        left: '15%',
        bottom: '5%',
        right: '15%',
        symbol: 'emptyCircle',
        orient: 'horizontal',
        expandAndCollapse: true,
        initialTreeDepth: 10,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 14
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        animationDurationUpdate: 750
      }
    ]
  }

  myChart.setOption(option)
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 600px;
  margin-top: 20px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px;
}
</style>

