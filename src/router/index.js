import { createRouter, createWebHistory } from 'vue-router'
import GanttChart from '../views/GanttChart.vue'
import CapabilityTable from '../views/CapabilityTable.vue'
import DecisionTree from '../views/DecisionTree.vue'

const routes = [
    { path: '/', redirect: '/gantt' },
    { path: '/gantt', component: GanttChart },
    { path: '/capability', component: CapabilityTable },
    { path: '/decision', component: DecisionTree }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router