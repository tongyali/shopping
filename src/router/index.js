import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
}]

const router = new VueRouter({
  routes
})
//路由导航卫士  挂载在路由对象上
router.beforeEach((to, from, next) => {
  //如果访问的是login页面 直接next
  if (to.path == '/login') return next()
  //判断是否有token存在在浏览器
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return this.$router.push('/login')
  return next()
})

export default router