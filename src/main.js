import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
//导入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios设置响应拦截器
axios.interceptors.response.use(response => {
  return response.data //拦截处理响应结果，直接返回需要的数据
}, err => {
  console.log(err)
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')