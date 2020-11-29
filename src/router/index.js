import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users'
Vue.use(VueRouter)

const routes = [{
  path: '/',
  //重定向
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome,
  }, {
    path: '/users',
    component: Users
  }]
}, ]

const router = new VueRouter({
  routes
})
//设置路由导航守卫
router.beforeEach((to, from, next) => {
  // to要去的页面 from从哪里来 next放行 
  if (to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  //验证token是否存在
  //不存在强制跳转到login页面
  if (!tokenStr) return next('/login')
  next()

})
export default router