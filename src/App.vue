<template>
  <div id="app">
    <el-menu
        mode="horizontal"
        :default-active="activeTab"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        class="fixed-tab"
    >
      <el-menu-item index="/gantt">项目要素管理与可视化</el-menu-item>
      <el-menu-item index="/capability">协同调控</el-menu-item>
      <el-menu-item index="/decision">关联分析</el-menu-item>
    </el-menu>

    <div class="view-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    return {
      activeTab: route.path
    }
  }
}
</script>

<style scoped>
.fixed-tab {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
}

.view-container {
  margin-top: 60px;
  padding: 20px;
}
</style>




<!--<template>-->
<!--  <gstc></gstc>-->
<!--</template>-->

<!--<script>-->
<!--import GSTCComponent from './components/GSTC.vue'-->

<!--export default {-->
<!--  name: 'App',-->
<!--  components: {-->
<!--    'gstc':GSTCComponent-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style>-->
<!--#app {-->
<!--  font-family: Avenir, Helvetica, Arial, sans-serif;-->
<!--  -webkit-font-smoothing: antialiased;-->
<!--  -moz-osx-font-smoothing: grayscale;-->
<!--  color: #2c3e50;-->
<!--}-->
<!--</style>-->
