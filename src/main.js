// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import Cookies from 'vue-cookies'
import JSEncrypt  from 'jsencrypt'
import VueCropper from 'vue-cropper' 
import VueSimplemde from 'vue-simplemde'
import 'simplemde/dist/simplemde.min.css'
import EasySlider from "vue-easy-slider";
import VueQuillEditor from 'vue-quill-editor'  //引入富文本编译器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


import Carousel3d from "vue-carousel-3d";

Vue.use(Carousel3d);

Vue.use(VueAxios,axios)
Vue.use(VueQuillEditor);
Vue.use(EasySlider);
Vue.component('vue-simplemde', VueSimplemde)
Vue.use(VueSimplemde)
Vue.use(VueCropper)
Vue.prototype.$jsEncrypt = JSEncrypt
Vue.use(Cookies)   //是否可以不用?!
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App},
  template: '<App/>'
})

router.beforeEach((to, from, next)=>{    //讓 user 不管造訪哪一頁都要先驗證 token
  const isLogin =$cookies.get('token') !== null;//登入的狀態
  if( isLogin ){
    next();
  } else {
    if( to.path =="/userInfo"){ //去的地方是會員頁的話不給過
        alert("這裡是會員專區，請先登入或註冊，獲得更多會員專屬功能唷 :  )")
        next('/login'); //否則強制回到登入頁
    }else{ //其餘給過
      next();
      }
  }
});
