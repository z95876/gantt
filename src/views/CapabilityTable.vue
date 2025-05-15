<template>
  <div>
    <h2>项目能力冗余度与满足度表</h2>
    <div class="explanation mb-4 text-sm text-gray-700" style="margin-bottom: 20px;">
      <p>能力满足度：指某个项目完成的全部能力在总能力中所占比例，反映其对总体能力的贡献程度。计算公式：满足度 = 项目完成能力数 / 能力总数</p>
      <p>能力冗余度：指该项目完成的能力中，有多少比例也被其他项目完成，反映项目能力的重复程度。计算公式：冗余度 = 完成能力中被其他项目同时完成的数量 / 项目完成能力数</p>

      <el-button type="primary" @click="dialogVisible = true">添加项目</el-button>
    </div>
    <el-table :data="projects" style="width: 100%" border>
      <el-table-column prop="name" label="项目名称" />
      <el-table-column
          prop="satisfaction"
          label="满足度"
          sortable
          :sort-method="(a, b) => a.satisfaction - b.satisfaction"
          :formatter="row => (row.satisfaction * 100).toFixed(2) + '%'"
      />

      <el-table-column
          prop="redundancy"
          label="冗余度"
          sortable
          :sort-method="(a, b) => a.redundancy - b.redundancy"
          :formatter="row => (row.redundancy * 100).toFixed(2) + '%'"
      />


      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" type="danger" @click="prepareDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="添加项目" width="600px">
      <el-form :model="newProject" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="newProject.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目具备能力">
          <el-checkbox-group v-model="newProject.abilities">
            <el-checkbox
                v-for="ability in allAbilities"
                :key="ability.value"
                :label="ability.value"
            >
              {{ ability.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addProject">添加</el-button>
      </template>
    </el-dialog>

    <!-- 删除影响评估对话框 -->
    <el-dialog v-model="impactDialogVisible" title="删除项目影响评估" width="600px">
      <p>该项目独有能力如下（删除后将丢失这些能力）：</p>
      <el-tag
          v-for="id in lostAbilities"
          :key="id"
          type="danger"
          class="mr-2 mb-2"
      >
        {{ allAbilities[id]["label"] }}
      </el-tag>
      <p style="margin-top: 10px;">影响程度：<b>{{ impactLevel }}</b></p>
      <div style="overflow-y: auto;">
        <p>如果删除项目 <strong>{{ pendingDelete?.name }}</strong> 后，其他项目的冗余度变化如下：</p>
        <el-table :data="impactData" size="small" style="width: 100%; height: 350px;">
          <el-table-column prop="name" label="项目名称" />
          <el-table-column
              prop="oldRedundancy"
              label="原冗余度"
              :formatter="row => (row.oldRedundancy * 100).toFixed(2) + '%'"
          />
          <el-table-column
              prop="newRedundancy"
              label="新冗余度"
              :formatter="row => (row.newRedundancy * 100).toFixed(2) + '%'"
          />
        </el-table>
      </div>
      <template #footer>
        <el-button @click="impactDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">确认删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 80%;
  margin: 20px auto;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
th {
  background-color: #eee;
}
</style>
<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

window.addEventListener('error', e => {
  if (e.message && e.message.includes('ResizeObserver loop')) {
    e.stopImmediatePropagation()
  }
})


const projects = ref([
  {
    "name": "坦克分队作战条令子项目",
    "abilities": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "装甲步兵分队作战条令子项目",
    "abilities": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "侦察分队作战条令子项目",
    "abilities": [
      1,
      2,
      3,
      4,
      5,
      6,
      11,
      12,
      13,
      14,
      15,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "坦克装备列装配备子项目",
    "abilities": [
      2,
      3,
      4,
      5,
      6
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "步战车装备加改装子项目",
    "abilities": [
      2,
      3,
      4,
      5,
      6
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "122榴弹炮装备子项目",
    "abilities": [
      2,
      3,
      4,
      5,
      6
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "合成分队训练场子项目",
    "abilities": [
      2,
      3,
      4,
      5,
      6,
      73
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "兵种分队训练场子项目",
    "abilities": [
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53,
      56,
      57,
      58,
      59,
      60,
      61,
      62,
      63,
      64,
      65,
      66,
      67,
      69,
      70,
      71,
      72,
      73
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "模拟训练子项目",
    "abilities": [
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53,
      56,
      57,
      58,
      59,
      60,
      61,
      62,
      63,
      64,
      65,
      66,
      67,
      69,
      70,
      71,
      72,
      73
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "训练与考核大纲子项目",
    "abilities": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53,
      56,
      57,
      58,
      59,
      60,
      61,
      62,
      63,
      64,
      65,
      66,
      67
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "通信基础设施子项目",
    "abilities": [
      69,
      70,
      71,
      72,
      73,
      78,
      80,
      81,
      82,
      83,
      84
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "维修基础设施子项目",
    "abilities": [
      78
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "营房基础设施子项目",
    "abilities": [
      74,
      75,
      78,
      80,
      81,
      82,
      83,
      84
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "坦克分队编制子项目",
    "abilities": [
      2,
      3,
      4,
      5
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "装甲步兵分队编制子项目",
    "abilities": [
      2,
      3,
      4,
      5
    ],
    "satisfaction": 0,
    "redundancy": 0
  },
  {
    "name": "侦察分队编制子项目",
    "abilities": [
      11,
      12,
      13,
      14,
      15,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28
    ],
    "satisfaction": 0,
    "redundancy": 0
  }
])

const dialogVisible = ref(false)
const impactDialogVisible = ref(false)
let newProject = ref({
  name: '',
  abilities: []
})
let pendingDelete = ref(null)
const impactData = ref([])
const toDelete = ref(null)
const lostAbilities = ref([])
const impactLevel = ref('')

const allAbilities = [
  {
    "label": "远程机动能力",
    "value": 1
  },
  {
    "label": "战场机动能力",
    "value": 2
  },
  {
    "label": "对地面固定点目标打击能力",
    "value": 3
  },
  {
    "label": "对地面固定面目标打击能力",
    "value": 4
  },
  {
    "label": "对地面移动点目标打击能力",
    "value": 5
  },
  {
    "label": "核生化作战能力",
    "value": 6
  },
  {
    "label": "对敌通信干扰能力",
    "value": 7
  },
  {
    "label": "对敌雷达干扰能力",
    "value": 8
  },
  {
    "label": "计算机网络攻击能力",
    "value": 9
  },
  {
    "label": "对敌定位导航干扰能力",
    "value": 10
  },
  {
    "label": "通信侦察能力",
    "value": 11
  },
  {
    "label": "雷达侦察能力",
    "value": 12
  },
  {
    "label": "网络空间侦察能力",
    "value": 13
  },
  {
    "label": "可见光侦察能力",
    "value": 14
  },
  {
    "label": "红外侦察能力",
    "value": 15
  },
  {
    "label": "工程侦察能力",
    "value": 16
  },
  {
    "label": "生物侦察能力",
    "value": 17
  },
  {
    "label": "防化侦察能力",
    "value": 18
  },
  {
    "label": "核辐侦察能力",
    "value": 19
  },
  {
    "label": "目标识别能力",
    "value": 20
  },
  {
    "label": "数据处理能力",
    "value": 21
  },
  {
    "label": "情报产品生成能力",
    "value": 22
  },
  {
    "label": "战场情报数据共享能力",
    "value": 23
  },
  {
    "label": "侦察规划能力",
    "value": 24
  },
  {
    "label": "情报信息汇总能力",
    "value": 25
  },
  {
    "label": "情报信息组织能力",
    "value": 26
  },
  {
    "label": "情报信息分发能力",
    "value": 27
  },
  {
    "label": "情报信息理解能力",
    "value": 28
  },
  {
    "label": "态势分析能力",
    "value": 29
  },
  {
    "label": "作战规划能力",
    "value": 30
  },
  {
    "label": "决策能力",
    "value": 31
  },
  {
    "label": "计划制定能力",
    "value": 32
  },
  {
    "label": "行动协调能力",
    "value": 33
  },
  {
    "label": "战场监控能力",
    "value": 34
  },
  {
    "label": "作战数据保障能力",
    "value": 35
  },
  {
    "label": "超短波通信能力",
    "value": 36
  },
  {
    "label": "卫星通信能力",
    "value": 37
  },
  {
    "label": "微波通信能力",
    "value": 38
  },
  {
    "label": "有线通信能力",
    "value": 39
  },
  {
    "label": "信息共享能力",
    "value": 40
  },
  {
    "label": "分布式计算能力",
    "value": 41
  },
  {
    "label": "用户接入能力",
    "value": 42
  },
  {
    "label": "定位导航能力",
    "value": 43
  },
  {
    "label": "授时能力",
    "value": 44
  },
  {
    "label": "网络管理能力",
    "value": 45
  },
  {
    "label": "频谱管理能力",
    "value": 46
  },
  {
    "label": "抗干扰能力",
    "value": 47
  },
  {
    "label": "信息安全能力",
    "value": 48
  },
  {
    "label": "防空中火力打击能力",
    "value": 49
  },
  {
    "label": "防地面火力打击能力",
    "value": 50
  },
  {
    "label": "防核生化能力",
    "value": 51
  },
  {
    "label": "防电磁脉冲破坏能力",
    "value": 52
  },
  {
    "label": "防定向能武器能力",
    "value": 53
  },
  {
    "label": "战场军需保障能力",
    "value": 54
  },
  {
    "label": "战场器材保障能力",
    "value": 55
  },
  {
    "label": "战场油料保障能力",
    "value": 56
  },
  {
    "label": "战场卫生救护能力",
    "value": 57
  },
  {
    "label": "战场弹药保障能力",
    "value": 58
  },
  {
    "label": "装备战场抢救抢修能力",
    "value": 59
  },
  {
    "label": "装备战场维修能力",
    "value": 60
  },
  {
    "label": "战场保障管理能力",
    "value": 61
  },
  {
    "label": "道路保障能力",
    "value": 62
  },
  {
    "label": "工程防护能力",
    "value": 63
  },
  {
    "label": "地雷爆破能力",
    "value": 64
  },
  {
    "label": "工程破障能力",
    "value": 65
  },
  {
    "label": "工程伪装能力",
    "value": 66
  },
  {
    "label": "核生化洗消能力",
    "value": 67
  },
  {
    "label": "训练管理能力",
    "value": 68
  },
  {
    "label": "模拟训练能力",
    "value": 69
  },
  {
    "label": "网络训练能力",
    "value": 70
  },
  {
    "label": "专业技术训练能力",
    "value": 71
  },
  {
    "label": "专业技术协同训练能力",
    "value": 72
  },
  {
    "label": "分队战术训练能力",
    "value": 73
  },
  {
    "label": "政治教育能力",
    "value": 74
  },
  {
    "label": "学习娱乐能力",
    "value": 75
  },
  {
    "label": "营区管理能力",
    "value": 76
  },
  {
    "label": "装备维修保养能力",
    "value": 77
  },
  {
    "label": "装备管理能力",
    "value": 78
  },
  {
    "label": "器材管理能力",
    "value": 79
  },
  {
    "label": "弹药管理能力",
    "value": 80
  },
  {
    "label": "卫生服务能力",
    "value": 81
  },
  {
    "label": "油料保障能力",
    "value": 82
  },
  {
    "label": "给养服务能力",
    "value": 83
  },
  {
    "label": "生活服务能力",
    "value": 84
  }
]
// let newProjectAbilities = ref([]) // 数字组成的数组，例如 [1, 3, 5]


function calculateAll() {
  const allAbilities = projects.value.flatMap(p => p.abilities)

  projects.value.forEach(project => {
    const total = project.abilities.length
    const overlap = project.abilities.filter(a =>
        allAbilities.filter(b => b === a).length > 1
    ).length

    project.satisfaction = total / 84
    project.redundancy = total === 0 ? 0 : overlap / total
  })
}

function addProject() {
  if (newProject.value.name === '') {
    ElMessage.warning('请填写项目名称')
    return
  }
  if (newProject.value.abilities.length === 0) {
    ElMessage.warning('请选择至少一项能力')
    return
  }


  projects.value.push({
    name: newProject.value.name,
    abilities: [...newProject.value.abilities],
    satisfaction: 0,
    redundancy: 0
  })
  dialogVisible.value = false
  newProject.value = { name: '', abilities: [] }
  calculateAll()
  ElMessage.success('项目添加成功')
}

function deleteProject(project) {
  projects.value = projects.value.filter(p => p !== project)
  calculateAll()
  ElMessage.success('项目删除成功')
}

// 重写 calculateMetrics，使其能接收任意列表
function calculateMetrics(list) {
  const allAbilities = list.flatMap(p => p.abilities || [])

  return list.map(p => {
    const total = (p.abilities || []).length
    const overlap = (p.abilities || []).filter(a =>
        allAbilities.filter(b => b === a).length > 1
    ).length

    return {
      name: p.name,
      satisfaction: total / 84,
      redundancy: total > 0 ? overlap / total : 0
    }
  })
}


function prepareDelete(row) {
  // 能力影响
  toDelete.value = row
  const abilityCount = {}
  projects.value.forEach(p => {
    if (p === row) return
    p.abilities.forEach(a => {
      abilityCount[a] = (abilityCount[a] || 0) + 1
    })
  })
  lostAbilities.value = row.abilities.filter(a => !abilityCount[a])
  const lost = lostAbilities.value.length
  if (lost === 0) impactLevel.value = '小'
  else if (lost <= 2) impactLevel.value = '中'
  else impactLevel.value = '大'
  impactDialogVisible.value = true

  pendingDelete.value = row
  // 计算删除后项目影响
  const before = projects.value.map(p => ({ name: p.name, abilities: p.abilities.slice() }))
  const afterList = projects.value.filter(p => p !== row)
  const allAblts = afterList.flatMap(p => p.abilities)
  afterList.forEach(project => {
    const total = project.abilities.length
    const overlap = project.abilities.filter(a =>
        allAblts.filter(b => b === a).length > 1
    ).length
    project.redundancy = total === 0 ? 0 : overlap / total
  })
  impactData.value = afterList.map(p => ({
    name: p.name,
    oldRedundancy: before.find(x=>x.name===p.name).abilities.filter(a=>{
      const allBefore=before.flatMap(x=>x.abilities)
      return allBefore.filter(y=>y===a).length>1
    }).length / p.abilities.length,
    newRedundancy: p.redundancy
  }))
  impactDialogVisible.value = true
}


// 最终在确认删除按钮中调用：
function confirmDelete() {
  projects.value = projects.value.filter(p => p !== pendingDelete.value)
  // 重新计算主表指标
  calculateAll()
  pendingDelete.value = null
  impactDialogVisible.value = false
  ElMessage.success('项目已删除')
}

calculateAll()
</script>