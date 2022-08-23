import Vue from 'vue'
import VueRouter from 'vue-router'
// import Register from '@/views/register'
// import Login from '@/views/login'
import Layout from '@/views/layout'

Vue.use(VueRouter)
const routes = [
  // { path: '/', redirect: '/login' }, // 默认去登录页
  {
    path: '/register',
    component: () => import('@/views/register') // webpack提供import 函数来路由懒加载，路径切换时才去加载对应的组件
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  { path: '/', component: Layout } // 默认打开去布局页
]
const router = new VueRouter({
  routes
})
export default router
