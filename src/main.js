import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// // import the ESM build of frappe-gantt + your local copy of its CSS
// import Gantt from 'frappe-gantt/dist/frappe-gantt.esm.js'
// import '@/assets/frappe‑gantt.css'

const app = createApp(App)
// app.config.globalProperties.$Gantt = Gantt   // make it available everywhere
app.use(router).use(ElementPlus).mount('#app')
