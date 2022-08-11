import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// 引入初始化样式
import "@/styles/reset.css"

//引入插件
import '@/plugins/index.js'

//引入适配方案
import "amfe-flexible"

//引入自动聚焦指令 并使用
import directive from '@/utils/directives'

Vue.use(directive)

if (process.env.NODE_ENV !== 'development') { // process是Node环境全部变量, 运行时根据敲击的命令不同, 脚手架会取环境变量给env添加属性和值
  console.log = function () { }
  console.error = function () { }
  console.dir = function () { }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
