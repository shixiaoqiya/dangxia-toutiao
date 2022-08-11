import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token';

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    redirect: "/layout/home", //重定向到home页面  默认显示home页面
    component: () => import('@/views/Login')
  },
  {
    path: '/login',
    name: "Login",
    component: () => import('@/views/Login'),
    //独享守卫
    // beforeEnter: (to, from, next) => {
    //   // if (getToken() && to.path === '/login') {
    //   //   next(false)  //如果已经处于登陆状态 不能切换到登陆页面
    //   // } else {
    //   //   next() //其余情况都放行
    //   // }
    // }
  },
  {
    path: '/layout',
    name: "Layout",
    redirect: "/layout/home", //默认显示二级页面home
    component: () => import('@/views/Layout'),
    // 二级路由 home user页面
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import('@/views/Home')
      },
      {
        path: "user",
        name: "User",
        component: () => import('@/views/User')
      },
    ]
  },
  {
    path: '/search',
    name: "Search",
    component: () => import('@/views/Search')
  },
  //搜索结果页面
  {
    path: '/searchResult/:kw',
    name: "SearchResult",
    component: () => import('@/views/Search/SearchResult')
  },
  //文章详情页
  {
    path: '/articleDetail',
    name: "ArticleDetail",
    component: () => import('@/views/ArticleDetail')
  },
  {
    path: '/userEditor',
    name: "UserEditor",
    component: () => import('@/views/User/UserEditor')
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import('@/views/Chat')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

//路由前置守卫 
router.beforeEach((to, from, next) => {
  if (getToken() && to.path === '/login') {
    next(false) //如果已经处于登陆状态 不能切换到登陆页面 
  } else {
    next() //其余情况都放行
  }
})
export default router
