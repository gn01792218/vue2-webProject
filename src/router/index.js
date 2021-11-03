import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/Home'
import Header from '@/components/Header'
import Login from '@/view/Login'
import Registered from '@/view/Registered'
import UserInfo from '@/view/UserInfo'
import ProductShow from '@/view/ProductShow'
import ProductHistoryShow from '@/view/ProductHistoryShow'
import Productclassification from '@/view/Productclassification'
import ProductDisplayType from '@/view/ProductDisplayType'
import ArticleShow from '@/components/ArticleShow'
import ArticleShowFilter from'@/components/ArticleShowFilter'
import Discuss from'@/view/Discuss'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      components:{
        default: Home,  //，沒指定的會 fallback 至 default。
        nav:Header,   //key 名將會自動匹配到指定 name 的 router-view
      }
    },
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'/registered',
      name:'registered',
      component:Registered
    },
    {
      path:'/userInfo/:userId',
      name:'userInfo',
      component:UserInfo
    },
    {
      path:'/productclassification',
      name:'productclassification',
      component:Productclassification
    },
    {
      path:'/productDisplayType/:productType',
      name:'ProductDisplayType',
      component:ProductDisplayType,
    },
    {
      path:'/discuss',
      name:'discuss',
      component:Discuss
    },
    {
      path:'/articleShow/:showArticleId',
      name:'ArticleShow',
      component:ArticleShow
    },
    {
      path:'/ArticleShowFilter/:tag',
      name:'ArticleShowFilter',
      component:ArticleShowFilter,
    },
    // {
    //   path:'/productShow',
    //   name:'productShow',
    //   component:ProductShow,
    // },
    {
      path:'/productShow/:productId',
      name:'productShow',
      component:ProductShow,
    },
    {
      path:'/ProductHistoryShow/:productId',
      name:'ProductHistoryShow',
      component:ProductHistoryShow,
    },
    {
      path: '*',  //讓其他錯誤路由都
      redirect: '/',  //返回根頁
    },
  
  ]
})
