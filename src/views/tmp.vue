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
          <el-button size="small" type="danger" @click="deleteProject(row)">删除</el-button>
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

const projects = ref([{
  "name": "坦克分队作战条令子项目",
  "abilities": [
    1,
    2,
    3,
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
    ],
    "satisfaction": 0,
    "redundancy": 0
  },])

const dialogVisible = ref(false)
let newProject = ref({
  name: '',
  abilities: []
})

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
  },]
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

calculateAll()
</script>